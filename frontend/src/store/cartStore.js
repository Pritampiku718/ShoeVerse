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
        console.log("Product:", {
          id: product._id,
          name: product.name,
          totalStock: product.totalStock,
          stock: product.stock
        });

        //PRICE EXTRACTION
        const productPrice = Number(product.sellPrice || product.price || 0);
        const productOriginalPrice = Number(product.currentPrice || product.originalPrice || 0);
        
        console.log("Price:", productPrice);

        //STOCK EXTRACTION
        let productStock = 0;
        
        //Use totalStock
        if (product.totalStock !== undefined && product.totalStock !== null) {
          productStock = Number(product.totalStock);
          console.log("📦 Using totalStock:", productStock);
        }
        //Sum stock map
        else if (product.stock) {
          try {
            if (typeof product.stock === 'object') {
              if (product.stock instanceof Map) {
                for (let value of product.stock.values()) {
                  productStock += Number(value) || 0;
                }
              } 
              else {
                productStock = Object.values(product.stock).reduce(
                  (sum, val) => sum + (Number(val) || 0), 0
                );
              }
              console.log("Summed stock:", productStock);
            }
          } catch (e) {
            console.log("Error summing stock:", e);
          }
        }

        // Ensure valid number
        if (isNaN(productStock) || productStock < 0) productStock = 0;

        console.log("FINAL STOCK:", productStock);

        // Check existing item
        const existingItem = get().items.find(
          item => item._id === product._id && 
                 item.selectedSize === size && 
                 item.selectedColor === color
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > productStock) {
            toast.error(`Only ${productStock} items available`);
            return;
          }
          
          set({
            items: get().items.map(item =>
              item._id === product._id && 
              item.selectedSize === size && 
              item.selectedColor === color
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          toast.success('Quantity updated!');
        } else {
          if (quantity > productStock) {
            toast.error(`Only ${productStock} items available`);
            return;
          }

          // Get image
          const imageUrl = product.images?.[0]?.url || 
                          product.images?.[0] || 
                          product.image || 
                          "https://via.placeholder.com/128";

          const cartItem = {
            _id: product._id,
            name: product.name || "Product",
            brand: product.brand || "Premium Brand",
            price: productPrice,
            originalPrice: productOriginalPrice,
            image: imageUrl,
            images: product.images || [],
            stock: productStock,
            quantity,
            selectedSize: size,
            selectedColor: color,
          };

          set({ items: [...get().items, cartItem] });
          toast.success('Added to cart!');
        }

        get().openCart();
      },

      // Remove from cart
      removeFromCart: (id, size, color) => {
        set({
          items: get().items.filter(
            item => !(item._id === id && 
                     item.selectedSize === size && 
                     item.selectedColor === color)
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
        
        const item = get().items.find(
          item => item._id === id && 
                 item.selectedSize === size && 
                 item.selectedColor === color
        );
        
        if (item && quantity > item.stock) {
          toast.error(`Only ${item.stock} items available`);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item._id === id && 
            item.selectedSize === size && 
            item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },

      // Cart drawer controls
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Cart calculations
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = Number(item.price) || 0;
          const qty = Number(item.quantity) || 1;
          return total + (price * qty);
        }, 0);
      },

      getSubtotal: () => get().getTotalPrice(),
      getTax: () => get().getSubtotal() * 0.1,
      getShipping: () => get().getSubtotal() > 100 ? 0 : 10,
      getGrandTotal: () => get().getSubtotal() + get().getTax() + get().getShipping(),

      getItemCount: (id, size, color) => {
        const item = get().items.find(
          item => item._id === id && 
                 item.selectedSize === size && 
                 item.selectedColor === color
        );
        return item ? item.quantity : 0;
      },

      isInCart: (id, size, color) => {
        return get().items.some(
          item => item._id === id && 
                 item.selectedSize === size && 
                 item.selectedColor === color
        );
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);