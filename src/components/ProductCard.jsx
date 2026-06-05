import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();

  const isWishlisted = hasItem(product.id);
  const isInStock = product.stock > 0;
  
  // Calculate average rating
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const currentPrice = parseFloat(product.sale_price || product.price);
  const originalPrice = product.sale_price ? parseFloat(product.price) : null;
  const isPromo = !!product.sale_price;

  return (
    <div className="group bg-white dark:bg-navy-800 border border-gold/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative animate-fade-up">
      
      {/* Product Image Gallery Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-cream-100 flex items-center justify-center">
        <Link to={`/produit/${product.slug}`} className="w-full h-full block">
          <img
            src={product.primary_image?.url || (product.images && product.images[0]?.url) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'}
            alt={product.primary_image?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!isInStock && (
            <span className="bg-navy/80 text-cream text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-gold/20">
              {t('product.badge.out_of_stock')}
            </span>
          )}
          {isInStock && isPromo && (
            <span className="bg-gold text-navy text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
              {t('product.badge.promo')}
            </span>
          )}
          {isInStock && product.is_featured && (
            <span className="bg-navy text-gold text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-gold/30">
              {t('product.badge.featured')}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleItem(product)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm hover:scale-110 transition-all duration-300 z-10 cursor-pointer ${
            isWishlisted 
              ? 'bg-gold text-navy' 
              : 'bg-white/80 text-navy hover:bg-white hover:text-gold'
          }`}
          title={t('product.add_to_favorites')}
        >
          <Heart className="h-4.5 w-4.5 fill-current" />
        </button>

        {/* Quick Add To Cart Overlay (Desktop) */}
        {isInStock && (
          <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 hidden sm:block">
            <button
              onClick={() => addItem(product)}
              className="w-full bg-gold hover:bg-navy hover:text-gold text-navy font-bold py-2 px-4 rounded text-sm transition-gold flex items-center justify-center gap-2 shadow-lg border border-gold"
            >
              <ShoppingCart className="h-4 w-4" />
              {t('product.add_to_cart')}
            </button>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-grow text-left">
        {/* Category */}
        <p className="text-xs uppercase tracking-widest text-gold font-medium mb-1">
          {product.category?.name || t('product.category_default')}
        </p>
        <h3 className="font-serif text-base font-semibold text-navy dark:text-cream-100 hover:text-gold transition-colors line-clamp-1 mb-1">
          <Link to={`/produit/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3 text-xs">
          {avgRating ? (
            <>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(avgRating) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-navy/60 dark:text-cream-300/60 font-medium">({avgRating})</span>
            </>
          ) : (
            <span className="text-navy/40 dark:text-cream-300/40 italic">{t('product.no_reviews')}</span>
          )}
        </div>

        {/* Price & Action (mobile) */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gold/5">
          <div className="flex items-baseline gap-2">
            <span className="text-navy dark:text-cream-100 font-bold font-serif text-lg">
              {currentPrice.toLocaleString()} DA
            </span>
            {originalPrice && (
              <span className="text-navy/40 text-sm line-through font-serif">
                {originalPrice.toLocaleString()} DA
              </span>
            )}
          </div>

          {/* Quick Add Button for Mobile / Small Screens */}
          {isInStock && (
            <button
              onClick={() => addItem(product)}
              className="p-2 rounded bg-gold/10 hover:bg-gold text-gold hover:text-navy transition-all duration-300 sm:hidden cursor-pointer"
              title={t('product.add_to_cart')}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
