import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarClock,
  CalendarDays,
  FileText,
  Landmark,
  Package,
  RotateCw,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/landing/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import StorePageBackground from '@/components/store/StorePageBackground';
import { fetchProductDetail } from '@/lib/storeApi';
import { resolveMediaUrl } from '@/lib/api';
import { formatIQD } from '@/lib/utils';

const PURCHASE_BUTTON_CLASS =
  'w-full items-start sm:items-center justify-start gap-3 whitespace-normal text-start h-auto min-h-12 py-3 leading-snug';

const StoreProductDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['store-product', id],
    queryFn: () => fetchProductDetail(id ?? ''),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen relative">
      <StorePageBackground />
      <Header />
      <main className="pt-32 pb-24 min-h-[60vh] section-container">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={product ? `/store/category/${product.category.slug}` : '/store'}
            className={`inline-flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
          >
            <BackArrowIcon className="w-4 h-4" />
            <span>{t('رجوع', 'Back')}</span>
          </Link>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full mt-6" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className={`text-destructive mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {error instanceof Error ? error.message : t('تعذر تحميل المنتج', 'Failed to load product')}
            </p>
            <Button onClick={() => refetch()} disabled={isFetching} className="gap-2">
              <RotateCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              {t('إعادة المحاولة', 'Retry')}
            </Button>
          </div>
        )}

        {!isLoading && !isError && product && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto"
          >
            <div>
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center border border-primary/20 shadow-[0_10px_30px_-8px_rgba(15,91,87,0.25)]">
                {product.images.length > 0 ? (
                  <img
                    src={resolveMediaUrl(product.images[selectedImageIndex]?.imageUrl ?? product.images[0].imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-16 h-16 text-muted-foreground/50" />
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? 'border-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img src={resolveMediaUrl(image.imageUrl)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold text-foreground mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {product.name}
              </h1>

              {product.description && (
                <p className={`text-muted-foreground mb-6 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                  {product.description}
                </p>
              )}

              {product.category.requiresShopOwner && (
                <p
                  className={`text-sm bg-accent/15 text-accent-foreground border border-accent/30 rounded-lg px-4 py-3 mb-6 ${isRTL ? 'font-arabic text-right' : ''}`}
                >
                  {t(
                    'هذا المنتج متاح فقط لأصحاب المحلات (قسط يومي)',
                    'This product is only available to shop owners (daily installment)',
                  )}
                </p>
              )}

              <div className="space-y-3">
                {product.category.allowsCash && product.cashPrice != null && (
                  <Button asChild size="lg" className={PURCHASE_BUTTON_CLASS}>
                    <Link to={`/store/order/${product.id}?method=Cash`}>
                      <Banknote className="w-5 h-5 shrink-0" />
                      <span className={isRTL ? 'font-arabic' : ''}>
                        {t('شراء نقداً', 'Buy with Cash')} — {formatIQD(product.cashPrice)}
                      </span>
                    </Link>
                  </Button>
                )}

                {product.category.allowsMonthlyInstallment &&
                  product.monthlyTotalPrice != null &&
                  product.monthlyPaymentAmount != null && (
                    <Button asChild size="lg" variant="secondary" className={PURCHASE_BUTTON_CLASS}>
                      <Link to={`/store/order/${product.id}?method=MonthlyInstallment`}>
                        <CalendarClock className="w-5 h-5 shrink-0" />
                        <span className={isRTL ? 'font-arabic' : ''}>
                          {t('قسط شهري', 'Monthly Installment')} — {t('المبلغ الكلي', 'Total')}{' '}
                          {formatIQD(product.monthlyTotalPrice)} ({t('دفعة شهرية', 'monthly payment')}{' '}
                          {formatIQD(product.monthlyPaymentAmount)}
                          {product.monthlyDownPayment != null && (
                            <>
                              {t('، ', ', ')}
                              {t('مقدمة', 'down payment')} {formatIQD(product.monthlyDownPayment)}
                            </>
                          )}
                          )
                        </span>
                      </Link>
                    </Button>
                  )}

                {product.category.allowsMonthlyInstallment &&
                  product.rafidainTotalPrice != null &&
                  product.rafidainPaymentAmount != null && (
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className={`${PURCHASE_BUTTON_CLASS} bg-secondary/80 border-2 border-accent/70 hover:bg-secondary/70`}
                    >
                      <Link to={`/store/order/${product.id}?method=MonthlyRafidain`}>
                        <Landmark className="w-5 h-5 shrink-0" />
                        <span className={isRTL ? 'font-arabic' : ''}>
                          {t('قسط شهري — عبر منصة الرافدين (للموظفين)', 'Monthly Installment — via Al-Rafidain (Employees)')} —{' '}
                          {t('المبلغ الكلي', 'Total')} {formatIQD(product.rafidainTotalPrice)} ({t('دفعة شهرية', 'monthly payment')}{' '}
                          {formatIQD(product.rafidainPaymentAmount)}
                          {product.rafidainDownPayment != null && (
                            <>
                              {t('، ', ', ')}
                              {t('مقدمة', 'down payment')} {formatIQD(product.rafidainDownPayment)}
                            </>
                          )}
                          )
                        </span>
                      </Link>
                    </Button>
                  )}

                {product.category.allowsDailyInstallment &&
                  product.dailyTotalPrice != null &&
                  product.dailyPaymentAmount != null && (
                    <Button asChild size="lg" variant="secondary" className={PURCHASE_BUTTON_CLASS}>
                      <Link to={`/store/order/${product.id}?method=DailyInstallment`}>
                        <CalendarDays className="w-5 h-5 shrink-0" />
                        <span className={isRTL ? 'font-arabic' : ''}>
                          {t('قسط يومي', 'Daily Installment')} — {t('المبلغ الكلي', 'Total')}{' '}
                          {formatIQD(product.dailyTotalPrice)} ({t('دفعة يومية', 'daily payment')}{' '}
                          {formatIQD(product.dailyPaymentAmount)})
                        </span>
                      </Link>
                    </Button>
                  )}
              </div>

              {product.contractPdfUrl && (
                <a
                  href={resolveMediaUrl(product.contractPdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm text-primary hover:underline mt-6 ${isRTL ? 'font-arabic' : ''}`}
                >
                  <FileText className="w-4 h-4" />
                  {t('عرض نموذج العقد', 'View Contract Sample')}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const StoreProductDetail = () => (
  <LanguageProvider>
    <StoreProductDetailContent />
  </LanguageProvider>
);

export default StoreProductDetail;
