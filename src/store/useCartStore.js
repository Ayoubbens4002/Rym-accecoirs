import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of { id: string, product: Object, variant: Object, quantity: number }
      coupon: null, // Applied coupon: { code: string, type: 'fixed'|'percent', value: number }

      addItem: (product, variant = null, quantity = 1) => {
        const items = get().items;
        const itemId = variant ? `${product.id}-${variant.id}` : `${product.id}`;
        
        const existingItemIndex = items.findIndex((item) => item.id === itemId);
        
        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { id: itemId, product, variant, quantity }] });
        }
      },

      removeItem: (itemId) => {
        const updatedItems = get().items.filter((item) => item.id !== itemId);
        set({ items: updatedItems });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const updatedItems = get().items.map((item) => 
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      // Helper selectors
      getCartTotal: () => {
        const items = get().items;
        const subtotal = items.reduce((acc, item) => {
          const price = item.product.sale_price || item.product.price;
          const modifier = item.variant ? parseFloat(item.variant.price_modifier || 0) : 0;
          return acc + (parseFloat(price) + modifier) * item.quantity;
        }, 0);

        const coupon = get().coupon;
        let discount = 0;
        if (coupon) {
          if (coupon.type === 'percent') {
            discount = (subtotal * parseFloat(coupon.value)) / 100;
          } else {
            discount = parseFloat(coupon.value);
          }
        }

        const total = Math.max(0, subtotal - discount);
        return {
          subtotal,
          discount,
          total,
          itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
        };
      },
    }),
    {
      name: 'sr-cart-storage', // Key name in localStorage
    }
  )
);
