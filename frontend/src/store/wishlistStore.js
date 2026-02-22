import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const exists = get().items.some(item => item._id === product._id);
        if (!exists) {
          set({ items: [...get().items, product] });
          toast.success('Added to wishlist');
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
        toast.success('Removed from wishlist');
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'wishlist-storage',
      getStorage: () => localStorage
    }
  )
);