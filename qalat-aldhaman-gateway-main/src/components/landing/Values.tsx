import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Shield, Star, Lightbulb, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';

const Values = () => {
  const { t, isRTL } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = [
    {
      icon: Shield,
      titleAr: 'المصداقية والشفافية',
      titleEn: 'Credibility & Transparency',
      shortAr: 'نلتزم بوضوح كامل في الاتفاقات والتعاملات لضمان ثقة مستمرة.',
      shortEn: 'We operate with clear terms and honest communication to sustain trust.',
      expandedAr: [
        'نوضح الشروط والخطوات من البداية بدون غموض.',
        'نتابع مع العميل حتى اكتمال الخدمة بسلاسة.',
        'نبني علاقة طويلة الأمد قائمة على الثقة.',
      ],
      expandedEn: [
        'Clear terms from day one with no ambiguity.',
        'Continuous follow-up until completion.',
        'Long-term trust-based relationships.',
      ],
      color: 'from-primary to-secondary',
      iconBg: 'bg-primary',
    },
    {
      icon: Star,
      titleAr: 'الاحترافية والجودة',
      titleEn: 'Professionalism & Quality',
      shortAr: 'فريق منظم ومعايير عمل ثابتة تضمن جودة تنفيذ يومية.',
      shortEn: 'Structured teams and consistent standards that ensure reliable execution.',
      expandedAr: [
        'إجراءات واضحة داخل الفروع لضمان نفس الجودة.',
        'تدريب مستمر لفريق العمل.',
        'تحسين دائم لتجربة العميل.',
      ],
      expandedEn: [
        'Unified procedures across branches.',
        'Ongoing staff training.',
        'Continuous improvement of customer experience.',
      ],
      color: 'from-accent to-accent',
      iconBg: 'bg-accent',
    },
    {
      icon: Lightbulb,
      titleAr: 'الابتكار والتطوير',
      titleEn: 'Innovation & Development',
      shortAr: 'نطوّر أساليبنا باستمرار لنواكب احتياج السوق ونرفع الكفاءة.',
      shortEn: 'We continuously evolve our methods to match market needs and boost efficiency.',
      expandedAr: [
        'تطوير آليات العمل وتقليل الوقت والجهد.',
        'حلول عملية تلائم مختلف شرائح المجتمع.',
        'اعتماد أدوات تساعد على متابعة العمليات بدقة.',
      ],
      expandedEn: [
        'Smarter workflows that save time and effort.',
        'Practical solutions for diverse customer segments.',
        'Tools that improve tracking and accuracy.',
      ],
      color: 'from-primary to-primary',
      iconBg: 'bg-primary',
    },
    {
      icon: Heart,
      titleAr: 'الالتزام بالمبادئ الإسلامية والأخلاقية',
      titleEn: 'Islamic & Ethical Commitment',
      shortAr: 'نلتزم بضوابط أخلاقية ومبادئ واضحة في كل خطوة من عملنا.',
      shortEn: 'We adhere to ethical principles and responsible practices in every step.',
      expandedAr: [
        'تعامل محترم ومنصف مع العملاء.',
        'التزام بالمسؤولية والثقة في الوعود.',
        'بيئة عمل تحترم القيم والسلوك المهني.',
      ],
      expandedEn: [
        'Fair and respectful treatment of customers.',
        'Responsibility and keeping commitments.',
        'A professional culture grounded in values.',
      ],
      color: 'from-secondary to-primary',
      iconBg: 'bg-secondary',
    },
  ];

  return (
    <section id="values" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern - Abstract geometric inspired by logo */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30px 30px, hsl(var(--primary)) 2px, transparent 0)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Logo Watermark */}
      <div className="absolute right-0 bottom-0 opacity-[0.02] pointer-events-none">
        <img src={logo} alt="" className="w-[350px] h-[350px] object-contain" />
      </div>

      {/* Floating Decorative Circles */}
      <motion.div aria-hidden="true" className="absolute left-6 top-6 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 20, 0, -10, 0], y: [0, -10, 0, 5, 0], rotate: [0, 15, 0, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-8 top-20 w-16 h-16 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -25, 0, 15, 0], y: [0, 15, 0, -10, 0], rotate: [0, -20, 0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/2 bottom-6 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 18, 0, -12, 0], y: [0, -8, 0, 8, 0], rotate: [0, 12, 0, -15, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-16 bottom-12 w-14 h-14 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.13 }} animate={{ x: [0, -20, 0, 10, 0], y: [0, 12, 0, -6, 0], rotate: [0, -18, 0, 8, 0] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="section-container relative z-10">
        {/* Section Header - keep same */}
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-2 rounded-full bg-accent/20 text-accent-foreground font-semibold text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('قيم الشركة', 'Our Values')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('القيم التي نؤمن بها', 'Values We Believe In')}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t(
              'نلتزم بمجموعة من القيم الأساسية التي توجه عملنا وتحدد هويتنا',
              'We are committed to a set of core values that guide our work and define our identity'
            )}
          </p>
        </div>

        {/* Values Grid (2x2) - keep layout and spacing */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            const isOpen = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                layout
                className="group relative"
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-8 rounded-3xl transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

                <motion.div
                  layout
                  className={`relative p-8 rounded-3xl bg-card border border-border shadow-card group-hover:shadow-card-hover group-hover:border-accent/30 transition-all duration-300 h-full`}
                  whileHover={{ translateY: -6 }}
                >
                 {/* Icon Container with subtle floating */}
                  <div className="flex items-center gap-4 mb-3">
                    <motion.div
                      layout
                      className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center shadow-lg ${value.iconBg}`}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 4, repeat: 0, ease: 'easeInOut' }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className={`text-lg font-bold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                      {t(value.titleAr, value.titleEn)}
                    </h3>
                  </div>

                  {/* Short line (always visible) */}
                  <div className="text-sm text-muted-foreground mb-3">
                    {t(value.shortAr, value.shortEn)}
                  </div>

                  {/* Read more / Close indicator */}
                  <div className="text-sm text-accent-foreground/70 mb-2">
                    <span className="font-medium">
                      {isOpen ? t('إغلاق', 'Close') : t('عرض المزيد', 'Read more')}
                    </span>
                  </div>

                  {/* Expanded content - animated height via layout; bullets respect direction */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28 }}
                        className={`${isRTL ? 'text-right' : 'text-left'} mt-2`}
                      >
                        <ul className="list-inside list-disc text-sm text-muted-foreground space-y-2">
                          {(isRTL ? value.expandedAr : value.expandedEn).map((line, i) => (
                            <li key={i} className={`${isRTL ? 'font-arabic' : ''}`}>{line}</li>
                          ))}
                        </ul>
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

export default Values;