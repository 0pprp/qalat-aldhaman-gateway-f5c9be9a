import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Package, RotateCw } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/lib/storeApi';
import { resolveMediaUrl } from '@/lib/api';

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
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24 min-h-[60vh] section-container">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
          >
            <BackArrowIcon className="w-4 h-4" />
            <span>{t('رجوع', 'Back')}</span>
          </Link>
        </div>

        <h1 className={`text-3xl sm:text-4xl font-bold text-foreground text-center mb-4 ${isRTL ? 'font-arabic' : ''}`}>
          {t('المتجر', 'Store')}
        </h1>
        <p className={`text-muted-foreground text-center max-w-2xl mx-auto mb-10 ${isRTL ? 'font-arabic' : ''}`}>
          {t('اختر فئة لتصفح منتجاتها', 'Choose a category to browse its products')}
        </p>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/store/category/${category.slug}`}
                className="group block h-full rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
              >
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {category.imageUrl ? (
                    <img
                      src={resolveMediaUrl(category.imageUrl)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Package className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/50" />
                  )}
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className={`text-sm sm:text-base font-semibold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const Store = () => (
  <LanguageProvider>
    <StoreContent />
  </LanguageProvider>
);

export default Store;
