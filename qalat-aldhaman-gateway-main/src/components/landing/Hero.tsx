import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, FileText, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const heroBackgroundImage = '/showroom/showroom-1.jpg';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cards = [
    {
      key: 'showroom',
      titleAr: 'المعرض الدائم',
      titleEn: 'Permanent Showroom',
      descAr: 'استكشف المنتجات ضمن بيئة عرض احترافية.',
      descEn: 'Explore products in a professional display environment.',
      Icon: Building2,
      type: 'scroll' as const,
      target: 'showroom',
    },
    {
      key: 'branches',
      titleAr: 'فروعنا',
      titleEn: 'Our Branches',
      descAr: 'شبكة فروع تغطي محافظات متعددة في العراق.',
      descEn: 'A branch network across multiple Iraqi provinces.',
      Icon: MapPin,
      type: 'scroll' as const,
      target: 'branches',
    },
    {
      key: 'pdf',
      titleAr: 'تحميل ملف المشروع',
      titleEn: 'Download Project File',
      descAr: 'عرض الملف مباشرة أو تحميله بصيغة PDF.',
      descEn: 'View online or download in PDF format.',
      Icon: FileText,
      type: 'link' as const,
      href: '/showroom/qalat-aldhaman-project.pdf',
    },
    {
      key: 'contact',
      titleAr: 'تواصل معنا',
      titleEn: 'Contact Us',
      descAr: 'ابدأ شراكتك التجارية معنا .',
      descEn: 'Start your business partnership via Linktree.',
      Icon: Phone,
      type: 'link' as const,
      href: 'https://linktr.ee/Qalat_Aldhaman',
    },
  ];

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={heroBackgroundImage}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,12,18,0.84) 0%, rgba(6,24,28,0.80) 45%, rgba(7,28,30,0.88) 100%)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-secondary/30" />

      <div className="section-container relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center pt-28 pb-[clamp(11rem,30svh,18rem)] md:pb-[clamp(12rem,31svh,17rem)] lg:pb-[clamp(10rem,24svh,14rem)] xl:pb-[clamp(8rem,20svh,13rem)]">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`text-white font-bold leading-tight mb-6 ${isRTL ? 'font-arabic' : ''}`}
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{t('قلعة الضمان', 'Qalat Aldhaman')}</span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-semibold text-accent mt-4">
            {t('بوابتك لعرض المنتجات والوصول إلى السوق العراقي', 'Your Gateway to Product Display and the Iraqi Market')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: 'easeOut' }}
          className={`max-w-4xl text-base sm:text-lg md:text-xl text-white/90 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
        >
          {t(
            'نربط المنتجات بالفرص التجارية داخل العراق عبر معرض دائم وشبكة فروع تغطي مختلف المحافظات.',
            'We connect products with real commercial opportunities in Iraq through a permanent showroom and a branch network across multiple provinces.'
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex justify-center mt-10 sm:mt-12"
        >
          <Link
            to="/store"
            className={`group inline-flex items-center gap-3 px-9 sm:px-11 py-4 sm:py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg sm:text-xl shadow-[0_18px_38px_rgba(47,143,131,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-[0_22px_46px_rgba(47,143,131,0.42)] ${isRTL ? 'font-arabic' : ''}`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span>{t('تصفح المتجر', 'Browse Store')}</span>
          </Link>
        </motion.div>
      </div>

      <div className="section-container absolute left-1/2 bottom-6 sm:bottom-7 md:bottom-8 lg:bottom-9 xl:bottom-0 w-full -translate-x-1/2 translate-y-0 xl:translate-y-[6%] 2xl:translate-y-[8%] z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3 lg:gap-4 xl:gap-5">
          {cards.map((card, index) => {
            const IconComp = card.Icon;

            const cardBody = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 + index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -8, boxShadow: '0 22px 46px rgba(212,175,55,0.30), 0 28px 52px rgba(8,15,20,0.18)' }}
                className="group h-full min-h-[148px] sm:min-h-[154px] md:min-h-[138px] lg:min-h-[150px] xl:min-h-[168px] 2xl:min-h-[176px] rounded-2xl bg-primary/95 hover:bg-white backdrop-blur-md border border-primary/70 hover:border-accent/60 ring-1 ring-white/15 shadow-[0_18px_38px_rgba(8,15,20,0.28)] p-3 sm:p-3.5 md:p-3 lg:p-3.5 xl:p-5 2xl:p-6 text-start transition-colors duration-300"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-11 xl:h-11 rounded-xl bg-white/12 text-white group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center mb-3 sm:mb-4 md:mb-2.5 lg:mb-3 xl:mb-4 transition-colors duration-300">
                  <IconComp className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                </div>
                <h3 className={`text-sm sm:text-base md:text-[13px] lg:text-sm xl:text-base 2xl:text-lg font-bold text-white group-hover:text-foreground mb-1.5 sm:mb-2 md:mb-1.5 transition-colors duration-300 ${isRTL ? 'font-arabic text-right' : ''}`}>
                  {t(card.titleAr, card.titleEn)}
                </h3>
                <p className={`text-[11px] sm:text-xs md:text-[10px] lg:text-xs xl:text-sm text-white/80 group-hover:text-muted-foreground leading-relaxed pb-[5px] transition-colors duration-300 ${isRTL ? 'font-arabic text-right' : ''}`}>
                  {t(card.descAr, card.descEn)}
                </p>
              </motion.div>
            );

            if (card.type === 'scroll') {
              return (
                <button
                  key={card.key}
                  onClick={() => scrollToSection(card.target)}
                  className="text-left w-full h-full"
                >
                  {cardBody}
                </button>
              );
            }

            return (
              <a
                key={card.key}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                {cardBody}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;