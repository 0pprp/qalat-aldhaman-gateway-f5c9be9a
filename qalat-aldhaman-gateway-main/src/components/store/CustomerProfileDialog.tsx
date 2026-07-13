import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  IRAQI_GOVERNORATES,
  IRAQI_PHONE_REGEX,
  useCustomerProfile,
  type IraqiGovernorate,
} from '@/contexts/CustomerProfileContext';

interface FormErrors {
  name?: string;
  governorate?: string;
  phone?: string;
}

const CustomerProfileDialog = () => {
  const { t, isRTL } = useLanguage();
  const { isProfileComplete, setProfile } = useCustomerProfile();

  const [name, setName] = useState('');
  const [governorate, setGovernorate] = useState<IraqiGovernorate | ''>('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  if (isProfileComplete) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = t('الرجاء إدخال الاسم الكامل', 'Please enter your full name');
    }
    if (!governorate) {
      nextErrors.governorate = t('الرجاء اختيار المحافظة', 'Please select your governorate');
    }
    if (!IRAQI_PHONE_REGEX.test(phone)) {
      nextErrors.phone = t(
        'رقم الهاتف غير صحيح، يجب أن يكون بصيغة 07XXXXXXXXX',
        'Invalid phone number, it must be in the format 07XXXXXXXXX',
      );
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setProfile({ name: name.trim(), governorate: governorate as IraqiGovernorate, phone });
  };

  return (
    <Dialog open>
      <DialogContent
        className={`[&>button]:hidden ${isRTL ? 'font-arabic' : ''}`}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className={isRTL ? 'text-right sm:text-right' : ''}>
          <DialogTitle>{t('أكمل بياناتك للمتابعة', 'Complete Your Profile to Continue')}</DialogTitle>
          <DialogDescription>
            {t(
              'نحتاج هذه البيانات لإتمام طلبك عبر الدفع عند الاستلام.',
              'We need this information to complete your cash-on-delivery order.',
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">{t('الاسم الكامل', 'Full Name')}</Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('مثال: أحمد محمد', 'e.g. Ahmed Mohammed')}
              className={isRTL ? 'text-right' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-governorate">{t('المحافظة', 'Governorate')}</Label>
            <Select value={governorate} onValueChange={(value) => setGovernorate(value as IraqiGovernorate)}>
              <SelectTrigger id="customer-governorate">
                <SelectValue placeholder={t('اختر المحافظة', 'Select governorate')} />
              </SelectTrigger>
              <SelectContent>
                {IRAQI_GOVERNORATES.map((gov) => (
                  <SelectItem key={gov} value={gov}>
                    {gov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.governorate && <p className="text-sm text-destructive">{errors.governorate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">{t('رقم الهاتف', 'Phone Number')}</Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXXX"
              inputMode="numeric"
              dir="ltr"
              className="text-left"
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <Button type="submit" className="w-full">
            {t('متابعة', 'Continue')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerProfileDialog;
