import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FiMinus,
} from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { toast } from "react-hot-toast";

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
    getTotalItems,
  } = useCartStore();

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // log cart items to see image structure
  useEffect(() => {
    if (items.length > 0) {
    }
  }, [items]);

  // Helper function to get image URL safely
  const getImageUrl = (item) => {
    
    // Try different possible image locations
    if (item.images && item.images.length > 0) {
      const firstImage = item.images[0];
      if (typeof firstImage === "string") return firstImage;
      if (firstImage.url) return firstImage.url;
      if (firstImage.src) return firstImage.src;
    }
    if (item.image) return item.image;
    if (item.imageUrl) return item.imageUrl;
    if (item.img) return item.img;
    if (item.thumbnail) return item.thumbnail;

    // Default placeholder
    return "https://via.placeholder.com/80";
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
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
            className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[440px] lg:w-[480px] max-w-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <FiShoppingBag className="text-white text-xl sm:text-2xl" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-primary-700 text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-lg border border-primary-200">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Your Cart
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors group"
                  aria-label="Close cart"
                >
                  <FiX className="text-white text-lg sm:text-xl group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Free Shipping Progress */}
              {subtotal < 100 && (
                <div className="mt-2 sm:mt-3 bg-white/30 dark:bg-white/20 rounded-full p-0.5">
                  <div className="bg-white dark:bg-gray-800 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-primary-700 dark:text-primary-400 font-medium truncate border border-primary-200 dark:border-primary-800">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center h-full text-center px-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 sm:mb-6 border-2 border-gray-300 dark:border-gray-600">
                      <FiShoppingBag className="text-3xl sm:text-4xl md:text-5xl text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 max-w-xs">
                      Looks like you haven't added anything to your cart yet
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-xl transform hover:-translate-y-0.5 transition-all border border-primary-400"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item, index) => {
                    const imageUrl = getImageUrl(item);

                    return (
                      <motion.div
                        key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        {/* Product Image and Details */}
                        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                          
                          {/* Image */}
                          <Link
                            to={`/product/${item._id}`}
                            onClick={closeCart}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 group/image border border-gray-300 dark:border-gray-600"
                          >
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                console.log("Image failed to load:", imageUrl);
                                e.target.src = "https://via.placeholder.com/80";
                              }}
                              loading="lazy"
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item._id}`}
                              onClick={closeCart}
                              className="block hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                {item.name}
                              </h4>
                            </Link>

                            <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                              {item.brand}
                            </p>

                            {/* Selected Options */}
                            {(item.selectedSize || item.selectedColor) && (
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs">
                                {item.selectedSize && (
                                  <span className="px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-600">
                                    Size: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedColor && (
                                  <span className="px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full flex items-center gap-1 border border-gray-300 dark:border-gray-600">
                                    <span
                                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-gray-400 dark:border-gray-500"
                                      style={{
                                        backgroundColor:
                                          typeof item.selectedColor === "string"
                                            ? item.selectedColor.toLowerCase()
                                            : "#cccccc",
                                      }}
                                    />
                                    <span className="truncate max-w-[60px] sm:max-w-none">
                                      {item.selectedColor}
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                              <div className="flex items-center flex-wrap">
                                <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                                  $
                                  {(
                                    (item.price || 0) * (item.quantity || 1)
                                  ).toFixed(2)}
                                </span>
                                {item.originalPrice &&
                                  item.originalPrice > item.price && (
                                    <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 line-through">
                                      $
                                      {(
                                        (item.originalPrice || 0) *
                                        (item.quantity || 1)
                                      ).toFixed(2)}
                                    </span>
                                  )}
                              </div>

                              <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg self-start xs:self-auto bg-white dark:bg-gray-700">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item._id,
                                      item.selectedSize,
                                      item.selectedColor,
                                      Math.max(1, (item.quantity || 1) - 1),
                                    )
                                  }
                                  className="p-1 sm:p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg transition-colors text-gray-700 dark:text-gray-300"
                                  disabled={(item.quantity || 1) <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <FiMinus
                                    size={12}
                                    className={
                                      (item.quantity || 1) <= 1
                                        ? "opacity-50"
                                        : ""
                                    }
                                  />
                                </button>
                                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                  {item.quantity || 1}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item._id,
                                      item.selectedSize,
                                      item.selectedColor,
                                      (item.quantity || 1) + 1,
                                    )
                                  }
                                  className="p-1 sm:p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg transition-colors text-gray-700 dark:text-gray-300"
                                  aria-label="Increase quantity"
                                >
                                  <FiPlus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex border-t border-gray-200 dark:border-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
                          <button
                            onClick={() => handleWishlistToggle(item)}
                            className="flex-1 py-2 sm:py-2.5 text-[10px] sm:text-xs font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 dark:text-gray-300 dark:hover:text-pink-400 transition-colors flex items-center justify-center gap-1"
                          >
                            <FiHeart
                              className={
                                isInWishlist(item._id)
                                  ? "fill-pink-600 text-pink-600 dark:fill-pink-400 dark:text-pink-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                              size={12}
                            />
                            <span className="hidden xs:inline">
                              {isInWishlist(item._id)
                                ? "Saved"
                                : "Save for later"}
                            </span>
                            <span className="xs:hidden">
                              {isInWishlist(item._id) ? "Saved" : "Save"}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              removeFromCart(
                                item._id,
                                item.selectedSize,
                                item.selectedColor,
                              );
                              toast.success("Removed from cart");
                            }}
                            className="flex-1 py-2 sm:py-2.5 text-[10px] sm:text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors flex items-center justify-center gap-1"
                          >
                            <FiTrash2 size={12} />
                            <span className="hidden xs:inline">Remove</span>
                            <span className="xs:hidden">Del</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80 p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Shipping
                    </span>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          Free
                        </span>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-bold">
                          ${shipping.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Tax (10%)
                    </span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  {subtotal < 100 && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 p-1.5 sm:p-2 rounded-lg border border-amber-300 dark:border-amber-700">
                      <FiTruck size={12} className="flex-shrink-0" />
                      <span className="truncate">
                        Add ${(100 - subtotal).toFixed(2)} more for free
                        shipping
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                    <div className="flex justify-between text-sm sm:text-base font-extrabold">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-primary-700 dark:text-primary-400">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full pl-8 sm:pl-10 pr-16 sm:pr-20 py-2.5 sm:py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <FiTag
                    className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={14}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group border border-primary-400 dark:border-primary-600"
                >
                  <FiCreditCard size={16} />
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Payment Methods */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span className="hidden xs:inline">
                    Secure checkout powered by
                  </span>
                  <span className="xs:hidden">Powered by</span>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 sm:px-2 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded border border-gray-400 dark:border-gray-600">
                      VISA
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded border border-gray-400 dark:border-gray-600">
                      MC
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded border border-gray-400 dark:border-gray-600">
                      AMEX
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded border border-gray-400 dark:border-gray-600">
                      PP
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <FiShield
                      className="text-green-600 dark:text-green-400"
                      size={10}
                    />
                    <span className="hidden xs:inline">Secure Payment</span>
                    <span className="xs:hidden">Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiTruck
                      className="text-blue-600 dark:text-blue-400"
                      size={10}
                    />
                    <span className="hidden xs:inline">
                      Free Shipping $100+
                    </span>
                    <span className="xs:hidden">Free $100+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiPercent
                      className="text-purple-600 dark:text-purple-400"
                      size={10}
                    />
                    <span className="hidden xs:inline">Best Prices</span>
                    <span className="xs:hidden">Best Price</span>
                  </div>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors py-1"
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
