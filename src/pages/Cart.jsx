import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag, Percent } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from 'react-i18next';
import { validateCoupon } from '../services/catalog';

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, coupon, applyCoupon, removeCoupon, getCartTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const { subtotal, discount, total, itemCount } = getCartTotal();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponCode.trim()) {
      setCouponError('Veuillez saisir un code promo.');
      return;
    }

    try {
      const coupon = await validateCoupon({ code: couponCode.trim(), subtotal });
      applyCoupon({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      });
      setCouponSuccess(true);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Code promo invalide.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-cream text-gold border border-gold/20">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-navy dark:text-cream-100">{t('cart.empty')}</h2>
        <p className="text-navy/60 dark:text-cream-300/60 max-w-md mx-auto">
          {t('cart.empty_desc')}
        </p>
        <div className="pt-4">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 bg-gold hover:bg-navy-800 text-navy hover:text-gold font-bold py-3.5 px-8 rounded-full border border-gold transition-gold text-sm tracking-wider uppercase"
          >
            {t('cart.continue_shopping')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-left w-full overflow-x-hidden">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy dark:text-cream-100 mb-8 border-b border-gold/10 pb-4">
        {t('cart.title')} ({itemCount} {itemCount > 1 ? 'articles' : 'article'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const price = parseFloat(item.product.sale_price || item.product.price);
            const modifier = item.variant ? parseFloat(item.variant.price_modifier || 0) : 0;
            const finalUnitPrice = price + modifier;
            const finalItemTotal = finalUnitPrice * item.quantity;

            return (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gold/10 p-4 rounded-lg bg-white dark:bg-navy-800 shadow-sm hover:shadow-md transition-shadow gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-cream-100 rounded overflow-hidden flex-shrink-0 border border-gold/10">
                    <img 
                      src={item.product.primary_image?.url || (item.product.images && item.product.images[0]?.url) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-navy dark:text-cream-100 text-base hover:text-gold">
                      <Link to={`/produit/${item.product.slug}`}>{item.product.name}</Link>
                    </h3>
                    {item.variant && (
                      <p className="text-xs text-gold font-medium mt-1">
                        Taille: {item.variant.size} {item.variant.material && `| ${item.variant.material}`}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-navy dark:text-cream-100 mt-1 font-serif">
                      {finalUnitPrice.toLocaleString()} DA
                    </p>
                  </div>
                </div>

                {/* Actions: Quantity Selector & Trash */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  
                  {/* Quantity picker */}
                  <div className="flex items-center border border-gold/20 rounded bg-white dark:bg-navy-800">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 font-bold text-navy hover:text-gold"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono text-sm text-navy">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 font-bold text-navy hover:text-gold"
                    >
                      +
                    </button>
                  </div>

                  {/* Total price for item */}
                  <span className="font-serif font-bold text-navy text-base min-w-24 text-right">
                    {finalItemTotal.toLocaleString()} DA
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-navy/40 hover:text-red-500 transition-colors p-1"
                    title="Supprimer l'article"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="border border-gold/25 rounded-lg p-6 bg-cream-100/30 dark:bg-navy-800/40 space-y-6">
            <h2 className="text-xl font-serif font-bold text-navy dark:text-cream-100 border-b border-gold/15 pb-2">
              Résumé de la Commande
            </h2>

            {/* Calculations list */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-navy/70 dark:text-cream-300/70">{t('cart.subtotal')}</span>
                <span className="font-serif font-bold text-navy dark:text-cream-100">{subtotal.toLocaleString()} DA</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    Réduction coupon {coupon && `(${coupon.code})`}
                  </span>
                  <span className="font-serif">- {discount.toLocaleString()} DA</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-navy/70 dark:text-cream-300/70">{t('cart.shipping')}</span>
                <span className="text-xs text-navy/55 dark:text-cream-300/55 italic">{t('cart.shipping_calc')}</span>
              </div>

              <div className="border-t border-gold/10 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-navy dark:text-cream-100">TOTAL TTC</span>
                <span className="text-2xl font-serif font-bold text-gold">
                  {total.toLocaleString()} DA
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              to="/checkout"
              className="w-full h-12 bg-gold hover:bg-navy-800 text-navy hover:text-gold font-bold rounded flex items-center justify-center gap-2 border border-gold transition-gold shadow cursor-pointer uppercase tracking-wider text-sm"
            >
              Passer la commande
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Coupon Entry Card */}
          <div className="border border-gold/10 rounded-lg p-6 bg-white dark:bg-navy-800 space-y-4">
            <h3 className="text-sm font-semibold text-navy dark:text-cream-100 uppercase tracking-wider flex items-center gap-2">
              <Tag className="h-4 w-4 text-gold" />
              {t('cart.promo_code')}
            </h3>
            
            {coupon ? (
              <div className="flex items-center justify-between bg-gold/10 border border-gold/20 p-3 rounded">
                <div>
                  <p className="text-xs text-navy/60">Coupon appliqué</p>
                  <p className="text-sm font-bold text-gold">{coupon.code}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}

                  className="flex-1 border border-gold/20 rounded px-3 py-2 text-sm outline-none focus:border-gold uppercase"
                />
                <button
                  type="submit"
                  className="bg-navy text-cream px-4 py-2 rounded text-sm font-bold hover:bg-gold hover:text-navy border border-navy transition-colors cursor-pointer"
                >
                  Appliquer
                </button>
              </form>
            )}
            
            {couponError && <p className="text-xs text-red-400 mt-1">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-600 mt-1">Code promo appliqué avec succès !</p>}
          </div>

        </div>

      </div>

    </div>
  );
}
