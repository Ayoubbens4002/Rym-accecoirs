import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      hasItem: (productId) => get().items.some((item) => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'sr-wishlist-storage' }
  )
);
