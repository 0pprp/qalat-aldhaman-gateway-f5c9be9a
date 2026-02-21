import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Shield, TrendingDown, HeartPulse, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';

const Challenges = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const challenges = [
    {
      icon: Shield,
      yearAr: '2014-2017',
      yearEn: '2014-2017',
      titleAr: 'فترة داعش',
      titleEn: 'ISIS Invasion Period',
      snippetAr: 'تجاوزنا أصعب التحديات الأمنية وحافظنا على استمرارية العمل.',
      snippetEn: 'We overcame severe security challenges while maintaining business continuity.',
      expandedAr: [
        'رغم الظروف الأمنية الصعبة، واصلنا العمل بخطط تشغيل مدروسة.',
        'حافظنا على استقرار عملياتنا وخدمة عملائنا دون توقف.',
        'اعتمدنا الانضباط والمرونة كركيزة للاستمرار.',
        'خرجنا من هذه المرحلة أكثر قوة وتنظيماً.',
      ],
      expandedEn: [
        'Despite difficult security conditions, we continued operating with structured contingency plans.',
        'We maintained service stability without interruption.',
        'Discipline and flexibility became our foundation.',
        'We emerged stronger and more organized.',
      ],
    },
    {
      icon: TrendingDown,
      yearAr: '2015 & 2020',
      yearEn: '2015 & 2020',
      titleAr: 'أزمات أسعار النفط',
      titleEn: 'Oil Price Crises',
      snippetAr: 'تكيفنا مع التقلبات الاقتصادية وواصلنا النمو بثبات.',
      snippetEn: 'We adapted to economic fluctuations and sustained growth.',
      expandedAr: [
        'واجهنا تقلبات السوق بإدارة مالية حذرة.',
        'حافظنا على التوازن بين المخاطر والاستقرار.',
        'طوّرنا آليات دفع مرنة تناسب واقع السوق.',
        'استثمرنا في تحسين كفاءة العمليات.',
      ],
      expandedEn: [
        'We managed financial instability with cautious planning.',
        'We balanced risk with stability.',
        'We enhanced flexible payment mechanisms.',
        'We focused on operational efficiency.',
      ],
    },
    {
      icon: HeartPulse,
      yearAr: '2020-2021',
      yearEn: '2020-2021',
      titleAr: 'جائحة كورونا',
      titleEn: 'COVID-19 Pandemic',
      snippetAr: 'طورنا خدماتنا الرقمية وحافظنا على خدمة عملائنا.',
      snippetEn: 'We enhanced digital services while maintaining customer support.',
      expandedAr: [
        'سارعنا إلى تطوير أدوات تواصل وخدمة رقمية.',
        'حافظنا على استمرارية عملياتنا بأعلى معايير السلامة.',
        'دعمنا عملاءنا بمرونة في الإجراءات.',
        'تحولت الأزمة إلى فرصة تطوير.',
      ],
      expandedEn: [
        'We rapidly expanded digital communication channels.',
        'We ensured operational continuity with safety measures.',
        'We supported customers with flexible procedures.',
        'The crisis became an opportunity for improvement.',
      ],
    },
    {
      icon: MapPin,
      yearAr: 'مستمر',
      yearEn: 'Ongoing',
      titleAr: 'التوسع الجغرافي والتكيف مع أسواق جديدة',
      titleEn: 'Geographic Expansion and Adapting to New Markets',
      snippetAr: 'واصلنا التوسع بثبات داخل محافظات وأسواق جديدة.',
      snippetEn: 'We continued expanding steadily into new provinces and markets.',
      expandedAr: [
        'درسنا احتياجات كل منطقة قبل التوسع.',
        'بنينا فرق عمل قادرة على خدمة مختلف البيئات.',
        'حافظنا على نفس معايير الجودة في كل الفروع.',
        'التوسع كان مدروساً وليس عشوائياً.',
      ],
      expandedEn: [
        'We analyzed each region before expanding.',
        'We built teams capable of serving diverse environments.',
        'We maintained consistent quality standards.',
        'Expansion was strategic, not random.',
      ],
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="challenges" className="py-24 bg-hero-gradient relative overflow-hidden">
      {/* Decorative random-floating elements (subtle) */}
      <motion.div
        aria-hidden="true"
        className="absolute left-6 top-6 w-14 h-14 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.12 }}
        animate={{ x: [0, 20, 0, -10, 0], y: [0, -10, 0, 5, 0], rotate: [0, 15, 0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-8 top-20 w-10 h-10 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, -18, 0, 12, 0], y: [0, 8, 0, -6, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 bottom-6 w-20 h-20 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.1 }}
        animate={{ x: [0, -30, 0, 30, 0], y: [0, 6, 0, -6, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Additional random floating decorations */}
      <motion.div
        aria-hidden="true"
        className="absolute left-20 top-40 w-10 h-10 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.1 }}
        animate={{ x: [0, 12, -8, 6, 0], y: [0, -6, 8, -4, 0], rotate: [0, 8, -4, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-28 top-6 w-12 h-12 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.12 }}
        animate={{ x: [0, -14, 10, -6, 0], y: [0, 10, -8, 4, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-6 bottom-28 w-8 h-8 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, 8, -6, 4, 0], y: [0, -8, 6, -3, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Nine clearer floating elements distributed to corners, swapping places */}
      <motion.div
        aria-hidden="true"
        className="absolute left-4 top-4 w-12 h-12 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.13 }}
        animate={{ x: [0, 220, 220, 0, -220, -220, 0], y: [0, 0, 140, 140, 140, 0, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-4 top-6 w-10 h-10 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.12 }}
        animate={{ x: [0, -220, -220, 0, 220, 220, 0], y: [0, 0, 160, 160, 160, 0, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-6 top-24 w-8 h-8 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, 200, -200, 0], y: [0, -120, 120, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-10 top-32 w-14 h-14 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, -180, 180, 0], y: [0, 100, -100, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-4 bottom-6 w-12 h-12 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.12 }}
        animate={{ x: [0, 240, -240, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-6 bottom-10 w-10 h-10 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, -200, 200, 0], y: [0, 60, -60, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/3 top-8 w-9 h-9 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, 140, -140, 0], y: [0, -80, 80, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-1/3 bottom-14 w-11 h-11 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [0, -140, 140, 0], y: [0, 80, -80, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-12 bottom-40 w-10 h-10 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.1 }}
        animate={{ x: [0, 120, -120, 0], y: [0, -120, 120, 0], rotate: [0, 45, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Nine additional elements on right corners, swapping with others randomly */}
      <motion.div
        aria-hidden="true"
        className="absolute right-2 top-20 w-11 h-11 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.12 }}
        animate={{ x: [-240, 0, 240, -240], y: [0, 140, 0, 140] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-3 top-40 w-9 h-9 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [-200, -100, 0, -200], y: [120, 0, 140, 60] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-8 top-16 w-13 h-13 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.12 }}
        animate={{ x: [-180, 100, -180, 0], y: [0, 120, -120, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-4 bottom-20 w-10 h-10 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [-220, 140, -220, 0], y: [40, -100, 80, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-12 bottom-32 w-12 h-12 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [-160, 80, 160, -160], y: [0, 100, -80, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-20 top-12 w-8 h-8 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.1 }}
        animate={{ x: [-140, 120, -100, 0], y: [0, -100, 80, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-16 bottom-40 w-10 h-10 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [-180, 100, 180, -180], y: [120, 0, -120, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-1/4 top-28 w-11 h-11 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [-150, 80, -150, 60], y: [0, -80, 100, 0] }}
        transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute right-10 bottom-6 w-9 h-9 rounded-full bg-accent pointer-events-none"
        style={{ opacity: 0.11 }}
        animate={{ x: [-120, 140, -80, 0], y: [0, -120, 100, 0], rotate: [0, -45, 30, 0] }}
        transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo Watermark */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
        <img 
          src={logo} 
          alt="" 
          className="w-[400px] h-[400px] object-contain"
        />
      </div>

      {/* Background Pattern - Geometric dots */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(45 86% 62% / 0.25) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div ref={ref} className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className={`inline-block px-4 py-2 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('التحديات والصمود', 'Challenges & Resilience')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('15 سنة من الصمود والنجاح', '15 Years of Resilience and Success')}
          </h2>
          <p className={`text-lg text-primary-foreground/70 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t(
              'واجهنا تحديات كبيرة وخرجنا منها أقوى',
              'We faced major challenges and emerged stronger'
            )}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-accent/30 to-accent/50 -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {challenges.map((challenge, index) => (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
                  className={`lg:flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                {/* Content Card */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-accent/20 group hover:bg-white/15 hover:border-accent/40 transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onFocus={() => setHoveredIndex(index)}
                      onBlur={() => setHoveredIndex(null)}
                      tabIndex={0}
                    >
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <challenge.icon className="w-6 h-6 text-secondary" />
                      </motion.div>
                      <span className="text-accent font-bold">
                        {t(challenge.yearAr, challenge.yearEn)}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                      {t(challenge.titleAr, challenge.titleEn)}
                    </h3>
                      {/* Snippet (always visible) */}
                      <p className={`text-primary-foreground/70 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                        {t(challenge.snippetAr, challenge.snippetEn)}
                      </p>

                      {/* Read More / Hide indicator */}
                      <div className="mb-3">
                        {! (hoveredIndex === index) ? (
                          <span className="text-yellow-400 font-medium">{t('عرض المزيد ↓', 'Read More ↓')}</span>
                        ) : (
                          <span className="text-yellow-400 font-medium">{t('إخفاء ↑', 'Hide ↑')}</span>
                        )}
                      </div>

                      {/* Expanded content - shown on hover/focus */}
                      <AnimatePresence initial={false}>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28 }}
                          >
                            <ul className={`list-disc list-inside text-sm text-primary-foreground/70 space-y-1 ${isRTL ? 'text-right' : ''}`}>
                              {(isRTL ? challenge.expandedAr : challenge.expandedEn).map((line, i) => (
                                <li key={i} className={`${isRTL ? 'font-arabic' : ''}`}>{line}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </motion.div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden lg:flex items-center justify-center w-8 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
                    className="w-5 h-5 rounded-full bg-gold-gradient shadow-gold relative z-10 border-2 border-white/30"
                  />
                </div>

                {/* Empty Space for Alternating Layout */}
                <div className="hidden lg:block lg:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Challenges;
