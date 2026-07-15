import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Package, PlayCircle, RotateCw, Sparkles } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/landing/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import MyOrdersDialog from '@/components/store/MyOrdersDialog';
import StorePageBackground from '@/components/store/StorePageBackground';
import { fetchCategories } from '@/lib/storeApi';
import { resolveMediaUrl } from '@/lib/api';

// TODO: استبدل هذا برابط الفيديو الفعلي عند توفره
const INTRO_VIDEO_URL = 'https://example.com/intro-video-placeholder';

const ABOUT_TEXT_AR =
  'اهلا وسهلا بكم وياكم شركة قلعة الضمان وهي شركة متواجدة في (بغداد – ديالى – الموصل – كركوك – وكل محافظات الوسط والجنوب) نبيع لكم كل ما ترغبون به بالاقساط اليومية. انت كاعد بمحلك توصلك السلعة الي تريدها ويجيك مندوب الجباية يوميا يأخذ منك القسط ويسلمك وصل بالمبلغ المدفوع وكذلك نتعامل بالاقساط الشهرية.';

const ABOUT_TEXT_EN =
  'Welcome to Qalat Aldhaman, a company operating across Baghdad, Diyala, Mosul, Kirkuk, and all central and southern Iraqi provinces. We sell everything you need on daily installment plans. While you stay at your shop, we deliver the product you want, and a collection representative visits you daily to collect the installment and hand you a receipt for the amount paid. We also offer monthly installment plans.';

const StoreContent = () => {
  const { t, isRTL } = useLanguage();
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['store-categories'],
    queryFn: fetchCategories,
  });

  return (
    <div className="min-h-screen relative">
      <StorePageBackground />
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D4F4B] via-[#0F5B57] to-[#0D4F4B] pt-32 pb-12 sm:pb-16 mb-12 shadow-[0_20px_50px_-15px_rgba(13,79,75,0.5)]">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="section-container relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 text-sm sm:text-base text-white/80 hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}
            >
              <BackArrowIcon className="w-4 h-4" />
              <span>{t('رجوع', 'Back')}</span>
            </Link>
            <MyOrdersDialog />
          </div>

          <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`text-4xl sm:text-5xl font-bold text-white mb-6 ${isRTL ? 'font-arabic' : ''}`}
          >
            {t('المتجر', 'Store')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/25 p-6 sm:p-8 max-w-3xl mx-auto mb-8"
          >
            <p className={`text-white/95 leading-relaxed text-center sm:text-start ${isRTL ? 'font-arabic' : ''}`}>
              {t(ABOUT_TEXT_AR, ABOUT_TEXT_EN)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
          >
            <Button
              className="btn-gold gap-2 hover:brightness-110"
              onClick={() => window.open(INTRO_VIDEO_URL, '_blank', 'noopener,noreferrer')}
            >
              <PlayCircle className="w-4 h-4" />
              <span className={isRTL ? 'font-arabic' : ''}>{t('شاهد الفيديو التعريفي', 'Watch Intro Video')}</span>
            </Button>
          </motion.div>
          </div>
        </div>
      </section>

      <main className="pb-24 min-h-[40vh] section-container">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-10 bg-primary/30" />
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="h-px w-10 bg-primary/30" />
        </div>
        <p className={`text-muted-foreground text-center max-w-2xl mx-auto mb-10 ${isRTL ? 'font-arabic' : ''}`}>
          {t('اختر فئة لتصفح منتجاتها', 'Choose a category to browse its products')}
        </p>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-2xl overflow-hidden border border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 sm:p-4">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className={`text-destructive mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {error instanceof Error ? error.message : t('تعذر تحميل الفئات', 'Failed to load categories')}
            </p>
            <Button onClick={() => refetch()} disabled={isFetching} className="gap-2">
              <RotateCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              {t('إعادة المحاولة', 'Retry')}
            </Button>
          </div>
        )}

        {!isLoading && !isError && categories && categories.length === 0 && (
          <p className={`text-center text-muted-foreground py-16 ${isRTL ? 'font-arabic' : ''}`}>
            {t('لا توجد فئات متاحة حالياً', 'No categories available yet')}
          </p>
        )}

        {!isLoading && !isError && categories && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/store/category/${category.slug}`}
                  className="group block h-full rounded-2xl bg-card border border-primary/20 shadow-[0_10px_30px_-8px_rgba(15,91,87,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(15,91,87,0.35)] hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {category.imageUrl ? (
                      <img
                        src={resolveMediaUrl(category.imageUrl)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className={`text-base sm:text-lg font-bold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const Store = () => (
  <LanguageProvider>
    <StoreContent />
  </LanguageProvider>
);

export default Store;
