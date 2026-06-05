import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';

export default function Favoris() {
  const { t } = useTranslation();
  const { items } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full overflow-x-hidden">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-gold" />
        <h1 className="text-3xl font-serif font-bold text-navy dark:text-cream-100">{t('favorites.title')}</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gold/20 dark:border-gold/35 rounded-lg bg-white dark:bg-navy-900/50 shadow-sm">
          <p className="text-navy/60 dark:text-cream-100/60">{t('favorites.empty')}</p>
          <Link to="/catalogue" className="inline-block mt-4 text-gold font-bold uppercase hover:underline text-sm">
            {t('favorites.discover')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
