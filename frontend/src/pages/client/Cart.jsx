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
} from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getShipping,
    getGrandTotal,
    getTotalItems,
  } = useCartStore();

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

  // Mock recommended products
  const recommendedProducts = [
    {
      id: 101,
      name: "Nike Air Max 270",
      brand: "Nike",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 4.8,
      badge: "Bestseller",
    },
    {
      id: 102,
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
      badge: "Trending",
    },
    {
      id: 103,
      name: "Jordan Retro 4",
      brand: "Jordan",
      price: 210,
      image:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      badge: "Limited",
    },
    {
      id: 104,
      name: "New Balance 990v5",
      brand: "New Balance",
      price: 175,
      image:
        "https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 4.7,
      badge: "Classic",
    },
  ];

  // Calculate delivery date
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(
      today.getDate() + (shippingMethod === "express" ? 3 : 7),
    );
    setEstimatedDelivery(deliveryDate);
  }, [shippingMethod]);

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = shippingMethod === "express" ? 15 : getShipping();
  const discount = promoApplied ? subtotal * 0.1 : promoDiscount;
  const grandTotal = subtotal + tax + shipping - discount;
  const totalItems = getTotalItems();

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
    selectedItems.forEach((itemId) => {
      const [id, size, color] = itemId.split("-");
      removeFromCart(id, size, color);
    });
    setSelectedItems([]);
    setSelectAll(false);
    toast.success(`${selectedItems.length} items removed`);
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
      removeFromCart(
        itemToDelete._id,
        itemToDelete.selectedSize,
        itemToDelete.selectedColor,
      );
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      toast.success("Item removed from cart");
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - ShoeVerse</title>
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="relative mb-8">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full flex items-center justify-center">
                  <FiShoppingBag className="text-6xl text-primary-600 dark:text-primary-400" />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl"
                >
                  🛒
                </motion.div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Your Cart is Empty
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Looks like you haven't added anything to your cart yet
              </p>

              <div className="space-y-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <FiShoppingBag size={20} />
                  Start Shopping
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    to="/new-arrivals"
                    className="hover:text-primary-600 transition-colors"
                  >
                    New Arrivals
                  </Link>
                  <span>•</span>
                  <Link
                    to="/sale"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Sale
                  </Link>
                  <span>•</span>
                  <Link
                    to="/wishlist"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Wishlist
                  </Link>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-center gap-2">
                  <FiStar className="text-yellow-400" />
                  You Might Also Like
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-primary-600 to-accent text-white text-xs font-bold rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <FiStar className="text-yellow-400 fill-current text-xs" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-primary-600">
                        ${product.price}
                      </p>
                    </Link>
                  ))}
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Shopping Cart
                </h1>
                <div className="px-3 py-1 bg-gradient-to-r from-primary-600 to-accent text-white text-sm font-semibold rounded-full">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Review your items and proceed to checkout
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group"
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select All ({items.length})
                      </span>
                    </label>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleRemoveSelected}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 size={16} />
                        <span>Remove Selected ({selectedItems.length})</span>
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {totalItems}
                    </span>{" "}
                    items total
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  const itemId = `${item._id}-${item.selectedSize}-${item.selectedColor}`;
                  const isSelected = selectedItems.includes(itemId);
                  const isSaving = savingItems[item._id];
                  const inWishlist = isInWishlist(item._id);

                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredItem(itemId)}
                      onHoverEnd={() => setHoveredItem(null)}
                      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        isSelected ? "ring-2 ring-primary-500" : ""
                      } ${hoveredItem === itemId ? "shadow-2xl" : ""}`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Checkbox */}
                          <div className="flex items-start pt-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectItem(itemId)}
                              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </div>

                          {/* Product Image */}
                          <Link
                            to={`/product/${item._id}`}
                            className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 group/image relative"
                          >
                            <img
                              src={
                                item.images?.[0]?.url ||
                                item.image ||
                                "https://via.placeholder.com/128"
                              }
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700"
                            />
                            {item.discount > 0 && (
                              <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                -{item.discount}%
                              </span>
                            )}
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <Link
                                  to={`/product/${item._id}`}
                                  className="inline-block hover:text-primary-600 transition-colors"
                                >
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {item.name}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                  {item.brand}
                                </p>

                                {/* Selected Options */}
                                {(item.selectedSize || item.selectedColor) && (
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {item.selectedSize && (
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                        Size: {item.selectedSize}
                                      </span>
                                    )}
                                    {item.selectedColor && (
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full flex items-center gap-1">
                                        <span
                                          className="w-3 h-3 rounded-full border border-gray-300"
                                          style={{
                                            backgroundColor:
                                              item.selectedColor.toLowerCase(),
                                          }}
                                        />
                                        {item.selectedColor}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Price and Quantity */}
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          Math.max(1, item.quantity - 1),
                                          item.selectedSize,
                                          item.selectedColor,
                                        )
                                      }
                                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-xl transition-colors"
                                      disabled={item.quantity <= 1}
                                    >
                                      <FiMinus
                                        size={14}
                                        className={
                                          item.quantity <= 1 ? "opacity-50" : ""
                                        }
                                      />
                                    </button>
                                    <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-white">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.quantity + 1,
                                          item.selectedSize,
                                          item.selectedColor,
                                        )
                                      }
                                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-xl transition-colors"
                                    >
                                      <FiPlus size={14} />
                                    </button>
                                  </div>

                                  <div className="text-right md:text-left">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                    {item.originalPrice && (
                                      <div className="text-sm text-gray-400 line-through">
                                        ${item.originalPrice}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Stock Status */}
                                {item.stock < 10 && (
                                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full w-fit">
                                    <FiClock size={12} />
                                    <span>Only {item.stock} left in stock</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isSaving ? (
                              <FiRefreshCw className="animate-spin" size={14} />
                            ) : (
                              <FiHeart
                                className={
                                  inWishlist
                                    ? "fill-pink-500 text-pink-500"
                                    : ""
                                }
                                size={14}
                              />
                            )}
                            <span>
                              {inWishlist ? "Saved" : "Save for later"}
                            </span>
                          </button>
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors"
                          >
                            <FiHeart size={14} />
                            <span>Move to wishlist</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                          >
                            <FiTrash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Continue Shopping Mobile */}
              <div className="md:hidden text-center pt-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group"
                >
                  <FiShoppingBag size={18} />
                  <span>Continue Shopping</span>
                  <FiArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-600/5 to-accent/5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiShoppingBag className="text-primary-600" />
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal ({totalItems} items)
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Shipping
                        </span>
                        <div className="text-right">
                          {shipping === 0 ? (
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <FiTruck size={14} />
                              Free
                            </span>
                          ) : (
                            <span className="text-gray-900 dark:text-white font-medium">
                              ${shipping.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Tax (10%)
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${tax.toFixed(2)}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount (10%)</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Promo Code */}
                    <div className="relative">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="w-full pl-10 pr-24 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                      <FiTag
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-accent text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Shipping Options */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Shipping Method
                      </h3>
                      <div className="space-y-2">
                        <label
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            shippingMethod === "standard"
                              ? "bg-gradient-to-r from-primary-600/10 to-accent/10 border border-primary-500"
                              : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="standard"
                              checked={shippingMethod === "standard"}
                              onChange={(e) =>
                                setShippingMethod(e.target.value)
                              }
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Standard Shipping
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                7-10 business days
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getShipping() === 0
                              ? "Free"
                              : `$${getShipping().toFixed(2)}`}
                          </span>
                        </label>
                        <label
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            shippingMethod === "express"
                              ? "bg-gradient-to-r from-primary-600/10 to-accent/10 border border-primary-500"
                              : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value="express"
                              checked={shippingMethod === "express"}
                              onChange={(e) =>
                                setShippingMethod(e.target.value)
                              }
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Express Shipping
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                3-5 business days
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            $15.00
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Delivery Estimate */}
                    {estimatedDelivery && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                        <FiTruck
                          className="text-blue-500 flex-shrink-0 animate-pulse"
                          size={16}
                        />
                        <span>
                          Estimated delivery by{" "}
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {estimatedDelivery.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Free Shipping Progress */}
                    {subtotal < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Free Shipping Progress
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            ${(100 - subtotal).toFixed(2)} left
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(subtotal / 100) * 100}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-primary-600 to-accent rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-primary-600">
                            ${grandTotal.toFixed(2)}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Including ${tax.toFixed(2)} tax
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <FiLock size={18} />
                      <span>Proceed to Checkout</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Payment Methods */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Secure checkout</span>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          VISA
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          MC
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          AMEX
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          PP
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          APL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                        <FiShield className="text-green-600" size={20} />
                      </div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        Secure Payment
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        256-bit SSL
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                        <FiRefreshCw className="text-blue-600" size={20} />
                      </div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        30-Day Returns
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Hassle-free
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                        <FiGift className="text-purple-600" size={20} />
                      </div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        Gift Wrapping
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Available
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2">
                        <FiAward className="text-yellow-600" size={20} />
                      </div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        Best Prices
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
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
                  className="w-full py-3 text-sm text-gray-500 hover:text-red-600 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FiTrash2 size={16} />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <FiZap className="text-primary-600" />
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-primary-600 to-accent text-white text-xs font-bold rounded-full">
                          {product.badge}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-sm font-medium">
                          Quick View
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <FiStar className="text-yellow-400 fill-current text-xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {product.rating}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-primary-600">
                      ${product.price}
                    </p>
                  </Link>
                </motion.div>
              ))}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <FiAlertCircle className="text-red-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Remove Item
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold">{itemToDelete.name}</span>{" "}
                  from your cart?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
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
