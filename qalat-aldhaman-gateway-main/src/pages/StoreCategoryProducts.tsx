import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Package, RotateCw } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchCategories, fetchCategoryProducts } from '@/lib/storeApi';
import { resolveMediaUrl } from '@/lib/api';
import { formatIQD } from '@/lib/utils';
import type { ProductListItem } from '@/types/store';

function getStartingPrice(product: ProductListItem): number | null {
  const prices = [product.cashPrice, product.monthlyInstallmentPrice, product.dailyInstallmentPrice].filter(
    (price): price is number => price !== null && price !== undefined,
  );
  return prices.length > 0 ? Math.min(...prices) : null;
}

const StoreCategoryProductsContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, isRTL } = useLanguage();
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  // نفس queryKey المستخدم بصفحة قائمة الفئات، فيُعاد استخدام الكاش تلقائياً إن كان المستخدم قادماً منها.
  const { data: categories } = useQuery({
    queryKey: ['store-categories'],
    queryFn: fetchCategories,
  });
  const category = categories?.find((c) => c.slug === slug);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['store-category-products', slug],
    queryFn: () => fetchCategoryProducts(slug ?? ''),
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24 min-h-[60vh] section-container">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/store"
            className={`inline-flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
          >
            <BackArrowIcon className="w-4 h-4" />
            <span>{t('رجوع للفئات', 'Back to Categories')}</span>
          </Link>
        </div>

        <h1 className={`text-3xl sm:text-4xl font-bold text-foreground text-center mb-10 ${isRTL ? 'font-arabic' : ''}`}>
          {category?.name ?? t('منتجات الفئة', 'Category Products')}
        </h1>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-2xl overflow-hidden border border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 sm:p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className={`text-destructive mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {error instanceof Error ? error.message : t('تعذر تحميل المنتجات', 'Failed to load products')}
            </p>
            <Button onClick={() => refetch()} disabled={isFetching} className="gap-2">
              <RotateCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              {t('إعادة المحاولة', 'Retry')}
            </Button>
          </div>
        )}

        {!isLoading && !isError && products && products.length === 0 && (
          <p className={`text-center text-muted-foreground py-16 ${isRTL ? 'font-arabic' : ''}`}>
            {t('لا توجد منتجات متاحة بهذه الفئة حالياً', 'No products available in this category yet')}
          </p>
        )}

        {!isLoading && !isError && products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {products.map((product) => {
              const startingPrice = getStartingPrice(product);

              return (
                <Link
                  key={product.id}
                  to={`/store/product/${product.id}`}
                  className="group block h-full rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={resolveMediaUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Package className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className={`text-sm sm:text-base font-semibold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                      {product.name}
                    </h3>
                    {startingPrice !== null && (
                      <p className={`text-sm text-muted-foreground mt-1 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('يبدأ من', 'Starting from')} {formatIQD(startingPrice)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const StoreCategoryProducts = () => (
  <LanguageProvider>
    <StoreCategoryProductsContent />
  </LanguageProvider>
);

export default StoreCategoryProducts;
