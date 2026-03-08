import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Calendar, TrendingUp, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';

interface Branch {
  nameAr: string;
  nameEn: string;
  imagePath: string;
  addressAr: string;
  addressEn: string;
  tradingVolume: string;
  staffCount: number;
  coverageAr: string;
  coverageEn: string;
  yearEstablished: number;
}

const branches: Branch[] = [
  {
    nameAr: 'فرع النجف الأشرف',
    nameEn: 'Najaf Al-Ashraf Branch',
    imagePath: '/branches_pictures/najaf.jpg',
    addressAr: 'النجف - حي السلام - خلف مدينة الألعاب',
    addressEn: 'Najaf – Al-Salam Neighborhood – Behind the Amusement Park',
    tradingVolume: '10%',
    staffCount: 16,
    coverageAr: 'تغطية 90% من مدينة النجف الأشرف',
    coverageEn: 'Covers 90% of Najaf Al-Ashraf city',
    yearEstablished: 2010,
  },
  {
    nameAr: 'فرع بغداد الكرخ',
    nameEn: 'Baghdad, Karkh Branch',
    imagePath: '/branches_pictures/baghdad-karkh.jpg',
    addressAr: 'الإسكان - شارع مستشفى الأطفال - مقابل عقارات الغدير',
    addressEn: 'Al-Iskan – Pediatric Hospital Street – Opposite Al-Ghadir Real Estate',
    tradingVolume: '7%',
    staffCount: 15,
    coverageAr: 'تغطية 85% من الكرخ',
    coverageEn: 'Covers 85% of Karkh',
    yearEstablished: 2018,
  },
  {
    nameAr: 'فرع بغداد الرصافة',
    nameEn: 'Baghdad, Rusafa Branch',
    imagePath: '/branches_pictures/baghdad-rusafa.jpg',
    addressAr: 'شارع فلسطين قرب ساحة النخيل، بالقرب من كلية الرافدين',
    addressEn: 'Palestine Street near Al-Nakhel Intersection, near Al-Rafidain College',
    tradingVolume: '19%',
    staffCount: 27,
    coverageAr: 'تغطية 95% من الرصافة',
    coverageEn: 'Covers 95% of Rusafa',
    yearEstablished: 2019,
  },
  {
    nameAr: 'فرع البصرة',
    nameEn: 'Basra Branch',
    imagePath: '/branches_pictures/basra.jpg',
    addressAr: 'الجزائر - العباسية - بالقرب من شركة آسياسيل',
    addressEn: 'Al-Jaza\'er – Al-Abbasiya – Near AsiaCell Company',
    tradingVolume: '25%',
    staffCount: 33,
    coverageAr: 'تغطية 75% من محافظة البصرة',
    coverageEn: 'Covers 75% of Basra province',
    yearEstablished: 2016,
  },
  {
    nameAr: 'فرع كربلاء',
    nameEn: 'Karbala Branch',
    imagePath: '/branches_pictures/karbala.jpg',
    addressAr: 'حي الملحق - مقابل دائرة التسجيل العقاري',
    addressEn: 'Al-Mulhaq Neighborhood – Opposite the Real Estate Registration Office',
    tradingVolume: '6%',
    staffCount: 10,
    coverageAr: 'تغطية 90% من محافظة كربلاء',
    coverageEn: 'Covers 90% of Karbala province',
    yearEstablished: 2016,
  },
  {
    nameAr: 'فرع بابل',
    nameEn: 'Babylon Branch',
    imagePath: '/branches_pictures/babel.jpg',
    addressAr: 'شارع القيادة - مجاور لشركة جوان للمقاولات',
    addressEn: 'Al-Qiyada Street – Adjacent to Jawan Contracting Company',
    tradingVolume: '4%',
    staffCount: 11,
    coverageAr: 'تغطية 60% من محافظة بابل',
    coverageEn: 'Covers 60% of Babylon province',
    yearEstablished: 2018,
  },
  {
    nameAr: 'فرع السماوة',
    nameEn: 'Samawah Branch',
    imagePath: '/branches_pictures/samawah.jpg',
    addressAr: 'حي الصدر - فرع صيدلية ركن العلاج',
    addressEn: 'Al-Sadr Neighborhood – Rukn Al-Ilaj Pharmacy Branch',
    tradingVolume: '3%',
    staffCount: 9,
    coverageAr: 'تغطية 65% من مدينة السماوة',
    coverageEn: 'Covers 65% of Samawah city',
    yearEstablished: 2021,
  },
  {
    nameAr: 'فرع الناصرية',
    nameEn: 'Nasiriyah Branch',
    imagePath: '/branches_pictures/nasiriyah.jpg',
    addressAr: 'الشامخ - بالقرب من مخابز الدرويش',
    addressEn: 'Al-Shamukh – Near Al-Darwish Bakeries',
    tradingVolume: '7%',
    staffCount: 11,
    coverageAr: 'تغطية 80% من مدينة الناصرية',
    coverageEn: 'Covers 80% of Nasiriyah city',
    yearEstablished: 2021,
  },
  {
    nameAr: 'فرع الديوانية',
    nameEn: 'Diwaniyah Branch',
    imagePath: '/branches_pictures/diwaniyah.jpg',
    addressAr: 'حي الحضارة - شارع أسواق طيبة',
    addressEn: 'Al-Hadara Neighborhood – Tayba Markets Street',
    tradingVolume: '4%',
    staffCount: 11,
    coverageAr: 'تغطية 70% من مدينة الديوانية',
    coverageEn: 'Covers 70% of Diwaniyah city',
    yearEstablished: 2018,
  },
  {
    nameAr: 'فرع ديالى',
    nameEn: 'Diyala Branch',
    imagePath: '/branches_pictures/diyala.jpg',
    addressAr: 'بعقوبة - حي 9 نيسان - بالقرب من متوسطة النوارس',
    addressEn: 'Baqubah – 9 Nisan Neighborhood – Near Al-Nawares Intermediate School',
    tradingVolume: '5%',
    staffCount: 14,
    coverageAr: 'تغطية 70% من محافظة ديالى',
    coverageEn: 'Covers 70% of Diyala province',
    yearEstablished: 2020,
  },
  {
    nameAr: 'فرع الموصل',
    nameEn: 'Mosul Branch',
    imagePath: '/branches_pictures/mosul.jpg',
    addressAr: 'الجانب الأيسر - حي النور - مقابل التل خلف مشاتل النور',
    addressEn: 'Left Side – Al-Nour Neighborhood – Opposite the Hill behind Al-Nour Nurseries',
    tradingVolume: '6%',
    staffCount: 9,
    coverageAr: 'تغطية 60% من مدينة الموصل',
    coverageEn: 'Covers 60% of Mosul city',
    yearEstablished: 2024,
  },
  {
    nameAr: 'فرع كركوك',
    nameEn: 'Kirkuk Branch',
    imagePath: '/branches_pictures/kirkuk.jpg',
    addressAr: 'شارع القدس - فرع ملحمة ومشويات أبو حقي',
    addressEn: 'Al-Quds Street – Abu Haqqi Butchery and Grills Branch',
    tradingVolume: '4%',
    staffCount: 7,
    coverageAr: 'تغطية 25% من محافظة كركوك',
    coverageEn: 'Covers 25% of Kirkuk province',
    yearEstablished: 2024,
  },
];

const Branches = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    if (!selectedBranch) return;

    const handleScrollClose = () => {
      setSelectedBranch(null);
    };

    window.addEventListener('scroll', handleScrollClose, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollClose);
  }, [selectedBranch]);

  return (
    <section id="branches" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background - Abstract shapes inspired by logo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating decorative elements (primary & accent alternating) */}
      <motion.div aria-hidden="true" className="absolute left-6 top-6 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 20, 0, -10, 0], y: [0, -10, 0, 5, 0], rotate: [0, 15, 0, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-8 top-20 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -18, 0, 12, 0], y: [0, 8, 0, -6, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/2 bottom-6 w-16 h-16 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -30, 0, 30, 0], y: [0, 6, 0, -6, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="absolute left-20 top-40 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, 12, -8, 6, 0], y: [0, -6, 8, -4, 0], rotate: [0, 8, -4, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }} />
      <motion.div aria-hidden="true" className="absolute right-28 top-6 w-11 h-11 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, -14, 10, -6, 0], y: [0, 10, -8, 4, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-6 bottom-28 w-8 h-8 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 8, -6, 4, 0], y: [0, -8, 6, -3, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-4 top-4 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.13 }} animate={{ x: [0, 220, 220, 0, -220, -220, 0], y: [0, 0, 140, 140, 140, 0, 0] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="absolute right-4 top-6 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, -220, -220, 0, 220, 220, 0], y: [0, 0, 160, 160, 160, 0, 0] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="absolute left-6 top-24 w-8 h-8 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 200, -200, 0], y: [0, -120, 120, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-10 top-32 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -180, 180, 0], y: [0, 100, -100, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-4 bottom-6 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 240, -240, 0], y: [0, -40, 40, 0] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="absolute right-6 bottom-10 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -200, 200, 0], y: [0, 60, -60, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/3 top-8 w-9 h-9 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 140, -140, 0], y: [0, -80, 80, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/3 bottom-14 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -140, 140, 0], y: [0, 80, -80, 0] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-12 bottom-40 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, 120, -120, 0], y: [0, -120, 120, 0], rotate: [0, 45, -30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-2 top-20 w-11 h-11 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [-240, 0, 240, -240], y: [0, 140, 0, 140] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="absolute right-3 top-40 w-9 h-9 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [-200, -100, 0, -200], y: [120, 0, 140, 60] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-8 top-16 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [-180, 100, -180, 0], y: [0, 120, -120, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-4 bottom-20 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [-220, 140, -220, 0], y: [40, -100, 80, 0] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="absolute right-12 bottom-32 w-11 h-11 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [-160, 80, 160, -160], y: [0, 100, -80, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-20 top-12 w-8 h-8 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [-140, 120, -100, 0], y: [0, -100, 80, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-16 bottom-40 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [-180, 100, 180, -180], y: [120, 0, -120, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/4 top-28 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [-150, 80, -150, 60], y: [0, -80, 100, 0] }} transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-10 bottom-6 w-9 h-9 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [-120, 140, -80, 0], y: [0, -120, 100, 0], rotate: [0, -45, 30, 0] }} transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Logo Watermark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <img 
          src={logo} 
          alt="" 
          className="w-[500px] h-[500px] object-contain"
        />
      </div>

      <div ref={ref} className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('فروعنا', 'Our Branches')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('12 فرع في العراق', '12 Branches Across Iraq')}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t(
              'نقدم خدماتنا عبر شبكة واسعة من الفروع في مختلف المحافظات العراقية',
              'We provide our services through a wide network of branches across various Iraqi provinces'
            )}
          </p>
        </motion.div>

        {/* Branches Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {branches.map((branch, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedBranch(branch)}
              className="group cursor-pointer"
            >
              <div className="relative h-full p-6 rounded-2xl bg-card border border-border shadow-card group-hover:shadow-card-hover group-hover:border-accent/40 transition-all duration-300 overflow-hidden">
                {/* Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

                {/* Branch Name */}
                <h3 className={`text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                  {t(branch.nameAr, branch.nameEn)}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : ''}`}>
                    {t(branch.addressAr, branch.addressEn)}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{branch.tradingVolume}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{branch.staffCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{branch.yearEstablished}</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-5 h-5 text-accent rtl-flip" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Branch Detail Modal */}
        <AnimatePresence>
          {selectedBranch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
              onClick={() => setSelectedBranch(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="bg-card rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-border"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Header with Logo */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl p-1">
                    <img 
                      src={logo} 
                      alt="Qalaat Al-Dhaman" 
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold text-foreground mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                      {t(selectedBranch.nameAr, selectedBranch.nameEn)}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {t('تأسس', 'Est.')} {selectedBranch.yearEstablished}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Branch Image */}
              <div className="mb-6">
                <div className="w-full h-52 sm:h-56 rounded-2xl overflow-hidden border border-border shadow-card">
                  <img
                    src={selectedBranch.imagePath}
                    alt={t(selectedBranch.nameAr, selectedBranch.nameEn)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <MapPin className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className={`font-medium text-foreground mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                      {t('العنوان', 'Address')}
                    </p>
                    <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                      {t(selectedBranch.addressAr, selectedBranch.addressEn)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-center border border-primary/20">
                    <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedBranch.tradingVolume}</p>
                    <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                      {t('حجم التداول', 'Trading Volume')}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 text-center border border-accent/20">
                    <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedBranch.staffCount}</p>
                    <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                      {t('الموظفين', 'Employees')}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <p className={`text-primary font-medium ${isRTL ? 'font-arabic text-right' : ''}`}>
                    {t(selectedBranch.coverageAr, selectedBranch.coverageEn)}
                  </p>
                </div>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Branches;
