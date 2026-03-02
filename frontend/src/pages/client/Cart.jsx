import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
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
  FiClock,
  FiGift,
  FiStar,
  FiChevronRight,
  FiAlertCircle,
  FiRefreshCw,
  FiLock,
  FiAward,
  FiZap,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [savingItems, setSavingItems] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [removingItems, setRemovingItems] = useState([]);

  // Clear all toasts when component unmounts
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  //log cart items
  useEffect(() => {
    console.log("Cart items:", items);
  }, [items]);

  // Calculate delivery date
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(
      today.getDate() + (shippingMethod === "express" ? 3 : 7),
    );
    setEstimatedDelivery(deliveryDate);
  }, [shippingMethod]);

  // Calculate prices
  const totalItems = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return total + price * qty;
  }, 0);

  const tax = subtotal * 0.1;
  const baseShipping = subtotal > 100 ? 0 : 10;
  const shipping = shippingMethod === "express" ? 15 : baseShipping;
  const discount = promoApplied ? subtotal * 0.1 : promoDiscount || 0;
  const grandTotal = subtotal + tax + shipping - discount;

  // Calculate savings
  const totalOriginalPrice = items.reduce((total, item) => {
    const originalPrice = Number(item.originalPrice) || 0;
    const currentPrice = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    if (originalPrice > currentPrice) {
      return total + (originalPrice - currentPrice) * qty;
    }
    return total;
  }, 0);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        items.map(
          (item) => `${item._id}-${item.selectedSize}-${item.selectedColor}`,
        ),
      );
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, itemId]);
      if (selectedItems.length + 1 === items.length) {
        setSelectAll(true);
      }
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.1);
      toast.success("Promo code applied! 10% discount");
    } else if (promoCode.toUpperCase() === "FREESHIP") {
      setShippingMethod("free");
      toast.success("Free shipping applied!");
    } else if (promoCode.toUpperCase() === "WELCOME20") {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.2);
      toast.success("Promo code applied! 20% discount");
    } else if (promoCode.toUpperCase() === "VIP25") {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.25);
      toast.success("VIP discount applied! 25% off");
    } else {
      toast.error("Invalid promo code");
    }
    setPromoCode("");
  };

  const handleMoveToWishlist = (item) => {
    if (isInWishlist(item._id)) {
      removeFromWishlist(item._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(item);
      toast.success("Added to wishlist");
    }
  };

  const handleSaveForLater = (item) => {
    setSavingItems((prev) => ({ ...prev, [item._id]: true }));
    handleMoveToWishlist(item);
    setTimeout(() => {
      removeFromCart(item._id, item.selectedSize, item.selectedColor);
      setSavingItems((prev) => ({ ...prev, [item._id]: false }));
    }, 500);
  };

  const handleRemoveSelected = () => {
    
    // Add all selected items to removing state
    setRemovingItems(selectedItems);

    // Remove them after a short delay
    setTimeout(() => {
      selectedItems.forEach((itemId) => {
        const [id, size, color] = itemId.split("-");
        removeFromCart(id, size, color);
      });
      setSelectedItems([]);
      setSelectAll(false);
      setRemovingItems([]);
    }, 300);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=checkout");
      toast.error("Please login to checkout");
    } else {
      navigate("/checkout");
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      const itemId = `${itemToDelete._id}-${itemToDelete.selectedSize}-${itemToDelete.selectedColor}`;
      setRemovingItems([itemId]);

      setTimeout(() => {
        removeFromCart(
          itemToDelete._id,
          itemToDelete.selectedSize,
          itemToDelete.selectedColor,
        );
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setRemovingItems([]);
      }, 300);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - ShoeVerse</title>
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full flex items-center justify-center">
                  <FiShoppingBag className="text-4xl sm:text-5xl md:text-6xl text-primary-600 dark:text-primary-400" />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-xl"
                >
                  🛒
                </motion.div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
                Your Cart is Empty
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
                Looks like you haven't added anything to your cart yet
              </p>

              <div className="space-y-3 sm:space-y-4 px-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group text-sm sm:text-base"
                >
                  <FiShoppingBag size={16} />
                  <span>Start Shopping</span>
                  <FiArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </Link>

                <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    to="/new-arrivals"
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3"
                  >
                    New Arrivals
                  </Link>
                  <span className="hidden xs:inline text-gray-300 dark:text-gray-600">
                    •
                  </span>
                  <Link
                    to="/sale"
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3"
                  >
                    Sale
                  </Link>
                  <span className="hidden xs:inline text-gray-300 dark:text-gray-600">
                    •
                  </span>
                  <Link
                    to="/wishlist"
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3"
                  >
                    Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${totalItems} items) - ShoeVerse`}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Savings Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Shopping Cart
                </h1>
                <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-primary-600 to-accent text-white text-xs sm:text-sm font-semibold rounded-full">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </div>
                {totalOriginalPrice > 0 && (
                  <div className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full flex items-center gap-1">
                    <FiDollarSign size={12} />
                    <span>Save ${totalOriginalPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Review your items and proceed to checkout
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group text-sm"
            >
              <FiShoppingBag size={18} />
              <span>Continue Shopping</span>
              <FiArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={16}
              />
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              
              {/* Cart Header with Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select All ({items.length})
                      </span>
                    </label>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleRemoveSelected}
                        className="flex items-center gap-1 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        <FiTrash2 size={14} />
                        <span>Remove ({selectedItems.length})</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-px h-3 sm:h-4 bg-gray-300 dark:bg-gray-600" />
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {totalItems}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items with Design */}
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  const itemId = `${item._id}-${item.selectedSize}-${item.selectedColor}`;
                  const isSelected = selectedItems.includes(itemId);
                  const isSaving = savingItems[item._id];
                  const inWishlist = isInWishlist(item._id);
                  const isRemoving = removingItems.includes(itemId);

                  const itemPrice = Number(item.price) || 0;
                  const originalPrice = Number(item.originalPrice) || 0;
                  const quantity = Number(item.quantity) || 1;
                  const totalPrice = itemPrice * quantity;
                  const totalOriginalPrice = originalPrice * quantity;
                  const discountPercentage =
                    originalPrice > itemPrice
                      ? Math.round(
                          ((originalPrice - itemPrice) / originalPrice) * 100,
                        )
                      : 0;

                  const imageUrl =
                    item.images && item.images.length > 0
                      ? item.images[0].url || item.images[0]
                      : item.image || "https://via.placeholder.com/128";

                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isRemoving ? 0 : 1,
                        x: isRemoving ? -100 : 0,
                        scale: isRemoving ? 0.8 : 1,
                      }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredItem(itemId)}
                      onHoverEnd={() => setHoveredItem(null)}
                      className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                        isSelected
                          ? "ring-1 sm:ring-2 ring-primary-500 border-transparent"
                          : "border-gray-100 dark:border-gray-700"
                      } ${hoveredItem === itemId ? "shadow-2xl scale-[1.01] sm:scale-[1.02]" : ""}`}
                    >
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-6">
                          
                          {/* Checkbox */}
                          <div className="flex items-start pt-1 sm:pt-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectItem(itemId)}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              disabled={isRemoving}
                            />
                          </div>

                          {/* Product Image with Badge */}
                          <Link
                            to={`/product/${item._id}`}
                            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 group/image relative"
                            onClick={(e) => isRemoving && e.preventDefault()}
                          >
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/128";
                              }}
                            />
                            {discountPercentage > 0 && (
                              <span className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] sm:text-xs font-bold rounded-full shadow-lg">
                                -{discountPercentage}%
                              </span>
                            )}
                            {hoveredItem === itemId && !isRemoving && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                <span className="bg-white/90 text-gray-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium">
                                  Quick View
                                </span>
                              </div>
                            )}
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-2 sm:gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                  <Link
                                    to={`/product/${item._id}`}
                                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    onClick={(e) =>
                                      isRemoving && e.preventDefault()
                                    }
                                  >
                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                                      {item.name}
                                    </h3>
                                  </Link>
                                  {inWishlist && (
                                    <span className="px-1.5 sm:px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-[8px] sm:text-xs font-medium rounded-full whitespace-nowrap">
                                      Wishlist
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                                  {item.brand}
                                </p>

                                {/* Selected Options with Tags */}
                                {(item.selectedSize || item.selectedColor) && (
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                    {item.selectedSize && (
                                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs rounded-full shadow-sm">
                                        Size: {item.selectedSize}
                                      </span>
                                    )}
                                    {item.selectedColor && (
                                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs rounded-full shadow-sm flex items-center gap-1">
                                        <span
                                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm"
                                          style={{
                                            backgroundColor:
                                              typeof item.selectedColor ===
                                              "string"
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
                                <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3">
                                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 w-fit">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.selectedSize,
                                          item.selectedColor,
                                          quantity - 1,
                                        )
                                      }
                                      className="p-1.5 sm:p-2 md:p-3 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg sm:rounded-l-xl transition-colors text-gray-700 dark:text-gray-300"
                                      disabled={quantity <= 1 || isRemoving}
                                    >
                                      <FiMinus
                                        size={12}
                                        className={
                                          quantity <= 1 ? "opacity-50" : ""
                                        }
                                      />
                                    </button>
                                    <span className="w-8 sm:w-10 md:w-12 text-center text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                      {quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.selectedSize,
                                          item.selectedColor,
                                          quantity + 1,
                                        )
                                      }
                                      className="p-1.5 sm:p-2 md:p-3 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg sm:rounded-r-xl transition-colors text-gray-700 dark:text-gray-300"
                                      disabled={isRemoving}
                                    >
                                      <FiPlus size={12} />
                                    </button>
                                  </div>

                                  <div className="text-left xs:text-right">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                        ${totalPrice.toFixed(2)}
                                      </span>
                                      {originalPrice > 0 &&
                                        originalPrice > itemPrice && (
                                          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 line-through">
                                            ${totalOriginalPrice.toFixed(2)}
                                          </span>
                                        )}
                                    </div>
                                    {originalPrice > 0 &&
                                      originalPrice > itemPrice && (
                                        <p className="text-[8px] sm:text-xs text-green-600 dark:text-green-400 font-medium mt-0.5 sm:mt-1">
                                          Save $
                                          {(
                                            (originalPrice - itemPrice) *
                                            quantity
                                          ).toFixed(2)}
                                        </p>
                                      )}
                                  </div>
                                </div>

                                {/* Stock Status */}
                                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  <div
                                    className={`flex items-center gap-1 text-[8px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit ${
                                      item.stock < 10
                                        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                        : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                    }`}
                                  >
                                    <FiClock
                                      size={10}
                                      className={
                                        item.stock < 10 ? "animate-pulse" : ""
                                      }
                                    />
                                    <span className="font-medium whitespace-nowrap">
                                      {item.stock < 10
                                        ? `Only ${item.stock} left`
                                        : `${item.stock} in stock`}
                                    </span>
                                  </div>
                                  {item.stock < 3 && (
                                    <span className="text-[8px] sm:text-xs text-red-500 dark:text-red-400 font-medium animate-pulse">
                                      Almost gone!
                                    </span>
                                  )}
                                  {item.stock > 50 && (
                                    <span className="text-[8px] sm:text-xs text-green-500 dark:text-green-400 font-medium">
                                      ✓ Ready to ship
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            disabled={isSaving || isRemoving}
                            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all duration-300 disabled:opacity-50 group"
                          >
                            {isSaving ? (
                              <FiRefreshCw className="animate-spin" size={12} />
                            ) : (
                              <FiHeart
                                className={`transition-all group-hover:scale-110 ${
                                  inWishlist
                                    ? "fill-pink-500 text-pink-500"
                                    : ""
                                }`}
                                size={12}
                              />
                            )}
                            <span className="hidden xs:inline group-hover:translate-x-0.5 transition-transform">
                              {inWishlist ? "Saved" : "Save for later"}
                            </span>
                            <span className="xs:hidden">
                              {inWishlist ? "Saved" : "Save"}
                            </span>
                          </button>
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            disabled={isRemoving}
                            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all duration-300 group"
                          >
                            <FiHeart
                              size={12}
                              className="group-hover:scale-110 transition-transform"
                            />
                            <span className="hidden xs:inline group-hover:translate-x-0.5 transition-transform">
                              Move to wishlist
                            </span>
                            <span className="xs:hidden">Move</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            disabled={isRemoving}
                            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 ml-auto group"
                          >
                            <FiTrash2
                              size={12}
                              className="group-hover:scale-110 transition-transform"
                            />
                            <span className="hidden xs:inline group-hover:translate-x-0.5 transition-transform">
                              Remove
                            </span>
                            <span className="xs:hidden">Delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Continue Shopping Mobile */}
              <div className="sm:hidden text-center pt-2 sm:pt-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group text-sm"
                >
                  <FiShoppingBag size={16} />
                  <span>Continue Shopping</span>
                  <FiArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={14}
                  />
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 sm:top-6 md:top-8 lg:top-24 space-y-4 sm:space-y-5 md:space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-600/5 to-accent/5">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiShoppingBag className="text-primary-600" size={16} />
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-3.5 md:space-y-4">
                    {/* Price Breakdown */}
                    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <FiDollarSign
                            size={12}
                            className="text-gray-400 dark:text-gray-500"
                          />
                          Subtotal ({totalItems} items)
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <FiTruck
                            size={12}
                            className="text-gray-400 dark:text-gray-500"
                          />
                          Shipping
                        </span>
                        <div className="text-right">
                          {shipping === 0 ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                              <FiTruck size={12} />
                              Free
                            </span>
                          ) : (
                            <span className="text-gray-900 dark:text-white font-semibold">
                              ${shipping.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <FiPercent
                            size={12}
                            className="text-gray-400 dark:text-gray-500"
                          />
                          Tax (10%)
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          ${tax.toFixed(2)}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between items-center text-xs sm:text-sm text-green-600 dark:text-green-400">
                          <span className="flex items-center gap-1">
                            <FiTag size={12} />
                            Discount (10%)
                          </span>
                          <span className="font-semibold">
                            -${discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {totalOriginalPrice > 0 && (
                        <div className="flex justify-between items-center text-xs sm:text-sm text-green-600 dark:text-green-400 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                          <span className="flex items-center gap-1">
                            <FiAward size={12} />
                            Total Savings
                          </span>
                          <span className="font-bold">
                            -${totalOriginalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Promo Code */}
                    <div className="relative">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className="w-full pl-8 sm:pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <FiTag
                        className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        size={14}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                        className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-primary-600 to-accent text-white text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Promo Suggestions */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <span className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                        Try: SAVE10, WELCOME20, VIP25
                      </span>
                    </div>

                    {/* Shipping Options */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <FiTruck size={12} className="text-primary-600" />
                        Shipping Method
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <label
                          className={`flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${
                            shippingMethod === "standard"
                              ? "bg-gradient-to-r from-primary-600/10 to-accent/10 border-2 border-primary-500 shadow-lg"
                              : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="standard"
                              checked={shippingMethod === "standard"}
                              onChange={(e) =>
                                setShippingMethod(e.target.value)
                              }
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                                Standard
                              </p>
                              <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                                7-10 days
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">
                            {baseShipping === 0
                              ? "FREE"
                              : `$${baseShipping.toFixed(2)}`}
                          </span>
                        </label>
                        <label
                          className={`flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${
                            shippingMethod === "express"
                              ? "bg-gradient-to-r from-primary-600/10 to-accent/10 border-2 border-primary-500 shadow-lg"
                              : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="express"
                              checked={shippingMethod === "express"}
                              onChange={(e) =>
                                setShippingMethod(e.target.value)
                              }
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                                Express
                              </p>
                              <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                                3-5 days
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">
                            $15.00
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Delivery Estimate Date*/}
                    {estimatedDelivery && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl">
                        <FiTruck
                          className="text-blue-500 flex-shrink-0 animate-bounce"
                          size={14}
                        />
                        <span className="truncate">
                          Delivery by{" "}
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {estimatedDelivery.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Free Shipping Progress */}
                    {subtotal < 100 && (
                      <div className="space-y-1 sm:space-y-1.5">
                        <div className="flex justify-between text-[10px] sm:text-xs">
                          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <FiTrendingUp
                              size={12}
                              className="text-primary-600"
                            />
                            Free Shipping Progress
                          </span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            ${(100 - subtotal).toFixed(2)} left
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (subtotal / 100) * 100)}%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary-600 to-accent rounded-full relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 sm:pt-3.5 md:pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent">
                            ${grandTotal.toFixed(2)}
                          </span>
                          <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                            incl. ${tax.toFixed(2)} tax
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <FiLock size={16} />
                      <span>Secure Checkout</span>
                      <FiArrowRight
                        className="group-hover:translate-x-2 transition-transform"
                        size={16}
                      />
                    </button>

                    {/* Payment Methods */}
                    <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                      <span>Secure payment</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs font-medium text-gray-900 dark:text-white">
                          VISA
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs font-medium text-gray-900 dark:text-white">
                          MC
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs font-medium text-gray-900 dark:text-white">
                          AMEX
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs font-medium text-gray-900 dark:text-white">
                          PP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="text-center group">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                        <FiShield className="text-green-600" size={14} />
                      </div>
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        Secure Payment
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        256-bit SSL
                      </p>
                    </div>
                    <div className="text-center group">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                        <FiRefreshCw className="text-blue-600" size={14} />
                      </div>
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        30-Day Returns
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        Hassle-free
                      </p>
                    </div>
                    <div className="text-center group">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                        <FiGift className="text-purple-600" size={14} />
                      </div>
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        Gift Wrapping
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        Available
                      </p>
                    </div>
                    <div className="text-center group">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                        <FiAward className="text-yellow-600" size={14} />
                      </div>
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        Best Prices
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        Price match
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clear Cart Button */}
                <button
                  onClick={() => {
                    if (items.length > 0) {
                      if (
                        window.confirm(
                          "Are you sure you want to clear your cart?",
                        )
                      ) {
                        clearCart();
                        toast.success("Cart cleared");
                      }
                    }
                  }}
                  className="w-full py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <FiTrash2
                    size={12}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Clear Cart
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && itemToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-5 md:p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <FiAlertCircle className="text-red-600 text-xl sm:text-2xl md:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Remove Item
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 px-2">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {itemToDelete.name}
                  </span>{" "}
                  from your cart?
                </p>
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg sm:rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
