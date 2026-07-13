import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCategories } from '@/lib/storeApi';
import { resolveMediaUrl } from '@/lib/api';

const OurProducts = () => {
  const { t, isRTL } = useLanguage();

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['store-categories'],
    queryFn: fetchCategories,
  });

  // فشل التحميل أو عدم وجود فئات فعّالة: القسم يختفي بصمت بالصفحة الرئيسية العامة.
  if (!isLoading && (isError || !categories || categories.length === 0)) {
    return null;
  }

  const featuredCategories = categories?.slice(0, 4) ?? [];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.04 }}
          className="text-center mb-6"
        >
          <span className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm ${isRTL ? 'font-arabic' : ''}`}>
            {t('منتجاتنا', 'Our Products')}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-center mb-4 ${isRTL ? 'font-arabic' : ''}`}
        >
          {t('تصفح منتجاتنا', 'Browse Our Products')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className={`text-sm md:text-base text-muted-foreground/90 text-center max-w-2xl mx-auto mb-12 ${isRTL ? 'font-arabic' : ''}`}
        >
          {t(
            'تصفح فئات منتجاتنا، مع إمكانية الشراء نقداً أو بالتقسيط حسب كل فئة.',
            'Browse our product categories, with cash or installment purchase options depending on each category.',
          )}
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border border-border">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3 sm:p-4">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                </div>
              ))
            : featuredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: 0.08 * index, ease: 'easeOut' }}
                >
                  <Link
                    to={`/store/category/${category.slug}`}
                    className="group block h-full rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {category.imageUrl ? (
                        <img
                          src={resolveMediaUrl(category.imageUrl)}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <Package className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/50 transition-transform duration-300 group-hover:scale-110" />
                      )}
                    </div>
                    <div className="p-3 sm:p-4 text-center">
                      <h3 className={`text-sm sm:text-base font-semibold text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
