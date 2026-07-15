import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  RotateCw,
  Upload,
  X,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IRAQI_PHONE_REGEX, useCustomerProfile } from '@/contexts/CustomerProfileContext';
import { createOrder, fetchGovernorates, fetchProductDetail } from '@/lib/storeApi';
import { ApiError, resolveMediaUrl, uploadFile } from '@/lib/api';
import { formatIQD } from '@/lib/utils';
import type { MediaType, PurchaseMethod } from '@/types/store';

const KNOWN_METHODS: PurchaseMethod[] = ['Cash', 'MonthlyInstallment', 'MonthlyRafidain', 'DailyInstallment'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const StoreOrderFormContent = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const { t, isRTL } = useLanguage();
  const { profile, setProfile } = useCustomerProfile();
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const rawMethod = searchParams.get('method');
  const method = (KNOWN_METHODS as string[]).includes(rawMethod ?? '') ? (rawMethod as PurchaseMethod) : null;

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
    refetch: refetchProduct,
    isFetching: isProductFetching,
  } = useQuery({
    queryKey: ['store-product', productId],
    queryFn: () => fetchProductDetail(productId ?? ''),
    enabled: !!productId,
  });

  const { data: governorates } = useQuery({
    queryKey: ['governorates'],
    queryFn: fetchGovernorates,
  });

  // الحقول المشتركة
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [governorateId, setGovernorateId] = useState<number | null>(null);

  // قسط شهري / رافدين
  const [homeAddress, setHomeAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');

  // قسط يومي
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLng, setGpsLng] = useState<number | null>(null);

  // فئة "أخرى"
  const [customProductDescription, setCustomProductDescription] = useState('');

  const [clientError, setClientError] = useState<string | null>(null);

  // تعبئة تلقائية من البروفايل المحفوظ (مرة واحدة فقط، الحقول تبقى قابلة للتعديل بالكامل بعدها)
  const hasAutoFilledRef = useRef(false);
  useEffect(() => {
    if (hasAutoFilledRef.current) return;
    if (!profile || !governorates) return;
    hasAutoFilledRef.current = true;
    setCustomerName(profile.name);
    setPhoneNumber(profile.phone);
    const matched = governorates.find((g) => g.name === profile.governorate);
    if (matched) setGovernorateId(matched.id);
  }, [profile, governorates]);

  const totalForMethod = !product || !method
    ? null
    : method === 'Cash'
      ? product.cashPrice
      : method === 'DailyInstallment'
        ? product.dailyTotalPrice
        : product.monthlyTotalPrice;

  const paymentForMethod = !product || !method || method === 'Cash'
    ? null
    : method === 'DailyInstallment'
      ? product.dailyPaymentAmount
      : product.monthlyPaymentAmount;

  const methodAllowed =
    !!product &&
    !!method &&
    totalForMethod != null &&
    (method === 'Cash' || paymentForMethod != null) &&
    ((method === 'Cash' && product.category.allowsCash) ||
      ((method === 'MonthlyInstallment' || method === 'MonthlyRafidain') && product.category.allowsMonthlyInstallment) ||
      (method === 'DailyInstallment' && product.category.allowsDailyInstallment));

  const methodLabels: Record<PurchaseMethod, string> = {
    Cash: t('الدفع نقداً', 'Cash Payment'),
    MonthlyInstallment: t('قسط شهري', 'Monthly Installment'),
    MonthlyRafidain: t('قسط شهري — عبر منصة الرافدين', 'Monthly Installment — via Al-Rafidain'),
    DailyInstallment: t('قسط يومي', 'Daily Installment'),
  };

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      const governorateName = governorates?.find((g) => g.id === governorateId)?.name ?? '';
      setProfile({ name: customerName.trim(), governorate: governorateName, phone: phoneNumber.trim() });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMediaError(
        t('نوع الملف غير مدعوم، يُسمح فقط بصور jpg أو png أو webp', 'Unsupported file type — only jpg/png/webp images are allowed'),
      );
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setMediaError(t('حجم الصورة يتجاوز الحد الأقصى المسموح (10 ميجابايت)', 'Image size exceeds the 10MB limit'));
      return;
    }

    setMediaError(null);
    setIsUploadingMedia(true);
    try {
      const result = await uploadFile(file, 'products');
      setMediaUrl(result.url);
      setMediaType('Photo');
    } catch (err) {
      setMediaError(err instanceof ApiError ? err.message : t('فشل رفع الصورة', 'Failed to upload the image'));
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleRemoveMedia = () => {
    setMediaUrl(null);
    setMediaType(null);
    setMediaError(null);
  };

  const handleCaptureLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      setGpsError(t('متصفحك لا يدعم تحديد الموقع الجغرافي', 'Your browser does not support geolocation'));
      return;
    }

    setGpsStatus('requesting');
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLat(position.coords.latitude);
        setGpsLng(position.coords.longitude);
        setGpsStatus('success');
      },
      () => {
        setGpsStatus('error');
        setGpsError(
          t(
            'تعذر تحديد موقعك. تأكد من تفعيل صلاحية الموقع لهذا الموقع من إعدادات المتصفح ثم أعد المحاولة.',
            'Could not determine your location. Make sure location permission is enabled for this site in your browser settings, then try again.',
          ),
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];

    if (!customerName.trim()) missing.push(t('الاسم الكامل', 'Full name'));
    if (!IRAQI_PHONE_REGEX.test(phoneNumber.trim())) {
      missing.push(t('رقم الهاتف (بصيغة صحيحة 07XXXXXXXXX)', 'Phone number (valid 07XXXXXXXXX format)'));
    }
    if (!governorateId) missing.push(t('المحافظة', 'Governorate'));

    if (method === 'MonthlyInstallment' || method === 'MonthlyRafidain') {
      if (!homeAddress.trim()) missing.push(t('عنوان السكن', 'Home address'));
      if (!nearestLandmark.trim()) missing.push(t('أقرب نقطة دالة', 'Nearest landmark'));
    }

    if (method === 'DailyInstallment') {
      if (!shopName.trim()) missing.push(t('اسم المحل', 'Shop name'));
      if (!shopAddress.trim()) missing.push(t('عنوان المحل', 'Shop address'));
      if (!nearestLandmark.trim()) missing.push(t('أقرب نقطة دالة', 'Nearest landmark'));
      if (!mediaUrl) missing.push(t('صورة المحل', 'Shop photo'));
      if (gpsLat == null || gpsLng == null) missing.push(t('تحديد الموقع (GPS)', 'Location (GPS)'));
    }

    if (product?.category.hasCustomProductField && !customProductDescription.trim()) {
      missing.push(t('وصف المنتج المطلوب', 'Requested product description'));
    }

    return missing;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !product) return;

    const missing = getMissingFields();
    if (missing.length > 0) {
      setClientError(`${t('الحقول التالية مطلوبة', 'The following fields are required')}: ${missing.join(isRTL ? '، ' : ', ')}`);
      return;
    }

    setClientError(null);

    orderMutation.mutate({
      productId: product.id,
      purchaseMethod: method,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      governorateId: governorateId as number,
      homeAddress: method === 'MonthlyInstallment' || method === 'MonthlyRafidain' ? homeAddress.trim() : undefined,
      nearestLandmark:
        method === 'MonthlyInstallment' || method === 'MonthlyRafidain' || method === 'DailyInstallment'
          ? nearestLandmark.trim()
          : undefined,
      shopName: method === 'DailyInstallment' ? shopName.trim() : undefined,
      shopAddress: method === 'DailyInstallment' ? shopAddress.trim() : undefined,
      mediaUrl: method === 'DailyInstallment' ? (mediaUrl ?? undefined) : undefined,
      mediaType: method === 'DailyInstallment' ? (mediaType ?? undefined) : undefined,
      gpsLat: method === 'DailyInstallment' ? (gpsLat ?? undefined) : undefined,
      gpsLng: method === 'DailyInstallment' ? (gpsLng ?? undefined) : undefined,
      customProductDescription: product.category.hasCustomProductField ? customProductDescription.trim() : undefined,
    });
  };

  const backToProductLink = productId ? `/store/product/${productId}` : '/store';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24 min-h-[60vh] section-container">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={backToProductLink}
            className={`inline-flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
          >
            <BackArrowIcon className="w-4 h-4" />
            <span>{t('رجوع', 'Back')}</span>
          </Link>
        </div>

        {isProductLoading && (
          <div className="max-w-xl mx-auto space-y-4">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {isProductError && (
          <div className="text-center py-16">
            <p className={`text-destructive mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {productError instanceof Error ? productError.message : t('تعذر تحميل المنتج', 'Failed to load product')}
            </p>
            <Button onClick={() => refetchProduct()} disabled={isProductFetching} className="gap-2">
              <RotateCw className={`w-4 h-4 ${isProductFetching ? 'animate-spin' : ''}`} />
              {t('إعادة المحاولة', 'Retry')}
            </Button>
          </div>
        )}

        {!isProductLoading && !isProductError && product && !methodAllowed && (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className={`text-destructive mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t('طريقة الدفع هذه غير متاحة لهذا المنتج', 'This payment method is not available for this product')}
            </p>
            <Link to={backToProductLink} className="text-primary hover:underline">
              {t('رجوع لصفحة المنتج', 'Back to product page')}
            </Link>
          </div>
        )}

        {!isProductLoading && !isProductError && product && methodAllowed && method && (
          <>
            {orderMutation.isSuccess ? (
              <div className="text-center py-16 max-w-lg mx-auto">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className={`text-2xl font-bold text-foreground mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('تم استلام طلبك بنجاح', 'Your order was received successfully')}
                </h2>
                <p className={`text-muted-foreground mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('رقم الطلب', 'Order Number')}:{' '}
                  <span className="font-semibold text-foreground" dir="ltr">
                    {orderMutation.data.orderNumber}
                  </span>
                </p>
                <p className={`text-muted-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('سيتواصل معك مندوب المبيعات قريباً', 'A sales representative will contact you soon')}
                </p>
                {orderMutation.data.contractPdfUrl && (
                  <a
                    href={resolveMediaUrl(orderMutation.data.contractPdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-primary hover:underline mb-6 ${isRTL ? 'font-arabic' : ''}`}
                  >
                    <FileText className="w-4 h-4" />
                    {t('عرض عقد الشراء', 'View Purchase Contract')}
                  </a>
                )}
                <div>
                  <Link to="/store" className={`text-sm text-muted-foreground hover:text-primary ${isRTL ? 'font-arabic' : ''}`}>
                    {t('العودة للمتجر', 'Back to Store')}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <div className="rounded-2xl bg-card border border-border p-5 mb-6 text-center">
                  <h1 className={`text-lg font-bold text-foreground mb-1 ${isRTL ? 'font-arabic' : ''}`}>{product.name}</h1>
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {methodLabels[method]} —{' '}
                    {method === 'Cash'
                      ? totalForMethod != null && formatIQD(totalForMethod)
                      : totalForMethod != null &&
                        paymentForMethod != null && (
                          <>
                            {t('المبلغ الكلي', 'Total')} {formatIQD(totalForMethod)} (
                            {method === 'DailyInstallment' ? t('دفعة يومية', 'daily payment') : t('دفعة شهرية', 'monthly payment')}{' '}
                            {formatIQD(paymentForMethod)})
                          </>
                        )}
                  </p>
                </div>

                {clientError && (
                  <p className={`text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-4 ${isRTL ? 'font-arabic text-right' : ''}`}>
                    {clientError}
                  </p>
                )}

                {orderMutation.isError && (
                  <p className={`text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-4 ${isRTL ? 'font-arabic text-right' : ''}`}>
                    {orderMutation.error instanceof Error
                      ? orderMutation.error.message
                      : t('حدث خطأ غير متوقع، حاول مرة أخرى', 'An unexpected error occurred, please try again')}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-customer-name">{t('الاسم الكامل', 'Full Name')}</Label>
                    <Input
                      id="order-customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-phone">{t('رقم الهاتف', 'Phone Number')}</Label>
                    <Input
                      id="order-phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07XXXXXXXXX"
                      inputMode="numeric"
                      dir="ltr"
                      className="text-left"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-governorate">{t('المحافظة', 'Governorate')}</Label>
                    <Select
                      value={governorateId ? String(governorateId) : ''}
                      onValueChange={(value) => setGovernorateId(Number(value))}
                    >
                      <SelectTrigger id="order-governorate">
                        <SelectValue placeholder={t('اختر المحافظة', 'Select governorate')} />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates?.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(method === 'MonthlyInstallment' || method === 'MonthlyRafidain') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="order-home-address">{t('عنوان السكن', 'Home Address')}</Label>
                        <Input
                          id="order-home-address"
                          value={homeAddress}
                          onChange={(e) => setHomeAddress(e.target.value)}
                          className={isRTL ? 'text-right' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order-landmark">{t('أقرب نقطة دالة', 'Nearest Landmark')}</Label>
                        <Input
                          id="order-landmark"
                          value={nearestLandmark}
                          onChange={(e) => setNearestLandmark(e.target.value)}
                          className={isRTL ? 'text-right' : ''}
                        />
                      </div>
                    </>
                  )}

                  {method === 'DailyInstallment' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="order-shop-name">{t('اسم المحل', 'Shop Name')}</Label>
                        <Input
                          id="order-shop-name"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className={isRTL ? 'text-right' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order-shop-address">{t('عنوان المحل', 'Shop Address')}</Label>
                        <Input
                          id="order-shop-address"
                          value={shopAddress}
                          onChange={(e) => setShopAddress(e.target.value)}
                          className={isRTL ? 'text-right' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order-landmark-daily">{t('أقرب نقطة دالة', 'Nearest Landmark')}</Label>
                        <Input
                          id="order-landmark-daily"
                          value={nearestLandmark}
                          onChange={(e) => setNearestLandmark(e.target.value)}
                          className={isRTL ? 'text-right' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="order-media">{t('صورة المحل', 'Shop Photo')}</Label>
                        {mediaUrl ? (
                          <div className="flex items-center gap-3 rounded-lg border border-border p-2">
                            <img src={resolveMediaUrl(mediaUrl)} alt="" className="w-14 h-14 rounded object-cover" />
                            <span className={`text-sm text-primary flex-1 ${isRTL ? 'font-arabic' : ''}`}>
                              {t('تمت إضافة الصورة', 'Photo added')}
                            </span>
                            <Button type="button" variant="ghost" size="icon" onClick={handleRemoveMedia}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <label
                              htmlFor="order-media"
                              className="flex items-center justify-center gap-2 border border-dashed border-border rounded-lg py-3 cursor-pointer hover:border-primary/50 transition-colors text-sm text-muted-foreground"
                            >
                              {isUploadingMedia ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  {t('جارِ الرفع...', 'Uploading...')}
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  {t('اختر صورة للمحل', 'Choose a shop photo')}
                                </>
                              )}
                            </label>
                            <input
                              id="order-media"
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              disabled={isUploadingMedia}
                              onChange={handleFileChange}
                            />
                          </div>
                        )}
                        <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic text-right' : ''}`}>
                          {t(
                            'يُسمح بالصور فقط حالياً (jpg/png/webp حتى 10MB). دعم رفع الفيديو سيُضاف لاحقاً.',
                            'Only images are supported for now (jpg/png/webp up to 10MB). Video upload support will be added later.',
                          )}
                        </p>
                        {mediaError && <p className="text-sm text-destructive">{mediaError}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>{t('موقع المحل (GPS)', 'Shop Location (GPS)')}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={handleCaptureLocation}
                          disabled={gpsStatus === 'requesting'}
                        >
                          {gpsStatus === 'requesting' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {gpsStatus === 'success'
                            ? t('✓ تم تحديد الموقع (إعادة الالتقاط)', '✓ Location captured (recapture)')
                            : t('التقط موقعي الحالي', 'Capture My Current Location')}
                        </Button>
                        {gpsError && <p className="text-sm text-destructive">{gpsError}</p>}
                      </div>
                    </>
                  )}

                  {product.category.hasCustomProductField && (
                    <div className="space-y-2">
                      <Label htmlFor="order-custom-description">
                        {t('شنو المنتج المطلوب بالضبط؟', 'What exactly is the requested product?')}
                      </Label>
                      <Textarea
                        id="order-custom-description"
                        value={customProductDescription}
                        onChange={(e) => setCustomProductDescription(e.target.value)}
                        className={isRTL ? 'text-right' : ''}
                      />
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={orderMutation.isPending}>
                    {orderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t('تأكيد الطلب', 'Confirm Order')}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

const StoreOrderForm = () => (
  <LanguageProvider>
    <StoreOrderFormContent />
  </LanguageProvider>
);

export default StoreOrderForm;
