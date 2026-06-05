import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Star, Share2, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProduct } from '../services/catalog';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details, materials, care, shipping
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();

  useEffect(() => {
    setLoading(true);
    fetchProduct(slug)
      .then(({ product: foundProduct, related }) => {
        setProduct(foundProduct);
        setRelatedProducts(related);
        setSelectedImage(foundProduct.primary_image?.url || foundProduct.images?.[0]?.url);
        if (foundProduct.variants?.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        } else {
          setSelectedVariant(null);
        }
        setQuantity(1);
        setAddedToCart(false);
      })
      .catch(() => {
        setProduct(null);
        setRelatedProducts([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-navy/60 dark:text-cream-100/60">
        {t('product.loading')}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100">{t('product.not_found')}</h2>
        <p className="text-navy/60 dark:text-cream-100/60 mt-2">{t('product.not_found_desc')}</p>
        <Link to="/catalogue" className="inline-block mt-6 text-gold font-bold uppercase tracking-wider hover:underline">
          &larr; {t('product.back_to_catalog')}
        </Link>
      </div>
    );
  }

  const isWishlisted = hasItem(product.id);
  const isInStock = product.stock > 0;
  
  const originalPrice = parseFloat(product.price);
  const basePrice = parseFloat(product.sale_price || product.price);
  const modifier = selectedVariant ? parseFloat(selectedVariant.price_modifier || 0) : 0;
  const currentPrice = basePrice + modifier;
  const currentOriginalPrice = product.sale_price ? originalPrice + modifier : null;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-left w-full overflow-x-hidden">
      
      {/* Breadcrumb / Back button */}
      <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm text-navy/70 dark:text-cream-100/70 hover:text-gold transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        {t('product.back_to_catalog')}
      </Link>

      {/* Main product columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-cream-100 dark:bg-navy-900 rounded-lg overflow-hidden border border-gold/15 flex items-center justify-center relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 bg-cream-100 dark:bg-navy-900 rounded overflow-hidden border cursor-pointer transition-all duration-255 ${selectedImage === img.url ? 'border-gold scale-105 shadow' : 'border-gold/20 dark:border-gold/30 hover:border-gold/60'}`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info and Selection */}
        <div className="space-y-6">
          
          {/* Category */}
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {product.category?.name}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy dark:text-cream-100">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-navy/70 dark:text-cream-100/70">{t('product.reviews_placeholder')}</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 pt-2 border-t border-gold/10 dark:border-gold/20">
            <span className="text-3xl font-serif font-bold text-navy dark:text-cream-100">
              {currentPrice.toLocaleString()} DA
            </span>
            {currentOriginalPrice && (
              <span className="text-xl font-serif text-navy/40 dark:text-cream-100/40 line-through">
                {currentOriginalPrice.toLocaleString()} DA
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-navy-950/80 dark:text-cream-100/80 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gold/10 dark:border-gold/20">
              <h3 className="text-sm font-semibold text-navy dark:text-cream-100 uppercase tracking-wider">{t('product.size')}</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-xs font-bold rounded border cursor-pointer transition-all duration-300 ${selectedVariant?.id === v.id ? 'bg-gold border-gold text-navy dark:text-navy-950' : 'bg-white dark:bg-navy-900 border-gold/20 dark:border-gold/30 text-navy-800 dark:text-cream-100 hover:border-gold'}`}
                  >
                    {v.size} {v.material && `(${v.material})`} {v.price_modifier > 0 && `+${v.price_modifier} DA`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions: Quantity + Cart + Wishlist */}
          <div className="space-y-4 pt-6 border-t border-gold/10 dark:border-gold/20">
            {isInStock ? (
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Quantity Picker */}
                <div className="flex items-center border border-gold/20 dark:border-gold/35 rounded h-12 bg-white dark:bg-navy-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 font-bold text-navy dark:text-cream-100 hover:text-gold"
                  >
                    -
                  </button>
                  <span className="px-4 font-mono font-bold text-navy dark:text-cream-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 font-bold text-navy dark:text-cream-100 hover:text-gold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded font-bold transition-all duration-300 flex items-center justify-center gap-2 border shadow cursor-pointer ${
                    addedToCart 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-gold border-gold text-navy dark:text-navy-950 hover:bg-navy-800 hover:text-gold dark:hover:bg-navy-950'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5" />
                      {t('product.added')}
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      {t('product.add_to_cart')}
                    </>
                  )}
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  onClick={() => toggleItem(product)}
                  className={`h-12 w-12 rounded border flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-gold border-gold text-navy dark:text-navy-950' 
                      : 'bg-white dark:bg-navy-900 border-gold/20 dark:border-gold/30 text-navy dark:text-cream-100 hover:text-gold hover:border-gold'
                  }`}
                  title={t('product.add_to_favorites')}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>

              </div>
            ) : (
              <div className="bg-navy/5 dark:bg-navy-900/50 border border-gold/20 dark:border-gold/30 text-navy/70 dark:text-cream-100/70 p-4 rounded text-center">
                {t('product.out_of_stock')}
              </div>
            )}
          </div>

          {/* Details Accordion/Tabs */}
          <div className="pt-8">
            <div className="flex border-b border-gold/20 dark:border-gold/30 text-sm">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-4 font-serif font-bold border-b-2 cursor-pointer transition-colors ${activeTab === 'details' ? 'border-gold text-gold' : 'border-transparent text-navy/70 dark:text-cream-100/70 hover:text-gold'}`}
              >
                {t('product.tab_description')}
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-2 px-4 font-serif font-bold border-b-2 cursor-pointer transition-colors ${activeTab === 'materials' ? 'border-gold text-gold' : 'border-transparent text-navy/70 dark:text-cream-100/70 hover:text-gold'}`}
              >
                {t('product.tab_materials')}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`py-2 px-4 font-serif font-bold border-b-2 cursor-pointer transition-colors ${activeTab === 'care' ? 'border-gold text-gold' : 'border-transparent text-navy/70 dark:text-cream-100/70 hover:text-gold'}`}
              >
                {t('product.tab_care')}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-2 px-4 font-serif font-bold border-b-2 cursor-pointer transition-colors ${activeTab === 'shipping' ? 'border-gold text-gold' : 'border-transparent text-navy/70 dark:text-cream-100/70 hover:text-gold'}`}
              >
                {t('product.tab_shipping')}
              </button>
            </div>
            
            <div className="py-4 text-sm text-navy-950/80 dark:text-cream-100/80 leading-relaxed min-h-24">
              {activeTab === 'details' && (
                <p>{t('product.desc_tab_content')}</p>
              )}
              {activeTab === 'materials' && (
                <p>{t('product.materials_tab_content')}</p>
              )}
              {activeTab === 'care' && (
                <p>{t('product.care_tab_content')}</p>
              )}
              {activeTab === 'shipping' && (
                <p>{t('product.shipping_tab_content')}</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gold/10 dark:border-gold/20 pt-16">
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100 mb-8">{t('product.related_products')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
