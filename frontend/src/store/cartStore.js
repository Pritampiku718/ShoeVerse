import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Add to cart
      addToCart: (product, quantity = 1, size = null, color = null) => {
        const existingItem = get().items.find(
          item => item._id === product._id && item.size === size && item.color === color
        );

        if (existingItem) {
          set({
            items: get().items.map(item =>
              item._id === product._id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                ...product,
                quantity,
                selectedSize: size,
                selectedColor: color,
              },
            ],
          });
        }
        
        toast.success('Added to cart!');
        get().openCart();
      },

      // Remove from cart
      removeFromCart: (id, size, color) => {
        set({
          items: get().items.filter(
            item => !(item._id === id && item.selectedSize === size && item.selectedColor === color)
          ),
        });
        toast.success('Removed from cart');
      },

      // Update quantity
      updateQuantity: (id, size, color, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(id, size, color);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item._id === id && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Cart drawer controls
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Cart calculations
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getSubtotal: () => {
        return get().getTotalPrice();
      },

      getTax: () => {
        return get().getSubtotal() * 0.1; // 10% tax
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 100 ? 0 : 10; // Free shipping over $100
      },

      getGrandTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping();
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);