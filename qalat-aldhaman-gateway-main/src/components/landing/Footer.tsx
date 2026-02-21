import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-main.png';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  const navLinks = [
    { id: 'about', label: t('من نحن', 'About Us') },
    { id: 'values', label: t('قيمنا', 'Values') },
    { id: 'vision-mission-goals', label: t('رؤيتنا', 'Vision') },
    { id: 'challenges', label: t('التحديات', 'Challenges') },
    { id: 'branches', label: t('فروعنا', 'Branches') },
    { id: 'why-us', label: t('لماذا نحن', 'Why Us') },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/invest.alsaedi', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/invest.alsaedi', label: 'Instagram' },
  ];

  return (
    <footer className="bg-hero-gradient text-white relative overflow-hidden">
      {/* Logo Watermark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <img 
          src={logo} 
          alt="" 
          className="w-[600px] h-[600px] object-contain"
        />
      </div>

      {/* Background Pattern - Geometric dots */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(45 86% 62% / 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="section-container relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-16 h-16 rounded-xl p-1 flex items-center justify-center bg-white">
                <img 
                  src={logo} 
                  alt="Qalaat Al-Dhaman Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className={`font-bold text-xl text-white ${isRTL ? 'font-arabic' : ''}`}>
                  {t('قلعة الضمان', 'Qalaat Al-Dhaman')}
                </h2>
              </div>
            </motion.div>
            <p className={`text-primary-foreground/70 mb-6 ${isRTL ? 'font-arabic text-right' : ''}`}>
              {t(
                'نبني الثقة ونحقق التقدم منذ 2010',
                'Building Trust, Achieving Progress Since 2010'
              )}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 border border-accent/30 flex items-center justify-center hover:bg-accent/20 hover:border-accent/50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-bold text-lg text-white mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t('روابط سريعة', 'Quick Links')}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className={`text-primary-foreground/70 hover:text-accent transition-colors ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`font-bold text-lg text-white mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t('تواصل معنا', 'Contact Us')}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://linktr.ee/Qalat_Aldhaman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Phone className="w-5 h-5 text-accent" />
                  <span className={isRTL ? 'font-arabic' : ''}>{t('تواصل معنا', 'Contact Us')}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@qalatdhaman.com"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Mail className="w-5 h-5 text-accent" />
                  <span>info@qalatdhaman.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className={isRTL ? 'font-arabic text-right' : ''}>
                  {t('النجف الأشرف – حي السلام – خلف مدينة الألعاب', 'Najaf – Al-Salam District – Behind the Amusement Park')}
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h3 className={`font-bold text-lg text-white mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t('ابدأ معنا اليوم', 'Get Started Today')}
            </h3>
            <p className={`text-primary-foreground/70 mb-6 ${isRTL ? 'font-arabic text-right' : ''}`}>
              {t(
                'تواصل معنا الآن للحصول على أفضل الحلول التسويقية والتجارية',
                'Contact us now to get the best marketing and commercial solutions'
              )}
            </p>
            <motion.a
              href="https://linktr.ee/Qalat_Aldhaman"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-secondary font-bold shadow-gold hover:shadow-lg transition-all duration-300 ${isRTL ? 'font-arabic' : ''}`}
            >
              <Phone className="w-4 h-4" />
              <span>
                {t('تواصل معنا', 'Contact Us')}
              </span>
            </motion.a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm text-primary-foreground/60 ${isRTL ? 'font-arabic' : ''}`}>
              © {new Date().getFullYear()} {t('قلعة الضمان. جميع الحقوق محفوظة', 'Qalaat Al-Dhaman. All Rights Reserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
