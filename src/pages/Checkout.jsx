import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Home, MapPin, Truck, ChevronRight, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import { fetchShippingZones, validateCoupon } from '../services/catalog';
import api from '../services/api';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart, coupon, applyCoupon, removeCoupon } = useCartStore();
  const { subtotal, discount, total: cartTotal } = getCartTotal();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Checkout steps: 1 = Address, 2 = Shipping, 3 = Payment, 4 = Success
  const [step, setStep] = useState(1);
  
  // Form states
  const [addressData, setAddressData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    wilaya_code: '',
    address: '',
  });

  const [shippingMethod, setShippingMethod] = useState('home'); // home or relay
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod | baridimob
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [wilayas, setWilayas] = useState([]);

  useEffect(() => {
    fetchShippingZones()
      .then(setWilayas)
      .catch(() => setWilayas([]));
  }, []);

  const selectedWilaya = wilayas.find(w => w.wilaya_code === addressData.wilaya_code);
  const shippingCost = selectedWilaya 
    ? (shippingMethod === 'home' ? parseFloat(selectedWilaya.home_cost) : parseFloat(selectedWilaya.relay_cost))
    : 0;
  
  const finalOrderTotal = cartTotal + shippingCost;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressData.first_name || !addressData.last_name || !addressData.phone || !addressData.wilaya_code || !addressData.address) {
      alert(t('checkout.alert_fields'));
      return;
    }
    setStep(2);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponCode.trim()) {
      setCouponError('Veuillez saisir un code promo.');
      return;
    }

    try {
      const couponData = await validateCoupon({ code: couponCode.trim(), subtotal });
      applyCoupon({
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
      });
      setCouponSuccess(true);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Code promo invalide.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      first_name: addressData.first_name,
      last_name: addressData.last_name,
      phone: addressData.phone,
      wilaya_code: addressData.wilaya_code,
      address: addressData.address,
      shipping_method: shippingMethod,
      shipping_cost: shippingCost,
      payment_method: paymentMethod,
      coupon_code: coupon?.code || null,
      items: items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id ?? null,
        quantity: item.quantity,
        unit_price:
          parseFloat(item.product.sale_price || item.product.price) +
          (item.variant ? parseFloat(item.variant.price_modifier || 0) : 0),
      })),
    };

    try {
      const response = await api.post('/public/orders', payload);
      const order = response.data.order;

      setOrderSummary({
        orderNumber: order.order_number,
        customerName: `${order.first_name} ${order.last_name}`,
        phone: order.phone,
        total: finalOrderTotal,
        deliveryDelay: selectedWilaya?.delay_days || '3-5 jours',
        payment:
          paymentMethod === 'cod'
            ? t('checkout.payment_cod_success')
            : 'BaridiMob / CCP',
      });
      clearCart();
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.message || t('checkout.alert_error');
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step < 4) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100">{t('checkout.cart_empty')}</h2>
        <p className="text-navy/60 dark:text-cream-100/60 mt-2">{t('checkout.empty_desc')}</p>
        <Link to="/catalogue" className="inline-block mt-6 text-gold font-bold uppercase hover:underline">
          {t('checkout.back_to_catalog')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-left w-full overflow-x-hidden">
      
      {/* Progress Tracker Bar */}
      {step < 4 && (
        <div className="flex items-center justify-center max-w-xl mx-auto mb-12 text-sm">
          <div className={`flex items-center ${step >= 1 ? 'text-gold' : 'text-navy/40 dark:text-cream-100/40'}`}>
            <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? 'border-gold bg-gold/10' : 'border-navy/20 bg-white dark:border-cream-100/20 dark:bg-navy-950'}`}>1</span>
            <span className="ml-2 font-medium hidden sm:inline">{t('checkout.step_address')}</span>
          </div>
          <ChevronRight className="h-4 w-4 mx-4 text-navy/30 dark:text-cream-100/30" />
          <div className={`flex items-center ${step >= 2 ? 'text-gold' : 'text-navy/40 dark:text-cream-100/40'}`}>
            <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? 'border-gold bg-gold/10' : 'border-navy/20 dark:border-cream-100/20'}`}>2</span>
            <span className="ml-2 font-medium hidden sm:inline">{t('checkout.step_shipping')}</span>
          </div>
          <ChevronRight className="h-4 w-4 mx-4 text-navy/30 dark:text-cream-100/30" />
          <div className={`flex items-center ${step >= 3 ? 'text-gold' : 'text-navy/40 dark:text-cream-100/40'}`}>
            <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 3 ? 'border-gold bg-gold/10' : 'border-navy/20 dark:border-cream-100/20'}`}>3</span>
            <span className="ml-2 font-medium hidden sm:inline">{t('checkout.step_payment')}</span>
          </div>
        </div>
      )}

      {step < 4 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Columns: Step Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Address Form */}
            {step === 1 && (
              <div className="border border-gold/15 p-6 rounded-lg bg-white dark:bg-navy-900 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100 mb-6 flex items-center gap-2 border-b border-gold/10 pb-3">
                  <MapPin className="h-6 w-6 text-gold" />
                  {t('checkout.shipping_address')}
                </h2>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-navy dark:text-cream-100/80 uppercase tracking-wider">{t('checkout.first_name')}</label>
                      <input
                        type="text"
                        required
                        value={addressData.first_name}
                        onChange={(e) => setAddressData({ ...addressData, first_name: e.target.value })}
                        className="w-full border border-gold/25 dark:border-gold/40 rounded px-3 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-950 text-navy dark:text-cream-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-navy dark:text-cream-100/80 uppercase tracking-wider">{t('checkout.last_name')}</label>
                      <input
                        type="text"
                        required
                        value={addressData.last_name}
                        onChange={(e) => setAddressData({ ...addressData, last_name: e.target.value })}
                        className="w-full border border-gold/25 dark:border-gold/40 rounded px-3 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-950 text-navy dark:text-cream-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy dark:text-cream-100/80 uppercase tracking-wider">{t('checkout.phone')}</label>
                    <input
                      type="tel"
                      required
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className="w-full border border-gold/25 dark:border-gold/40 rounded px-3 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-950 text-navy dark:text-cream-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy dark:text-cream-100/80 uppercase tracking-wider">{t('checkout.wilaya')}</label>
                    <select
                      required
                      value={addressData.wilaya_code}
                      onChange={(e) => setAddressData({ ...addressData, wilaya_code: e.target.value })}
                      className="w-full border border-gold/25 dark:border-gold/40 rounded px-3 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-950 text-navy dark:text-cream-100"
                    >
                      <option value="">{t('checkout.select_wilaya')}</option>
                      {wilayas.map((w) => (
                        <option key={w.wilaya_code} value={w.wilaya_code}>
                          {w.wilaya_code} - {w.wilaya_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy dark:text-cream-100/80 uppercase tracking-wider">{t('checkout.address')}</label>
                    <textarea
                      required
                      value={addressData.address}
                      onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                      rows="3"
                      className="w-full border border-gold/25 dark:border-gold/40 rounded px-3 py-2 text-sm outline-none focus:border-gold bg-white dark:bg-navy-950 text-navy dark:text-cream-100"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
                    <Link
                      to="/panier"
                      className="flex-1 h-12 border border-gold/30 hover:border-gold text-navy dark:text-cream-100 font-bold rounded transition-colors flex items-center justify-center gap-2 text-sm hover:bg-gold/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('checkout.back_to_cart')}
                    </Link>
                    <button
                      type="submit"
                      className="flex-1 h-12 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold font-bold rounded transition-gold flex items-center justify-center gap-2 uppercase text-sm cursor-pointer dark:hover:bg-navy-950"
                    >
                      {t('checkout.continue')}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Shipping Method Form */}
            {step === 2 && (
              <div className="border border-gold/15 p-6 rounded-lg bg-white dark:bg-navy-900 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100 mb-6 flex items-center gap-2 border-b border-gold/10 pb-3">
                  <Truck className="h-6 w-6 text-gold" />
                  {t('checkout.shipping_method')}
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Home delivery option */}
                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'home' ? 'border-gold bg-gold/5 dark:bg-gold/10 text-navy dark:text-cream-100' : 'border-gold/20 dark:border-gold/30 hover:border-gold/50 text-navy dark:text-cream-100'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'home'}
                          onChange={() => setShippingMethod('home')}
                          className="accent-gold h-4 w-4"
                        />
                        <div>
                          <p className="font-bold text-sm">{t('checkout.shipping_home')}</p>
                          <p className="text-xs text-navy/60 dark:text-cream-100/60">{t('checkout.estimated_delay', { delay: selectedWilaya?.delay_days || '3-5 jours' })}</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold">{selectedWilaya?.home_cost.toLocaleString()} DA</span>
                    </label>

                    {/* Point relais option */}
                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'relay' ? 'border-gold bg-gold/5 dark:bg-gold/10 text-navy dark:text-cream-100' : 'border-gold/20 dark:border-gold/30 hover:border-gold/50 text-navy dark:text-cream-100'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'relay'}
                          onChange={() => setShippingMethod('relay')}
                          className="accent-gold h-4 w-4"
                        />
                        <div>
                          <p className="font-bold text-sm">{t('checkout.shipping_relay')}</p>
                          <p className="text-xs text-navy/60 dark:text-cream-100/60">{t('checkout.estimated_delay', { delay: selectedWilaya?.delay_days || '3-5 jours' })}</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold">{selectedWilaya?.relay_cost.toLocaleString()} DA</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border border-gold/30 hover:border-gold text-navy dark:text-cream-100 font-bold rounded transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gold/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('checkout.back')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold font-bold rounded transition-gold flex items-center justify-center gap-2 uppercase text-sm cursor-pointer dark:hover:bg-navy-950"
                    >
                      {t('checkout.continue_payment')}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Payment Form */}
            {step === 3 && (
              <div className="border border-gold/15 p-6 rounded-lg bg-white dark:bg-navy-900 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-navy dark:text-cream-100 mb-6 flex items-center gap-2 border-b border-gold/10 pb-3">
                  <CreditCard className="h-6 w-6 text-gold" />
                  {t('checkout.payment_method')}
                </h2>
                
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <div className="space-y-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-gold bg-gold/5 dark:bg-gold/10 text-navy dark:text-cream-100' : 'border-gold/20 dark:border-gold/30 hover:border-gold/50 text-navy dark:text-cream-100'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-gold h-4 w-4 mr-3 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm">{t('checkout.payment_cod')}</p>
                        <p className="text-xs text-navy/60 dark:text-cream-100/60">{t('checkout.payment_cod_desc')}</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'baridimob' ? 'border-gold bg-gold/5 dark:bg-gold/10 text-navy dark:text-cream-100' : 'border-gold/20 dark:border-gold/30 hover:border-gold/50 text-navy dark:text-cream-100'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'baridimob'}
                        onChange={() => setPaymentMethod('baridimob')}
                        className="accent-gold h-4 w-4 mr-3 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm">{t('checkout.payment_baridimob')}</p>
                        <p className="text-xs text-navy/60 dark:text-cream-100/60">{t('checkout.payment_baridimob_desc')}</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 border border-gold/30 hover:border-gold text-navy dark:text-cream-100 font-bold rounded transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 hover:bg-gold/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('checkout.back')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold font-bold rounded transition-gold flex items-center justify-center gap-2 uppercase text-sm cursor-pointer disabled:opacity-50 dark:hover:bg-navy-950"
                    >
                      {loading ? (
                        <span>{t('checkout.processing')}</span>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          {t('checkout.confirm_order')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Right Column: Checkout Summary Panel */}
          <div className="border border-gold/25 dark:border-gold/40 rounded-lg p-6 bg-cream-100/30 dark:bg-navy-900/50 space-y-6 h-fit">
            <h2 className="text-xl font-serif font-bold text-navy dark:text-cream-100 border-b border-gold/15 pb-2">
              {t('checkout.order_details')}
            </h2>
            
            {/* Items summary list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => {
                const price = parseFloat(item.product.sale_price || item.product.price);
                const modifier = item.variant ? parseFloat(item.variant.price_modifier || 0) : 0;
                const totalUnitPrice = price + modifier;
                return (
                  <div key={item.id} className="flex gap-3 text-xs items-center">
                    <div className="h-12 w-12 rounded bg-white dark:bg-navy-950 overflow-hidden flex-shrink-0 border border-gold/10">
                      <img src={item.product.primary_image?.url || (item.product.images && item.product.images[0]?.url)} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-serif font-bold text-navy dark:text-cream-100 line-clamp-1">{item.product.name}</h4>
                      <p className="text-navy/60 dark:text-cream-100/60">{t('checkout.qty', { qty: item.quantity })}{item.variant && ` | T: ${item.variant.size}`}</p>
                    </div>
                    <span className="font-semibold text-navy dark:text-cream-100 font-serif">{(totalUnitPrice * item.quantity).toLocaleString()} DA</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations summary */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-navy dark:text-cream-100">Code promo</h3>
                {coupon ? (
                  <div className="flex items-center justify-between bg-gold/10 border border-gold/20 p-3 rounded">
                    <div>
                      <p className="text-xs text-navy/60">Coupon appliqué</p>
                      <p className="font-semibold text-navy">{coupon.code}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        setCouponSuccess(false);
                        setCouponError('');
                      }}
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
                      placeholder="Entrez le code promo"
                    />
                    <button
                      type="submit"
                      className="bg-navy text-cream px-4 py-2 rounded text-sm font-bold hover:bg-gold hover:text-navy border border-navy transition-colors cursor-pointer"
                    >
                      Appliquer
                    </button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-emerald-600">Code promo appliqué avec succès !</p>}
              </div>
            </div>

            <div className="border-t border-gold/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-navy/70 dark:text-cream-100/70">
                <span>{t('checkout.subtotal')}</span>
                <span className="font-serif font-bold text-navy dark:text-cream-100">{subtotal.toLocaleString()} DA</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>{t('checkout.promo_discount')}</span>
                  <span className="font-serif">- {discount.toLocaleString()} DA</span>
                </div>
              )}
              <div className="flex justify-between text-navy/70 dark:text-cream-100/70">
                <span>{t('checkout.shipping_cost')}</span>
                <span className="font-serif font-bold text-navy dark:text-cream-100">
                  {selectedWilaya ? `${shippingCost.toLocaleString()} DA` : t('checkout.wilaya_not_selected')}
                </span>
              </div>
              <div className="border-t border-gold/15 pt-3 flex justify-between items-baseline text-sm">
                <span className="font-bold text-navy dark:text-cream-100">{t('checkout.total')}</span>
                <span className="text-xl font-serif font-bold text-gold">
                  {finalOrderTotal.toLocaleString()} DA
                </span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Step 4: Success confirmation screen */
        <div className="max-w-2xl mx-auto border border-gold/25 dark:border-gold/45 rounded-lg bg-white dark:bg-navy-900 shadow-lg p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-full text-emerald-500 dark:text-emerald-400 mb-2">
            <Check className="h-8 w-8" />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-navy dark:text-cream-100">{t('checkout.success_title')}</h2>
          
          <p className="text-navy/70 dark:text-cream-100/70 leading-relaxed max-w-md mx-auto">
            {t('checkout.success_desc', { name: orderSummary?.customerName, number: orderSummary?.orderNumber, phone: orderSummary?.phone })}
          </p>

          <div className="bg-cream-100/30 dark:bg-navy-950/40 rounded border border-gold/15 p-6 text-left max-w-md mx-auto space-y-2 text-sm text-navy-950/80 dark:text-cream-100/80">
            <div className="flex justify-between"><span className="text-navy/60 dark:text-cream-100/60">{t('checkout.payment_label')}</span><strong className="text-navy dark:text-cream-100">{orderSummary?.payment}</strong></div>
            <div className="flex justify-between"><span className="text-navy/60 dark:text-cream-100/60">{t('checkout.delivery_label')}</span><strong className="text-navy dark:text-cream-100">{orderSummary?.deliveryDelay}</strong></div>
            <div className="flex justify-between border-t border-gold/10 pt-2 font-bold text-base"><span className="text-navy dark:text-cream-100">{t('checkout.amount_paid_label')}</span><span className="text-gold font-serif">{orderSummary?.total.toLocaleString()} DA</span></div>
          </div>

          <div className="pt-6">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-gold hover:bg-navy text-navy hover:text-gold border border-gold font-bold py-3 px-8 rounded-full transition-gold text-sm tracking-wider uppercase cursor-pointer dark:hover:bg-navy-950"
            >
              {t('checkout.continue_shopping')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
