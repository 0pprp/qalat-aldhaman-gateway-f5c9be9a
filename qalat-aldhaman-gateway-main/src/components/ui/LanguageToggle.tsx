import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
      aria-label={t('تغيير اللغة', 'Change language')}
    >
      <Globe className="w-4 h-4 text-secondary" />
      <span className="text-sm font-medium text-foreground">
        {language === 'ar' ? 'EN' : 'عربي'}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;
