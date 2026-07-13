import React, { createContext, useContext, useState, ReactNode } from 'react';

export const IRAQI_GOVERNORATES = [
  'بغداد',
  'البصرة',
  'نينوى',
  'أربيل',
  'النجف',
  'كربلاء',
  'الأنبار',
  'ديالى',
  'صلاح الدين',
  'كركوك',
  'واسط',
  'ميسان',
  'ذي قار',
  'المثنى',
  'القادسية',
  'بابل',
  'دهوك',
  'السليمانية',
] as const;

export type IraqiGovernorate = (typeof IRAQI_GOVERNORATES)[number];

export const IRAQI_PHONE_REGEX = /^07\d{9}$/;

export interface CustomerProfile {
  name: string;
  // نص حر وليس IraqiGovernorate: فورم الطلب الفعلي يخزّن هنا اسم المحافظة القادم من
  // /api/governorates بالباك اند (12 محافظة حقيقية)، وأسماؤها لا تطابق دائماً القائمة
  // الـ18 أعلاه (المستخدمة فقط بنافذة تعبئة البروفايل المستقلة).
  governorate: string;
  phone: string;
}

const STORAGE_KEY = 'qad_customer_profile';

interface CustomerProfileContextType {
  profile: CustomerProfile | null;
  isProfileComplete: boolean;
  setProfile: (profile: CustomerProfile) => void;
  clearProfile: () => void;
}

const CustomerProfileContext = createContext<CustomerProfileContextType | undefined>(undefined);

const readStoredProfile = (): CustomerProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerProfile) : null;
  } catch {
    return null;
  }
};

export const CustomerProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<CustomerProfile | null>(readStoredProfile);

  const setProfile = (next: CustomerProfile) => {
    setProfileState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const clearProfile = () => {
    setProfileState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CustomerProfileContext.Provider value={{ profile, isProfileComplete: !!profile, setProfile, clearProfile }}>
      {children}
    </CustomerProfileContext.Provider>
  );
};

export const useCustomerProfile = () => {
  const context = useContext(CustomerProfileContext);
  if (!context) {
    throw new Error('useCustomerProfile must be used within a CustomerProfileProvider');
  }
  return context;
};
