import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Banknote, Megaphone, ShieldCheck, Globe, CreditCard, Award, MapPinned } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';

const WhyUs = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const reasons = [
    {
      icon: Banknote,
      titleAr: 'شراء البضائع نقدًا',
      titleEn: 'We Purchase Goods in Cash',
      descAr: 'نوفر السيولة الفورية للتجار والموردين',
      descEn: 'We provide instant liquidity for merchants and suppliers',
      expandedAr: 'نعتمد الشراء النقدي كخيار استراتيجي يسرّع حركة السوق ويمنح عملياتنا مرونة أعلى في اتخاذ القرار. هذا النموذج يخلق تدفقاً مستقراً ويساعد على توفير خيارات شراء واضحة للعملاء.',
      expandedEn: 'We rely on cash purchasing as a strategic model that accelerates market activity and gives our operations higher flexibility. This approach supports stable cash flow and enables clear, convenient buying options for customers.',
    },
    {
      icon: Megaphone,
      titleAr: 'نظام تسويقي مبتكر',
      titleEn: 'Innovative and Easy Marketing System',
      descAr: 'حلول تسويقية مبتكرة وسهلة الاستخدام',
      descEn: 'Innovative and easy-to-use marketing solutions',
      expandedAr: 'نعمل بمنظومة تسويق مبنية على فهم حقيقي لسلوك الشراء في السوق العراقي، بحيث نضمن عرض المنتجات بطريقة تقنع العميل وتدعم دورة البيع باستمرار. هدفنا تحويل الاهتمام إلى قرار شراء فعلي.',
      expandedEn: 'Our marketing system is built on real understanding of buying behavior in the Iraqi market, helping present products in a compelling way and supporting continuous sales cycles.',
    },
    {
      icon: ShieldCheck,
      titleAr: 'منتجات مضمونة وخالية من العيوب',
      titleEn: 'Guaranteed and Defect-Free Products',
      descAr: 'ضمان الجودة على جميع منتجاتنا',
      descEn: 'Quality assurance on all our products',
      expandedAr: 'نحرص على أن تكون تجربة العميل مستقرة وواضحة من خلال اعتماد معايير دقيقة للجودة والمتابعة. هذا يقلّل المشاكل بعد الشراء ويعزز الثقة على المدى الطويل.',
      expandedEn: 'We aim for a consistent, clear customer experience through careful quality standards and follow-up. This reduces post-purchase issues and strengthens long-term trust.',
    },
    {
      icon: Globe,
      titleAr: 'وكلاؤنا في كل مكان',
      titleEn: 'Our Agents Are Everywhere',
      descAr: 'شبكة واسعة من الوكلاء في جميع أنحاء العراق',
      descEn: 'Wide network of agents across Iraq',
      expandedAr: 'انتشارنا الجغرافي يمنحنا قدرة عالية على الوصول والتغطية وخدمة العملاء في مناطق متعددة. هذا الانتشار يدعم سرعة التنفيذ ويوسّع نطاق التأثير.',
      expandedEn: 'Our geographic presence enables wide coverage and service in multiple areas. This supports faster execution and expands our reach.',
    },
    {
      icon: CreditCard,
      titleAr: 'سهولة الدفع للعملاء',
      titleEn: 'Customer Convenience',
      descAr: 'خيارات دفع مرنة تناسب جميع العملاء',
      descEn: 'Flexible payment options for all customers',
      expandedAr: 'طوّرنا أسلوب تقسيط يومي مرن يجعل قرار الشراء أسهل ويقلّل العبء المالي على العميل. بهذه الآلية يتحول السعر الكبير إلى دفعات بسيطة تناسب الدخل اليومي.',
      expandedEn: 'We offer a flexible daily installment approach that makes purchasing decisions easier and reduces financial pressure. Large amounts become simple daily payments that fit day-to-day income.',
    },
    {
      icon: Award,
      titleAr: 'خبرة طويلة في السوق العراقي',
      titleEn: 'Long Experience in the Iraqi Market',
      descAr: '15 سنة من الخبرة والتميز',
      descEn: '15 years of experience and excellence',
      expandedAr: 'خبرتنا المتراكمة عبر السنوات منحتنا قدرة أدق على إدارة المخاطر وفهم التغيرات وتقديم حلول تناسب الواقع. لذلك نتحرك بثبات حتى في أصعب الظروف.',
      expandedEn: 'Years of accumulated experience have sharpened our ability to manage risk, adapt to changes, and offer solutions that fit real conditions—allowing steady performance even in tough times.',
    },
    {
      icon: MapPinned,
      titleAr: 'توسع جغرافي مستمر',
      titleEn: 'Continuous Geographical Expansion',
      descAr: 'نمو مستمر وتوسع في أسواق جديدة',
      descEn: 'Continuous growth and expansion into new markets',
      expandedAr: 'نواصل التوسع بخطوات محسوبة للاقتراب من شرائح جديدة وتلبية احتياجات أكبر عدد ممكن. التوسع عندنا ليس شكلياً بل مبني على جاهزية تشغيلية حقيقية.',
      expandedEn: 'We expand in calculated steps to reach new segments and serve a wider audience. Our growth is not cosmetic—it’s backed by real operational readiness.',
    },
  ];

  const handleCardClick = (index: number) => {
    setHoveredIndex(hoveredIndex === index ? null : index);
  };

  return (
    <section id="why-us" className="py-24 bg-background relative overflow-hidden">
      {/* Background - Abstract shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Decorative Circles */}
      <motion.div aria-hidden="true" className="absolute left-6 top-6 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 20, 0, -10, 0], y: [0, -10, 0, 5, 0], rotate: [0, 15, 0, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-8 top-20 w-16 h-16 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -25, 0, 15, 0], y: [0, 15, 0, -10, 0], rotate: [0, -20, 0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/2 bottom-6 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 18, 0, -12, 0], y: [0, -8, 0, 8, 0], rotate: [0, 12, 0, -15, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-16 bottom-12 w-14 h-14 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.13 }} animate={{ x: [0, -20, 0, 10, 0], y: [0, 12, 0, -6, 0], rotate: [0, -18, 0, 8, 0] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-12 bottom-20 w-11 h-11 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, 15, 0, -18, 0], y: [0, -12, 0, 7, 0], rotate: [0, 20, 0, -12, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/4 top-16 w-13 h-13 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -18, 0, 12, 0], y: [0, 18, 0, -8, 0], rotate: [0, -15, 0, 10, 0] }} transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/3 top-1/2 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 22, 0, -14, 0], y: [0, -6, 0, 10, 0], rotate: [0, 18, 0, -8, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-12 bottom-1/3 w-15 h-15 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -16, 0, 14, 0], y: [0, 14, 0, -12, 0], rotate: [0, -22, 0, 6, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/4 bottom-1/4 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 18, 0, -10, 0], y: [0, -16, 0, 6, 0], rotate: [0, 14, 0, -10, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />

      <motion.div aria-hidden="true" className="absolute right-20 top-1/4 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, -22, 0, 16, 0], y: [0, 10, 0, -8, 0], rotate: [0, -16, 0, 12, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-10 top-1/3 w-14 h-14 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, 20, 0, -12, 0], y: [0, -14, 0, 4, 0], rotate: [0, 20, 0, -6, 0] }} transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/3 bottom-1/2 w-11 h-11 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -18, 0, 14, 0], y: [0, 12, 0, -10, 0], rotate: [0, -18, 0, 8, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-2/3 top-20 w-13 h-13 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 16, 0, -16, 0], y: [0, -12, 0, 8, 0], rotate: [0, 16, 0, -14, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/2 bottom-6 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -20, 0, 12, 0], y: [0, 16, 0, -6, 0], rotate: [0, -20, 0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/2 top-1/4 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 18, 0, -14, 0], y: [0, -10, 0, 12, 0], rotate: [0, 12, 0, -16, 0] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-6 bottom-1/4 w-15 h-15 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, -24, 0, 10, 0], y: [0, 8, 0, -14, 0], rotate: [0, -14, 0, 12, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/3 bottom-1/3 w-11 h-11 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, 14, 0, -18, 0], y: [0, -8, 0, 10, 0], rotate: [0, 18, 0, -8, 0] }} transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/4 bottom-20 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -16, 0, 16, 0], y: [0, 14, 0, -8, 0], rotate: [0, -16, 0, 10, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />

      <motion.div aria-hidden="true" className="absolute left-20 bottom-1/2 w-13 h-13 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 20, 0, -12, 0], y: [0, -14, 0, 6, 0], rotate: [0, 14, 0, -12, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-1/3 top-1/2 w-10 h-10 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -18, 0, 14, 0], y: [0, 10, 0, -12, 0], rotate: [0, -18, 0, 8, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-2/3 bottom-1/4 w-14 h-14 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 16, 0, -16, 0], y: [0, -10, 0, 8, 0], rotate: [0, 16, 0, -10, 0] }} transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-10 top-1/3 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, -20, 0, 12, 0], y: [0, 12, 0, -10, 0], rotate: [0, -20, 0, 10, 0] }} transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/4 top-20 w-11 h-11 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, 18, 0, -14, 0], y: [0, -12, 0, 8, 0], rotate: [0, 12, 0, -14, 0] }} transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-2/3 bottom-1/3 w-15 h-15 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, -22, 0, 10, 0], y: [0, 14, 0, -6, 0], rotate: [0, -16, 0, 12, 0] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/3 top-1/3 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 14, 0, -18, 0], y: [0, -8, 0, 10, 0], rotate: [0, 18, 0, -8, 0] }} transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-20 bottom-1/2 w-12 h-12 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -16, 0, 16, 0], y: [0, 10, 0, -12, 0], rotate: [0, -14, 0, 10, 0] }} transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Logo Watermark */}
      <div className="absolute right-0 top-1/4 opacity-[0.02] pointer-events-none">
        <img 
          src={logo} 
          alt="" 
          className="w-[400px] h-[400px] object-contain"
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
          <span className={`inline-block px-4 py-2 rounded-full bg-accent/20 text-accent-foreground font-semibold text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('لماذا نحن', 'Why Choose Us')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('ما يميزنا عن الآخرين', 'What Sets Us Apart')}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t(
              'نقدم قيمة حقيقية لعملائنا من خلال خدمات متميزة وحلول مبتكرة',
              'We deliver real value to our customers through exceptional services and innovative solutions'
            )}
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const isExpanded = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.05 + index * 0.08 }}
                className="group"
              >
                <motion.div
                  className="relative h-full p-6 rounded-2xl bg-card border border-border shadow-card transition-all duration-300 overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleCardClick(index)}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />

                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-5 shadow-lg">
                    <reason.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={`relative text-lg font-bold text-foreground mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                    {t(reason.titleAr, reason.titleEn)}
                  </h3>
                  <p className={`relative text-sm text-muted-foreground mb-3 ${isRTL ? 'font-arabic text-right' : ''}`}>
                    {t(reason.descAr, reason.descEn)}
                  </p>

                  {/* Read More / Show Less indicator */}
                  <div className={`relative text-xs text-accent font-medium ${isRTL ? 'font-arabic' : ''}`}>
                    {isExpanded ? (
                      <span>{t('عرض أقل', 'Show Less')}</span>
                    ) : (
                      <span>{t('عرض المزيد', 'Read More')}</span>
                    )}
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative mt-2"
                      >
                        <p className={`relative text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic text-right' : ''}`}>
                          {t(reason.expandedAr, reason.expandedEn)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
