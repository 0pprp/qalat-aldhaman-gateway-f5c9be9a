// ...existing code...
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Users, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const circlesRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: Users, value: '150,000+', label: t('عميل', 'Customers'), desc: t('قاعدة عملاء واسعة تعكس ثقة السوق بنظامنا الفريد القائم على الشراء النقدي للشيء الذي يريده الزبون وبيعه بالتقسيط اليومي المرن.', 'A broad customer base reflecting market trust in our unique cash-purchase and flexible daily-installment resale model.') },
    { icon: MapPin, value: '12', label: t('فرع', 'Branches'), desc: t('انتشار جغرافي يغطي أهم المحافظات العراقية لضمان سرعة الوصول ودعم شركائنا في جميع المناطق.', 'Geographic coverage across key Iraqi provinces ensuring fast access and partner support in all regions.') },
    { icon: Calendar, value: '15', label: t('سنة خبرة', 'Years'), desc: t('خبرة متراكمة في السوق العراقي منذ عام 2010 مكّنتنا من بناء نموذج عمل مستقر يعتمد على الشراء النقدي والتوزيع المنظم.', 'Accumulated market experience since 2010 enabling a stable business model based on cash purchases and organized distribution.') },
    { icon: Users, value: '200+', label: t('موظف', 'Employees'), desc: t('فريق متخصص في المبيعات، التحصيل، إدارة المخاطر، وخدمة العملاء يعمل يومياً لضمان استمرارية العمليات بكفاءة عالية.', 'A specialized team in sales, collections, risk management and customer service, working daily to ensure high efficiency and continuity.') },
  ];

  const [hoveredStat, setHoveredStat] = useState<number | null>(null);


  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Decorative floating circles layer (z-0) with cursor-follow */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        ref={(el) => circlesRef.current = el}
        onMouseMove={(e) => {
          const parent = circlesRef.current;
          if (!parent) return;
          const children = Array.from(parent.children) as HTMLElement[];
          const cx = e.clientX;
          const cy = e.clientY;
          children.forEach((ch, i) => {
            const rectC = ch.getBoundingClientRect();
            const baseX = rectC.left + rectC.width / 2;
            const baseY = rectC.top + rectC.height / 2;
            const vx = cx - baseX;
            const vy = cy - baseY;
            const strength = parseFloat(ch.dataset.str || '0.12');
            const dx = vx * strength;
            const dy = vy * strength;
            ch.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
            ch.style.transition = 'transform 0.28s ease-out';
          });
        }}
        onMouseLeave={() => {
          const parent = circlesRef.current;
          if (!parent) return;
          Array.from(parent.children).forEach((ch) => {
            (ch as HTMLElement).style.transform = '';
          });
        }}
      >
        {[
          { left: '4%', top: '6%', size: 20, color: 'rgba(255,255,255,0.12)', dur: 8, delay: 0 },
          { left: '12%', top: '18%', size: 70, color: 'rgba(212,175,55,0.10)', dur: 14, delay: 1 },
          { right: '6%', top: '8%', size: 36, color: 'rgba(255,255,255,0.10)', dur: 10, delay: 2 },
          { left: '8%', bottom: '10%', size: 84, color: 'rgba(212,175,55,0.09)', dur: 16, delay: 3 },
          { right: '12%', bottom: '6%', size: 48, color: 'rgba(255,255,255,0.11)', dur: 12, delay: 4 },
          { left: '45%', top: '4%', size: 18, color: 'rgba(255,255,255,0.08)', dur: 9, delay: 1.5 },
          { left: '75%', top: '22%', size: 28, color: 'rgba(212,175,55,0.12)', dur: 11, delay: 2.5 },
          { left: '85%', bottom: '18%', size: 20, color: 'rgba(255,255,255,0.09)', dur: 7, delay: 0.5 },
          { left: '30%', bottom: '22%', size: 34, color: 'rgba(212,175,55,0.08)', dur: 13, delay: 3.5 },
          { right: '40%', top: '40%', size: 14, color: 'rgba(255,255,255,0.10)', dur: 6, delay: 2 },
          { left: '6%', top: '40%', size: 50, color: 'rgba(212,175,55,0.11)', dur: 15, delay: 4.2 },
          { right: '8%', top: '56%', size: 26, color: 'rgba(255,255,255,0.1)', dur: 9.5, delay: 1.2 },
          { left: '52%', bottom: '6%', size: 90, color: 'rgba(212,175,55,0.08)', dur: 18, delay: 0.8 },
          { right: '20%', bottom: '30%', size: 30, color: 'rgba(255,255,255,0.12)', dur: 10, delay: 2.2 },
          { left: '20%', top: '72%', size: 22, color: 'rgba(212,175,55,0.09)', dur: 8.5, delay: 3.1 },
          { left: '86%', top: '6%', size: 16, color: 'rgba(255,255,255,0.12)', dur: 7.5, delay: 2.8 },
          { left: '66%', top: '10%', size: 44, color: 'rgba(212,175,55,0.13)', dur: 12.5, delay: 1.7 },
          { left: '12%', top: '54%', size: 12, color: 'rgba(255,255,255,0.09)', dur: 6.5, delay: 0.6 },
          { right: '4%', top: '30%', size: 60, color: 'rgba(212,175,55,0.1)', dur: 14.5, delay: 4.8 },
          { left: '40%', top: '28%', size: 38, color: 'rgba(255,255,255,0.08)', dur: 11.5, delay: 2.6 },
          { right: '60%', bottom: '12%', size: 46, color: 'rgba(212,175,55,0.09)', dur: 13.2, delay: 3.3 },
          { left: '2%', bottom: '64%', size: 30, color: 'rgba(255,255,255,0.08)', dur: 9.1, delay: 1.9 },
          { left: '50%', top: '50%', size: 10, color: 'rgba(212,175,55,0.12)', dur: 6.8, delay: 2.4 },
          // extra to reach 25+
          { left: '28%', top: '12%', size: 26, color: 'rgba(255,255,255,0.1)', dur: 9, delay: 2.9 },
          { left: '62%', top: '34%', size: 32, color: 'rgba(212,175,55,0.095)', dur: 13, delay: 3.7 },
        ].map((c, i) => {
          const strength = (0.28 - Math.min(i / 40, 0.22));
          return (
            <div
              key={i}
              data-str={String(strength)}
              aria-hidden
              style={{
                position: 'absolute',
                ...(c.left ? { left: c.left } : {}),
                ...(c.right ? { right: c.right } : {}),
                ...(c.top ? { top: c.top } : {}),
                ...(c.bottom ? { bottom: c.bottom } : {}),
                width: c.size,
                height: c.size,
                borderRadius: '9999px',
                background: c.color,
                zIndex: 0,
                pointerEvents: 'none',
                transform: 'translate3d(0,0,0)'
              }}
              className="blur-sm"
            />
          );
        })}
      </div>
      {/* Logo watermark removed as requested (green square inside image) */}

      {/* Animated Background Pattern - Castle-inspired geometric shapes */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(45 86% 62% / 0.3) 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated Floating Shapes - Circle from logo */}
      <motion.div
        animate={{ 
          y: [0, -40, 0], 
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-accent/30 to-accent/20 blur-2xl"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0], 
          x: [0, -25, 0],
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/15 blur-3xl"
      />
      
      {/* Arrow-inspired decorative element */}
      <motion.div
        animate={{ 
          x: [0, 30, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-b-accent/10 border-r-[60px] border-r-transparent rotate-45"
      />

      {/* Circle decorative elements - inspired by logo circle */}
      <motion.div
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, 180, 360],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-accent/30"
      />
      <motion.div
        animate={{ 
          y: [0, 25, 0], 
          rotate: [360, 180, 0],
          opacity: [0.05, 0.12, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full border-2 border-primary-foreground/25"
      />

      <div className="section-container relative z-10 pt-24 pb-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <motion.div 
              className="w-44 h-44 rounded-3xl backdrop-blur-sm shadow-2xl p-4 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  '0 25px 50px -12px hsl(45 86% 52% / 0.4)',
                  '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="w-full h-full bg-white rounded-2xl p-3 flex items-center justify-center overflow-hidden">
                <img 
                  src={logo} 
                  alt="Qalaat Al-Dhaman Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Title with Gold Accent */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight ${isRTL ? 'font-arabic' : ''}`}
          >
            {t('قلعة الضمان', 'Qalat Al-Dhaman')}
          </motion.h1>

          {/* Slogan with Gold Highlight */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-8 ${isRTL ? 'font-arabic' : ''}`}
          >
            <span className="text-accent">
              {t('نبني الثقة.. نحقق التقدم', 'Building Trust.. Achieving Progress')}
            </span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`text-lg sm:text-xl text-primary-foreground/85 max-w-3xl mx-auto mb-12 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
          >
            {t(
              'شركة عراقية رائدة تقدم حلولًا تجارية وتسويقية مبتكرة منذ عام 2010',
              'A leading Iraqi company providing innovative commercial and marketing solutions since 2010'
            )}
          </motion.p>

          {/* Gold CTA Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16"
          >
            <motion.a
              href="https://linktr.ee/Qalat_Aldhaman"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 hsl(45 86% 62% / 0.5)',
                  '0 0 0 20px hsl(45 86% 62% / 0)',
                  '0 0 0 0 hsl(45 86% 62% / 0)'
                ]
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
                scale: { duration: 0.2 },
                y: { duration: 0.2 }
              }}
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gold-gradient text-secondary font-bold text-lg shadow-gold hover:shadow-[0_20px_50px_hsl(45_86%_52%_/_0.4)] transition-all duration-300 ${isRTL ? 'font-arabic' : ''}`}
            >
              <Phone className="w-6 h-6" />
              <span>
                {t('تواصل معنا', 'Contact Us')}
              </span>
            </motion.a>
          </motion.div>

          {/* Static Stats (no entrance animation, no count-up) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const isExpanded = hoveredStat === index;
                return (
                  <article
                    key={index}
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                    onClick={() => setHoveredStat((s) => (s === index ? null : index))}
                    className="bg-white/10 backdrop-blur-md border border-accent/30 rounded-2xl p-6 text-center group cursor-pointer hover:shadow-lg transition-all duration-200"
                    aria-expanded={isExpanded}
                  >
                    <div className="mb-3">
                      <stat.icon className="w-8 h-8 text-accent mx-auto mb-3 group-hover:text-accent transition-colors" />
                    </div>

                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>

                    <div className={`text-primary-foreground/70 text-sm group-hover:text-accent/80 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                      {stat.label}
                    </div>

                    <div
                      className={`mt-3 text-sm text-primary-foreground/75 leading-relaxed overflow-hidden transition-[max-height,padding] duration-300 ${isRTL ? 'font-arabic' : ''}`}
                      style={{ maxHeight: isExpanded ? '400px' : '3.2rem' }}
                    >
                      {stat.desc}
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setHoveredStat((s) => (s === index ? null : index)); }}
                        className="text-sm text-accent inline-flex items-center gap-1 hover:underline"
                        aria-controls={`stat-desc-${index}`}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? t('عرض اقل', 'Show less') : t('عرض المزيد', 'Show more')}
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>

        {/* Scroll Indicator with Gold */}
        <motion.button
          onClick={scrollToAbout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent/70 hover:text-accent transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
// ...existing code...