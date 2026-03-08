import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ShowroomSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images = [
    {
      src: '/showroom/showroom-1.jpg',
      altAr: 'صورة من المعرض الدائم',
      altEn: 'Permanent showroom view',
    },
    {
      src: '/showroom/showroom-2.jpg',
      altAr: 'زيارة تجارية داخل المعرض',
      altEn: 'Merchant visit inside the showroom',
    },
    {
      src: '/showroom/showroom-3.jpg',
      altAr: 'عرض المنتجات داخل بيئة احترافية',
      altEn: 'Product presentation in a professional environment',
    },
  ];

  const paragraphs = isRTL
    ? [
        'يمثل مشروع المعرض الدائم خطوة استراتيجية تهدف إلى إنشاء مساحة تجارية متكاملة داخل العراق يتم فيها عرض نماذج حقيقية من المنتجات العالمية ضمن بيئة احترافية منظمة. يتيح هذا المعرض للتجار من مختلف المحافظات الاطلاع المباشر على المنتجات وفحصها والتعرف على مواصفاتها قبل اتخاذ قرار الشراء دون الحاجة إلى السفر خارج البلاد.',
        'تتولى شركة قلعة الضمان إدارة هذا المعرض بشكل كامل من خلال تنظيم زيارات التجار واستقطابهم من مختلف مناطق العراق للتعرف على المنتجات المعروضة. ولا يقتصر دورنا على التسويق فقط بل يشمل إدارة دورة العمل التجارية بالكامل بدءاً من عرض المنتجات وتقديم المعلومات الفنية والأسعار وصولاً إلى تنظيم الطلبات والتنسيق مع المصانع والشحن.',
        'يعتمد المشروع أيضاً على شبكة علاقات واسعة داخل السوق العراقي وخبرة ميدانية في عدة محافظات مما يساعد على ربط المنتجات بالموزعين والتجار المناسبين وتحقيق انتشار فعال داخل السوق المحلي.',
      ]
    : [
        'The Permanent Showroom project represents a strategic initiative aimed at creating a professional commercial space inside Iraq where international product samples are displayed in an organized environment. This showroom allows merchants from different Iraqi provinces to physically inspect products and evaluate their specifications before making purchasing decisions without the need to travel abroad.',
        'Qalat Aldhaman manages the showroom operations and organizes structured merchant visits from across Iraq to explore the products on display. Beyond marketing, the company supports the entire commercial process from product presentation and technical information to order management and coordination with manufacturers and shipping.',
        'The project is supported by strong local market experience and an extensive network across Iraqi provinces, helping connect international manufacturers with trusted merchants and distributors within the Iraqi market.',
      ];

  return (
    <section id="showroom" className="py-24 bg-background relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.04 }}
          className="text-center mb-6"
        >
          <span className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm ${isRTL ? 'font-arabic' : ''}`}>
            {t('المعرض الدائم', 'Permanent Showroom')}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-10"
        >
          {/* Mobile: clean stacked cards, no hover accordion */}
          <div className="grid grid-cols-1 gap-5 md:hidden">
            {images.map((image, index) => {
              return (
                <div
                  key={`mobile-${image.src}`}
                  className="relative rounded-2xl overflow-hidden bg-card shadow-card border border-border"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={image.src}
                      alt={t(image.altAr, image.altEn)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop/Tablet: true accordion gallery that pushes sibling cards */}
          <div className="hidden md:flex gap-5 lg:gap-6" onMouseLeave={() => setHoveredIndex(null)}>
            {images.map((image, index) => {
              const isHovered = hoveredIndex === index;
              const hasHover = hoveredIndex !== null;
              const flexGrow = hasHover ? (isHovered ? 2.15 : 0.85) : 1;

              return (
                <motion.div
                  key={image.src}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className="relative rounded-2xl overflow-hidden bg-card shadow-card border border-border min-w-0"
                  style={{ flexBasis: 0 }}
                  animate={{
                    flexGrow,
                    y: isHovered ? -4 : 0,
                    boxShadow: isHovered
                      ? '0 20px 42px rgba(8, 15, 20, 0.18)'
                      : '0 10px 28px rgba(8, 15, 20, 0.10)',
                  }}
                  transition={{
                    flexGrow: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    y: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    boxShadow: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  <div className="h-[240px] lg:h-[280px] overflow-hidden">
                    <motion.img
                      src={image.src}
                      alt={t(image.altAr, image.altEn)}
                      className="w-full h-full object-cover"
                      animate={{ scale: isHovered ? 1.055 : 1 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className={`text-sm md:text-base text-muted-foreground/90 text-center mb-4 ${isRTL ? 'font-arabic' : ''}`}
        >
          {t(
            'منصة تجارية تربط المصانع العالمية بالسوق العراقي',
            'A commercial gateway connecting international manufacturers to the Iraqi market'
          )}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-center mb-8 ${isRTL ? 'font-arabic' : ''}`}
        >
          {t('المعرض الدائم', 'Permanent Showroom')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className={`max-w-5xl mx-auto space-y-5 text-center text-base md:text-lg text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-10 text-center"
        >
          <motion.a
            href="/showroom/qalat-aldhaman-project.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gold-gradient text-secondary font-bold shadow-gold transition-all duration-300 hover:shadow-[0_18px_38px_hsl(45_86%_52%_/_0.32)] ${isRTL ? 'font-arabic' : ''}`}
          >
            <FileText className="w-5 h-5" />
            <span>{t('تحميل ملف المشروع', 'Download Project File')}</span>
          </motion.a>

          <p className={`text-xs text-muted-foreground/80 mt-3 ${isRTL ? 'font-arabic' : ''}`}>
            {t('يمكن عرض الملف مباشرة أو تحميله بصيغة PDF', 'The file can be viewed online or downloaded in PDF format')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowroomSection;
