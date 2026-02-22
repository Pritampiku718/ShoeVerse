import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiShoppingBag, 
  FiTrash2, 
  FiHeart, 
  FiArrowRight,
  FiTag,
  FiPercent,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiPlus,
  FiMinus
} from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from 'react-hot-toast';

const CartDrawer = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal,
    getTax,
    getShipping,
    getGrandTotal,
    getTotalItems 
  } = useCartStore();
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FiShoppingBag className="text-white text-2xl" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-primary-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <FiX className="text-white text-xl group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              
              {/* Free Shipping Progress */}
              {subtotal < 100 && (
                <div className="mt-3 bg-white/20 rounded-full p-1">
                  <div className="bg-white rounded-full px-3 py-1 text-xs text-primary-600 font-medium">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <FiShoppingBag className="text-5xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
                      Looks like you haven't added anything to your cart yet
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item, index) => (
                    <motion.div
                      key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Product Image and Details */}
                      <div className="flex gap-4 p-4">
                        {/* Image */}
                        <Link 
                          to={`/product/${item._id}`} 
                          onClick={closeCart}
                          className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 group/image"
                        >
                          <img
                            src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item._id}`} 
                            onClick={closeCart}
                            className="block hover:text-primary-600 transition-colors"
                          >
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                              {item.name}
                            </h4>
                          </Link>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {item.brand}
                          </p>

                          {/* Selected Options */}
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex items-center gap-2 mb-2 text-xs">
                              {item.selectedSize && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full flex items-center gap-1">
                                  <span 
                                    className="w-3 h-3 rounded-full border border-gray-300" 
                                    style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                                  />
                                  {item.selectedColor}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="ml-2 text-xs text-gray-400 line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedColor)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus size={14} className={item.quantity <= 1 ? 'opacity-50' : ''} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex border-t border-gray-100 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">
                        <button
                          onClick={() => handleWishlistToggle(item)}
                          className="flex-1 py-2 text-xs text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiHeart className={isInWishlist(item._id) ? 'fill-pink-500 text-pink-500' : ''} size={14} />
                          <span>{isInWishlist(item._id) ? 'Saved' : 'Save for later'}</span>
                        </button>
                        <button
                          onClick={() => {
                            removeFromCart(item._id, item.selectedSize, item.selectedColor);
                            toast.success('Removed from cart');
                          }}
                          className="flex-1 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiTrash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                    <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">${shipping.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                    <span className="text-gray-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {subtotal < 100 && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                      <FiTruck size={14} />
                      <span>Add ${(100 - subtotal).toFixed(2)} more for free shipping</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-primary-600">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <FiCreditCard size={18} />
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Secure checkout powered by</span>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">VISA</span>
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">MC</span>
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">AMEX</span>
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">PP</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiShield className="text-green-500" size={12} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiTruck className="text-blue-500" size={12} />
                    <span>Free Shipping $100+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiPercent className="text-purple-500" size={12} />
                    <span>Best Prices</span>
                  </div>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;