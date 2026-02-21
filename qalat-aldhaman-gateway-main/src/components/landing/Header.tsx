import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import logo from '@/assets/logo-main.png';

const Header = () => {
  const { t, isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card/95 backdrop-blur-lg shadow-card border-b border-border'
          : 'bg-transparent'
      }`
    }
    >
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Company Name */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl p-1 flex items-center justify-center bg-white">
              <img
                src={logo}
                alt="Qalaat Al-Dhaman Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <h1 className={`font-bold text-lg ${isRTL ? 'font-arabic' : ''}`}>
                {t('قلعة الضمان', 'Qalaat Al-Dhaman')}
              </h1>
              <h2 className={`text-sm text-foreground/90 ${isRTL ? 'font-arabic' : ''}`}>
                Qalat Aldhaman
              </h2>
            </div>
          </motion.div>

          {/* Right Side: Socials + Language Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://www.facebook.com/invest.alsaedi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <Facebook className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/invest.alsaedi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
              </a>
            </div>

            <LanguageToggle />
          </div>
        </div>
        </motion.div>
    </header>
  );
};

export default Header;