import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ProductGallery from "../../components/product/ProductGallery"; // Import the new gallery
import {
  FiShoppingBag,
  FiHeart,
  FiStar,
  FiArrowLeft,
  FiCheck,
  FiMinus,
  FiPlus,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiShare2,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiAward,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentProduct, fetchProductById, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    window.scrollTo(0, 0);

    // Calculate estimated delivery
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 5);
    setEstimatedDelivery(delivery);
  }, [id]);

  // Extract size values (handle both string and object formats)
  const sizeValues =
    currentProduct?.sizes?.map((s) => (typeof s === "object" ? s.size : s)) ||
    [];
  const colorValues =
    currentProduct?.colors?.map((c) => (typeof c === "object" ? c.color : c)) ||
    [];

  const handleAddToCart = () => {
    if (!currentProduct) return;

    if (sizeValues.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colorValues.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart({
      ...currentProduct,
      selectedSize,
      selectedColor,
      quantity,
    });
    toast.success("Added to cart!", {
      icon: "🛒",
      style: {
        background: "#10b981",
        color: "#fff",
      },
    });
  };

  const handleBuyNow = () => {
    if (!currentProduct) return;

    if (sizeValues.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colorValues.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart({
      ...currentProduct,
      selectedSize,
      selectedColor,
      quantity,
    });
    navigate("/checkout");
  };

  const handleWishlistToggle = () => {
    if (!currentProduct) return;

    if (isInWishlist(currentProduct._id)) {
      removeFromWishlist(currentProduct._id);
      toast.success("Removed from wishlist", { icon: "💔" });
    } else {
      addToWishlist(currentProduct);
      toast.success("Added to wishlist", { icon: "❤️" });
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${currentProduct.name} at ShoeVerse!`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
          "_blank",
        );
        break;
      case "email":
        window.open(`mailto:?subject=${text}&body=${url}`);
        break;
    }
    setShowShareModal(false);
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 1,
      name: "Nike Air Max 270",
      brand: "Nike",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Jordan Retro 4",
      brand: "Jordan",
      price: 210,
      image:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
    },
    {
      id: 4,
      name: "New Balance 990v5",
      brand: "New Balance",
      price: 175,
      image:
        "https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 4.7,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent rounded-full" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(currentProduct._id);

  // Prepare images array for gallery
  const galleryImages =
    currentProduct.images?.length > 0
      ? currentProduct.images
      : [{ url: currentProduct.image || "https://via.placeholder.com/600" }];

  return (
    <>
      <Helmet>
        <title>{currentProduct.name} - ShoeVerse Premium</title>
        <meta name="description" content={currentProduct.description} />
        <meta property="og:title" content={currentProduct.name} />
        <meta property="og:description" content={currentProduct.description} />
        <meta property="og:image" content={galleryImages[0]?.url} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto pb-2">
            <Link
              to="/"
              className="hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/category/${currentProduct.category?.toLowerCase() || "all"}`}
              className="hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {currentProduct.category || "All"}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium whitespace-nowrap">
              {currentProduct.name}
            </span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors mb-6 group"
          >
            <FiArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back</span>
          </button>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Gallery - Using the new component */}
            <ProductGallery
              images={galleryImages}
              productName={currentProduct.name}
              onImageChange={(index) => setActiveImageIndex(index)}
              allowZoom={true}
              allowFullscreen={true}
              showThumbnails={true}
              thumbnailPosition="bottom"
            />

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Title */}
              <div>
                <Link
                  to={`/brand/${currentProduct.brand?.toLowerCase()}`}
                  className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline inline-block mb-2"
                >
                  {currentProduct.brand || "Premium Brand"}
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {currentProduct.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(currentProduct.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({currentProduct.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${currentProduct.price}
                </span>
                {currentProduct.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${currentProduct.originalPrice}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold rounded-full">
                      Save $
                      {currentProduct.originalPrice - currentProduct.price}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {currentProduct.description ||
                  "Premium quality sneakers with exceptional comfort and style."}
              </p>

              {/* Size Selection */}
              {sizeValues.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Size:{" "}
                    <span className="text-primary-600">
                      {selectedSize || "Select"}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizeValues.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[60px] px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "border-primary-600 bg-primary-600 text-white shadow-lg"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-primary-400 hover:text-primary-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {colorValues.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Color:{" "}
                    <span className="text-primary-600">
                      {selectedColor || "Select"}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colorValues.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-primary-600 scale-110 shadow-lg"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                      >
                        {selectedColor === color && (
                          <FiCheck
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md"
                            size={16}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Quantity
                </h3>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-xl transition-colors text-gray-900 dark:text-white"
                  >
                    <FiMinus size={16} className="mx-auto" />
                  </button>
                  <span className="flex-1 text-center font-medium text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-xl transition-colors text-gray-900 dark:text-white"
                  >
                    <FiPlus size={16} className="mx-auto" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${currentProduct.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
                <span
                  className={`text-sm font-medium ${currentProduct.stock > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {currentProduct.stock > 0
                    ? `${currentProduct.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-accent text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 border-2 border-primary-600 text-primary-600 dark:text-primary-400 py-4 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                >
                  <FiHeart
                    size={20}
                    className={inWishlist ? "fill-red-500 text-red-500" : ""}
                  />
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  </span>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                >
                  <FiShare2 size={20} />
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Share
                  </span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <FiTruck
                    className="text-primary-600 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Free Shipping
                    </p>
                    <p className="text-[10px] text-gray-500">On orders $100+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <FiRefreshCw
                    className="text-green-600 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      30-Day Returns
                    </p>
                    <p className="text-[10px] text-gray-500">Hassle-free</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <FiShield
                    className="text-purple-600 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Authentic
                    </p>
                    <p className="text-[10px] text-gray-500">100% Guaranteed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <FiPackage
                    className="text-blue-600 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Secure Pack
                    </p>
                    <p className="text-[10px] text-gray-500">Premium box</p>
                  </div>
                </div>
              </div>

              {/* Delivery Estimate */}
              {estimatedDelivery && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FiClock className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Estimated Delivery
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Order within the next{" "}
                        <span className="font-semibold text-primary-600">
                          4 hours
                        </span>{" "}
                        for delivery by
                      </p>
                      <p className="text-sm font-bold text-primary-600 mt-1">
                        {estimatedDelivery.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-16">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
              <div className="flex gap-6 min-w-max">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-all relative ${
                      activeTab === tab
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[200px]"
              >
                {activeTab === "description" && (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentProduct.description ||
                        "Premium quality sneakers with exceptional comfort and style."}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <FiAward className="text-primary-600" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <FiCheck className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Premium materials
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <FiCheck className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Responsive cushioning
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <FiCheck className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Breathable upper
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <FiCheck className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Durable outsole
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <FiPackage className="text-3xl text-primary-600 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Product Code
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        SNK-{currentProduct._id?.slice(-8)}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <FiAward className="text-3xl text-primary-600 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Brand
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentProduct.brand || "Premium"}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <FiCheckCircle className="text-3xl text-primary-600 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Warranty
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        2 Years
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-8">
                    <FiStar className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No reviews yet
                    </p>
                    <button className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related Products */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <FiAward className="text-primary-600" />
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
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
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share this product
              </h3>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex flex-col items-center gap-2"
                >
                  <FiFacebook size={24} />
                  <span className="text-xs">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors flex flex-col items-center gap-2"
                >
                  <FiTwitter size={24} />
                  <span className="text-xs">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare("email")}
                  className="p-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex flex-col items-center gap-2"
                >
                  <FiMail size={24} />
                  <span className="text-xs">Email</span>
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex flex-col items-center gap-2"
                >
                  <FiCopy size={24} />
                  <span className="text-xs">Copy</span>
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;
