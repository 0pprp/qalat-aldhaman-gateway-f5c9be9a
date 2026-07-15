import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText, Loader2, PackageSearch, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { IRAQI_PHONE_REGEX } from '@/contexts/CustomerProfileContext';
import { fetchOrdersByPhone } from '@/lib/storeApi';
import { ApiError, resolveMediaUrl } from '@/lib/api';
import { formatIQD } from '@/lib/utils';
import type { OrderLookupResult, OrderStatus, PurchaseMethod } from '@/types/store';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  ContactedByRep: 'bg-blue-100 text-blue-800 border-blue-300',
  Confirmed: 'bg-green-100 text-green-800 border-green-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
  Completed: 'bg-green-100 text-green-800 border-green-300',
};

const MyOrdersDialog = () => {
  const { t, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [results, setResults] = useState<OrderLookupResult[] | null>(null);

  const statusLabels: Record<OrderStatus, string> = {
    Pending: t('قيد المراجعة', 'Pending Review'),
    ContactedByRep: t('تم التواصل من المندوب', 'Contacted by Rep'),
    Confirmed: t('تم التأكيد', 'Confirmed'),
    Rejected: t('مرفوض', 'Rejected'),
    Completed: t('مكتمل', 'Completed'),
  };

  const methodLabels: Record<PurchaseMethod, string> = {
    Cash: t('الدفع نقداً', 'Cash Payment'),
    MonthlyInstallment: t('قسط شهري', 'Monthly Installment'),
    MonthlyRafidain: t('قسط شهري — عبر منصة الرافدين', 'Monthly Installment — via Al-Rafidain'),
    DailyInstallment: t('قسط يومي', 'Daily Installment'),
  };

  const lookupMutation = useMutation({
    mutationFn: (phoneToSearch: string) => fetchOrdersByPhone(phoneToSearch),
    onSuccess: (data) => setResults(data),
  });

  const handleSearch = () => {
    const trimmedPhone = phone.trim();
    setPhoneError(null);
    setResults(null);

    if (!IRAQI_PHONE_REGEX.test(trimmedPhone)) {
      setPhoneError(
        t(
          'رقم الهاتف غير صحيح، يجب أن يكون بصيغة 07XXXXXXXXX',
          'Invalid phone number, must be in the format 07XXXXXXXXX',
        ),
      );
      return;
    }

    lookupMutation.mutate(trimmedPhone);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPhone('');
      setPhoneError(null);
      setResults(null);
      lookupMutation.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-1.5 ${isRTL ? 'font-arabic' : ''}`}>
          <PackageSearch className="w-4 h-4" />
          {t('طلباتي', 'My Orders')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={isRTL ? 'font-arabic' : ''}>{t('طلباتي', 'My Orders')}</DialogTitle>
          <DialogDescription className={isRTL ? 'font-arabic' : ''}>
            {t(
              'أدخل رقم هاتفك لعرض كل طلباتك السابقة وحالتها',
              'Enter your phone number to view all your previous orders and their status',
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lookup-phone" className={isRTL ? 'font-arabic' : ''}>
              {t('رقم الهاتف', 'Phone Number')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="lookup-phone"
                dir="ltr"
                placeholder="07XXXXXXXXX"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={lookupMutation.isPending} className="gap-1.5 shrink-0">
                {lookupMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {t('بحث', 'Search')}
              </Button>
            </div>
            {phoneError && (
              <p className={`text-sm text-destructive ${isRTL ? 'font-arabic' : ''}`}>{phoneError}</p>
            )}
          </div>

          {lookupMutation.isError && (
            <p className={`text-sm text-destructive ${isRTL ? 'font-arabic' : ''}`}>
              {lookupMutation.error instanceof ApiError
                ? lookupMutation.error.message
                : t('تعذر الاتصال بالخادم', 'Failed to connect to server')}
            </p>
          )}

          {results !== null && results.length === 0 && !lookupMutation.isError && (
            <p className={`text-sm text-muted-foreground text-center py-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t('لا توجد طلبات بهذا الرقم', 'No orders found for this number')}
            </p>
          )}

          {results && results.length > 0 && (
            <div className="space-y-3">
              {results.map((order) => (
                <div key={order.orderNumber} className="rounded-lg border border-border p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm" dir="ltr">
                      {order.orderNumber}
                    </span>
                    <Badge variant="outline" className={STATUS_STYLES[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <p className={`text-sm text-foreground ${isRTL ? 'font-arabic' : ''}`}>{order.productName}</p>
                  <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {methodLabels[order.purchaseMethod]}
                  </p>
                  <p className="text-sm">
                    {formatIQD(order.totalPriceSnapshot)}
                    {order.installmentPaymentAmountSnapshot != null && (
                      <span className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                        {' '}
                        ({formatIQD(order.installmentPaymentAmountSnapshot)} {t('دفعة دورية', 'per installment')})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US')}
                  </p>
                  {order.contractPdfUrl && (
                    <a
                      href={resolveMediaUrl(order.contractPdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-sm text-primary hover:underline ${isRTL ? 'font-arabic' : ''}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {t('عرض العقد', 'View Contract')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyOrdersDialog;
