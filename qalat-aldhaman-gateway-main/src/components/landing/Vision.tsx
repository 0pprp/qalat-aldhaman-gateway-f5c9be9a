import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Flag, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Vision: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const dirClass = isRTL ? 'text-right' : 'text-left';

  const cards = [
    {
      key: 'vision',
      titleAr: 'الرؤية',
      titleEn: 'Vision',
      shortAr: 'أن نصبح المرجع الأكثر ثقة في حلول التجارة والشراء بالتقسيط اليومي.',
      shortEn: 'To become the most trusted reference for trade solutions and daily-installment purchases.',
      extraAr:
        'نسعى لأن نكون الاسم الأكثر موثوقية في العراق ضمن حلول التجارة والدفع المرن، عبر تجربة شراء سهلة وواضحة تناسب مختلف شرائح المجتمع.',
      extraEn:
        'We aim to be Iraq’s most trusted name for trade solutions and flexible payment options, delivering a clear and effortless buying experience for all segments.',
      bulletsAr: [
        'تجربة شراء مبسطة وسريعة',
        'حلول دفع مرنة تناسب الدخل اليومي',
        'حضور فعلي وخدمة مستمرة',
      ],
      bulletsEn: [
        'Simple, fast purchasing experience',
        'Flexible payments for daily-income customers',
        'Strong presence and continuous service',
      ],
      Icon: Eye,
      iconBg: 'bg-accent',
    },
    {
      key: 'mission',
      titleAr: 'الرسالة',
      titleEn: 'Mission',
      shortAr: 'تقديم حلول عملية ومباشرة تلبّي احتياجات التجار والعملاء.',
      shortEn: 'Deliver practical solutions that meet merchants’ and customers’ needs.',
      extraAr:
        'نحوّل احتياجات السوق إلى حلول عملية عبر نموذج يوازن بين الثقة والانضباط، ويمنح العملاء إمكانية الشراء بالتقسيط اليومي المرن ضمن إجراءات واضحة.',
      extraEn:
        'We turn market needs into practical solutions through a model built on trust and discipline, enabling customers to buy with flexible daily installments through clear processes.',
      bulletsAr: [
        'وضوح في التعامل والإجراءات',
        'دعم مستمر للعملاء',
        'نظام عمل منظم يضمن الاستدامة',
      ],
      bulletsEn: [
        'Clear processes and transparency',
        'Continuous customer support',
        'Organized model that sustains growth',
      ],
      Icon: Flag,
      iconBg: 'bg-accent',
    },
    {
      key: 'goals',
      titleAr: 'الأهداف',
      titleEn: 'Goals',
      shortAr: 'التوسع المدروس وتعزيز جودة الخدمة وحلول الدفع.',
      shortEn: 'Planned expansion, enhanced service quality and payment solutions.',
      extraAr:
        'نركز على توسيع أثرنا داخل المحافظات، ورفع جودة الخدمة، وتطوير آليات الدفع المرن بما يعزز رضا العملاء ويقوي حضورنا في السوق.',
      extraEn:
        'We focus on expanding our impact across provinces, improving service quality, and continuously developing flexible payment mechanisms that strengthen customer satisfaction and market presence.',
      bulletsAr: [
        'التوسع المدروس داخل المحافظات',
        'رفع جودة الخدمة وتجربة العميل',
        'تطوير حلول الدفع المرن باستمرار',
      ],
      bulletsEn: [
        'Smart expansion across provinces',
        'Better service and customer experience',
        'Continuous improvement of flexible payments',
      ],
      Icon: Target,
      iconBg: 'bg-accent',
    },
  ];

  return (
    <section id="vision-mission-goals" className="py-24 bg-background relative overflow-hidden">
      {/* Decorations (subtle, section-only) */}
      <motion.div
        aria-hidden="true"
        className="absolute left-12 top-8 w-36 h-36 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.06 }}
        animate={{ y: [0, -8, 0], opacity: [0.06, 0.09, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-20 bottom-10 w-28 h-28 rounded-full bg-primary pointer-events-none"
        style={{ opacity: 0.05 }}
        animate={{ y: [0, 6, 0], opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-6 top-40 w-16 h-16 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.05 }}
        animate={{ y: [0, -5, 0], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating Decorative Circles */}
      <motion.div aria-hidden="true" className="absolute left-6 top-6 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 20, 0, -10, 0], y: [0, -10, 0, 5, 0], rotate: [0, 15, 0, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-8 top-20 w-16 h-16 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -25, 0, 15, 0], y: [0, 15, 0, -10, 0], rotate: [0, -20, 0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/2 bottom-6 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 18, 0, -12, 0], y: [0, -8, 0, 8, 0], rotate: [0, 12, 0, -15, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="section-container relative z-10">
         <div className="text-center mb-12">
          <span className={`inline-block px-4 py-2 rounded-full bg-accent/20 text-accent-foreground font-semibold text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
           {t('رؤيتنا', 'Vision')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('رؤيتنا ورسالتنا وأهدافنا', 'Vision, Mission & Goals')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const IconComp = card.Icon;
            const isHovered = hoveredKey === card.key;

            return (
              <motion.article
                key={card.key}
                className="relative rounded-2xl p-8 bg-card border border-border shadow-sm"
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(8,15,20,0.06)' }}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                role="article"
                aria-labelledby={`${card.key}-title`}
                tabIndex={0}
                onMouseEnter={() => setHoveredKey(card.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onFocus={() => setHoveredKey(card.key)}
                onBlur={() => setHoveredKey(null)}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center ${card.iconBg} shadow-sm flex-shrink-0`}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  >
                    <IconComp className="w-6 h-6 text-white" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 id={`${card.key}-title`} className={`text-xl font-bold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                      {t(card.titleAr, card.titleEn)}
                    </h3>

                    <p className={`text-base text-muted-foreground mb-3 ${dirClass}`}>
                      {t(card.shortAr, card.shortEn)}
                    </p>

                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHoveredKey(isHovered ? null : card.key);
                        }}
                        aria-expanded={isHovered}
                        className="text-sm text-accent hover:underline focus:underline"
                      >
                        {isHovered ? t('عرض اقل', 'Show less') : t('عرض المزيد', 'Show more')}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isHovered && (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <p className={`text-sm text-muted-foreground mb-3 ${dirClass}`}>
                            {t(card.extraAr, card.extraEn)}
                          </p>

                          <ul className={`list-disc list-inside text-sm text-muted-foreground space-y-1 ${dirClass}`}>
                            {(isRTL ? card.bulletsAr : card.bulletsEn).map((b, i) => (
                              <li key={i} className={`${isRTL ? 'font-arabic' : ''}`}>{b}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Vision;