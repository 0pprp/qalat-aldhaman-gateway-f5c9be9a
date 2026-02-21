// ...existing code...
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';
import { motion } from 'framer-motion';
const About = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Static Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Logo Watermark (very low opacity) */}
      {/* Floating Decorative Circles */}
      <motion.div aria-hidden="true" className="absolute left-6 top-6 w-12 h-12 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.12 }} animate={{ x: [0, 20, 0, -10, 0], y: [0, -10, 0, 5, 0], rotate: [0, 15, 0, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-8 top-20 w-16 h-16 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.1 }} animate={{ x: [0, -25, 0, 15, 0], y: [0, 15, 0, -10, 0], rotate: [0, -20, 0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute left-1/2 bottom-6 w-10 h-10 rounded-full bg-primary pointer-events-none" style={{ opacity: 0.11 }} animate={{ x: [0, 18, 0, -12, 0], y: [0, -8, 0, 8, 0], rotate: [0, 12, 0, -15, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden="true" className="absolute right-16 bottom-12 w-14 h-14 rounded-full bg-accent pointer-events-none" style={{ opacity: 0.13 }} animate={{ x: [0, -20, 0, 10, 0], y: [0, 12, 0, -6, 0], rotate: [0, -18, 0, 8, 0] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <img src={logo} alt="" className="w-[500px] h-[500px] object-contain" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('من نحن', 'About Us')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('قلعة الضمان', 'Qalaat Aldhaman')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Green square with white-square logo and gold quote (static) */}
          <div className="flex justify-center lg:justify-start">
            <div
              className="w-[420px] h-[420px] rounded-2xl p-8 text-center relative flex flex-col items-center justify-center shadow-2xl bg-accent"
              style={{
                // صريح: تدرج أخضر لإرجاع الدرجة القديمة (fallback عبر bg-accent)
                backgroundImage: 'linear-gradient(135deg, #0b816f 0%, #129977 100%)',
              }}
            >
              {/* Animated edge circles (decorative, continuous) */}
              <motion.div
                aria-hidden="true"
                className="absolute -right-6 -top-6 w-20 h-20 rounded-full border-2 border-dashed border-yellow-300 opacity-95 pointer-events-none"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full border-2 border-dashed border-accent/30 opacity-80 pointer-events-none"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              />

              {/* Square white logo container (rounded corners) */}
              <div className="w-32 h-32 rounded-xl bg-white p-3 flex items-center justify-center mb-6">
                <img src={logo} alt={t('قلعة الضمان', 'Qalaat Aldhaman')} className="w-full h-full object-contain" />
              </div>

              <h3 className="text-2xl font-bold mb-2 text-yellow-400">{t('قلعة الضمان', 'Qalaat Aldhaman')}</h3>
              <p className="text-yellow-400 mb-6">{t('منذ 2010', 'Since 2010')}</p>

              <div className="mt-4 px-4">
                <p className="text-center text-[18px] font-medium leading-snug text-yellow-400">
                  {t(
                    '«قلعة الضمان منذ 2010 تبني الثقة وتحقق التقدم»',
                    'Since 2010, Qalat Aldhaman Builds Trust and Achieves Progress'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Institutional description (replaces previous stat cards) */}
          <div className={`${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t(
                'قلعة الضمان شركة عراقية رائدة تأسست عام 2010، تقدم حلولاً تجارية وتمويلية مبتكرة داخل السوق العراقي.',
                'Qalaat Aldhaman is a leading Iraqi company founded in 2010, providing innovative commercial and financing solutions within the Iraqi market.'
              )}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t(
                'نعتمد نموذج عمل يقوم على شراء البضائع نقداً وإعادة بيعها بنظام التقسيط اليومي المرن، مما يمنح عملاءنا سهولة في السداد واستقراراً في الحركة التجارية.',
                'We operate a structured model of purchasing goods for cash and reselling them through a flexible daily-installment system, offering our customers convenience in payment and continuity in trade flows.'
              )}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t(
                'على مدار أكثر من 15 عاماً توسعت عملياتنا لتغطي أهم المحافظات العراقية، وبنينا فريق عمل يتجاوز 200 موظف متخصص في المبيعات والتحصيل وإدارة العمليات.',
                'Over more than 15 years, our operations have expanded across key Iraqi provinces, and we have built a team of over 200 professionals specialized in sales, collections and operations management.'
              )}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                'اليوم نخدم أكثر من 150,000 عميل ونمتلك حضوراً فعلياً وتأثيراً واضحاً في السوق المحلي.',
                'Today we serve over 150,000 customers and maintain a strong physical presence and clear influence in the local market.'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
// ...existing code...