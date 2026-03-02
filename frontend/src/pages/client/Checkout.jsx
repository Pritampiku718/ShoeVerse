import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiMap,
  FiGlobe,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiArrowRight,
  FiArrowLeft,
  FiPackage,
  FiClock,
  FiDollarSign,
  FiPercent,
  FiGift,
  FiRefreshCw,
} from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

// Validation schemas
const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  saveInfo: z.boolean().optional(),
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits"),
  cardName: z.string().min(2, "Name on card is required"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z
    .string()
    .min(3, "CVV must be 3 digits")
    .max(4, "CVV must be 3-4 digits"),
  saveCard: z.boolean().optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getSubtotal, getTax, getShipping, getGrandTotal, clearCart } =
    useCartStore();
  const { createOrder } = useOrderStore();

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  // Helper function to get image URL safely
  const getImageUrl = (item) => {
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
    return "https://via.placeholder.com/60";
  };

  // log cart items to see image structure
  useEffect(() => {
    if (items.length > 0) {
      console.log("Checkout items:", items);
      console.log("First item images:", items[0].images);
      console.log("First item image:", items[0].image);
    }
  }, [items]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [items, navigate, orderComplete]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login?redirect=checkout");
    }
  }, [navigate]);

  // Shipping form
  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    formState: { errors: shippingErrors },
  } = useForm({
    resolver: zodResolver(shippingSchema),
    mode: "onChange",
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      saveInfo: true,
    },
  });

  // Payment form
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors, isValid: paymentValid },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  // Calculations
  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const discount = couponApplied ? subtotal * 0.1 : couponDiscount;
  const grandTotal = subtotal + tax + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1);
      toast.success("Coupon applied! 10% discount");
    } else if (couponCode.toUpperCase() === "FREESHIP") {
      setCouponApplied(true);
      setCouponDiscount(shipping);
      toast.success("Free shipping applied!");
    } else {
      toast.error("Invalid coupon code");
    }
    setCouponCode("");
  };

  const onShippingSubmit = (data) => {
    setShippingData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPaymentSubmit = async () => {
    console.log("🔵 Place Order clicked");

    if (!shippingData) {
      toast.error("Please complete shipping information first");
      return;
    }

    setProcessing(true);
    setErrorDetails(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      // Validate items before sending
      if (!items || items.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
        return;
      }

      // Prepare order items with proper validation
      const orderItems = items.map((item) => {
        // Validate each item has required fields
        if (!item._id) {
          console.error("Item missing _id:", item);
          throw new Error("Item missing product ID");
        }

        // Extract numeric size from strings like "US 9", "EU 42", etc.
        let sizeValue = null;
        if (item.selectedSize) {
       
          // Try to extract number from size string 
          const match = String(item.selectedSize).match(/\d+/);
          sizeValue = match ? parseInt(match[0]) : null;
          console.log(
            `📏 Size conversion: "${item.selectedSize}" → ${sizeValue}`,
          );
        }

        return {
          name: item.name || "Product",
          quantity: Number(item.quantity) || 1,
          image: getImageUrl(item),
          price: Number(item.price) || 0,
          product: item._id,
          size: sizeValue,
          color: item.selectedColor || null,
        };
      });

      // Prepare shipping address
      const shippingAddress = {
        fullName: shippingData.fullName || "",
        address: shippingData.address || "",
        apartment: shippingData.apartment || "",
        city: shippingData.city || "",
        state: shippingData.state || "",
        zipCode: shippingData.zipCode || "",
        country: shippingData.country || "",
        phoneNumber: shippingData.phone || "",
      };

      // Prepare order data
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod:
          paymentMethod === "card" ? "Credit Card" : "Cash on Delivery",
        itemsPrice: Number(subtotal) || 0,
        taxPrice: Number(tax) || 0,
        shippingPrice: Number(shipping) || 0,
        totalPrice: Number(grandTotal) || 0,
        orderNotes: orderNotes || "",
      };

      console.log("Sending order:", JSON.stringify(orderData, null, 2));

      // Make API call with better error handling
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      // Try to get the response text first
      const responseText = await response.text();
      console.log("📨 Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", e);
        data = { message: responseText };
      }

      console.log("📨 Parsed response:", data);

      if (response.ok) {
        setOrderId(data._id || data.order?._id);
        clearCart();
        setOrderComplete(true);
        toast.success("Order placed successfully!");

        // Redirect to orders page after delay
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      } else {
        console.error("Order creation failed:", data);
        setErrorDetails(data);
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorDetails({ error: error.message, stack: error.stack });
      toast.error("Error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Success screen
  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>Order Complete - ShoeVerse</title>
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 md:py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-center"
            >
              <div className="relative mb-4 sm:mb-6 md:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                >
                  <FiCheckCircle className="text-green-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
                </motion.div>
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 20, repeat: Infinity }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border border-primary-200 rounded-full"
                />
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
                Thank You for Your Order!
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6">
                Order #{orderId?.slice(-8)} has been placed successfully.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <FiClock className="text-primary-600" size={16} />
                  <span>Estimated delivery:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(
                      Date.now() + 7 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  // Error display
  if (errorDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-8 max-w-md w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
            Order Failed
          </h2>
          <pre className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-3 sm:p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(errorDetails, null, 2)}
          </pre>
          <button
            onClick={() => setErrorDetails(null)}
            className="mt-3 sm:mt-4 w-full px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - ShoeVerse</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Checkout
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
              Complete your purchase in a few simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-4 sm:mb-6 md:mb-8 overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[300px] sm:min-w-0 max-w-2xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="relative flex items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
                        step >= i
                          ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step > i ? <FiCheckCircle size={14} /> : i}
                    </div>
                    {i < 3 && (
                      <div
                        className={`absolute top-1/2 left-full w-8 sm:w-12 md:w-full h-0.5 sm:h-1 transform -translate-y-1/2 transition-all ${
                          step > i
                            ? "bg-gradient-to-r from-primary-600 to-accent"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                        style={{ width: "calc(100% - 2rem)" }}
                      />
                    )}
                  </div>
                  <span
                    className={`ml-1 sm:ml-2 text-[10px] sm:text-xs md:text-sm font-medium ${
                      step >= i
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {i === 1 ? "Shipping" : i === 2 ? "Payment" : "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
              
              {/* Shipping Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiMapPin className="text-primary-600" size={18} />
                      Shipping Information
                    </h2>
                  </div>

                  <form
                    onSubmit={handleShippingSubmit(onShippingSubmit)}
                    className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6"
                  >
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <FiUser className="text-primary-600" size={14} />
                        Contact Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <FiUser
                              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <input
                              {...registerShipping("fullName")}
                              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="John Doe"
                            />
                          </div>
                          {shippingErrors.fullName && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {shippingErrors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <FiMail
                              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <input
                              {...registerShipping("email")}
                              type="email"
                              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="john@example.com"
                            />
                          </div>
                          {shippingErrors.email && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {shippingErrors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <FiPhone
                              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <input
                              {...registerShipping("phone")}
                              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="+1 234 567 8900"
                            />
                          </div>
                          {shippingErrors.phone && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {shippingErrors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <FiHome className="text-primary-600" size={14} />
                        Shipping Address
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Street Address *
                          </label>
                          <div className="relative">
                            <FiHome
                              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <input
                              {...registerShipping("address")}
                              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="123 Main St"
                            />
                          </div>
                          {shippingErrors.address && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {shippingErrors.address.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Apartment, suite, etc. (optional)
                          </label>
                          <input
                            {...registerShipping("apartment")}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="Apt 4B"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                              City *
                            </label>
                            <div className="relative">
                              <FiMap
                                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                size={14}
                              />
                              <input
                                {...registerShipping("city")}
                                className="w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="NY"
                              />
                            </div>
                            {shippingErrors.city && (
                              <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                                {shippingErrors.city.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                              State *
                            </label>
                            <input
                              {...registerShipping("state")}
                              className="w-full px-2 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="NY"
                            />
                            {shippingErrors.state && (
                              <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                                {shippingErrors.state.message}
                              </p>
                            )}
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                              ZIP Code *
                            </label>
                            <input
                              {...registerShipping("zipCode")}
                              className="w-full px-2 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="10001"
                            />
                            {shippingErrors.zipCode && (
                              <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                                {shippingErrors.zipCode.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Country *
                          </label>
                          <div className="relative">
                            <FiGlobe
                              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <select
                              {...registerShipping("country")}
                              className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none text-gray-900 dark:text-white"
                            >
                              <option value="">Select country</option>
                              <option value="USA">United States</option>
                              <option value="IND">India</option>
                              <option value="CA">Canada</option>
                              <option value="UK">United Kingdom</option>
                              <option value="AU">Australia</option>
                            </select>
                          </div>
                          {shippingErrors.country && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {shippingErrors.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Save Info Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...registerShipping("saveInfo")}
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        Save this information for next time
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiArrowLeft size={14} />
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary-600 to-accent text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
                      >
                        Continue to Payment
                        <FiArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Payment Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiCreditCard className="text-primary-600" size={18} />
                      Payment Method
                    </h2>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                   
                    {/* Payment Method Selection */}
                    <div className="space-y-2 sm:space-y-3">
                      <label
                        className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              Credit / Debit Card
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden xs:block">
                              Pay securely with your card
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-1 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs text-gray-900 dark:text-white">
                            VISA
                          </span>
                          <span className="px-1 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs text-gray-900 dark:text-white">
                            MC
                          </span>
                          <span className="px-1 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[8px] sm:text-xs text-gray-900 dark:text-white">
                            AMEX
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              Cash on Delivery
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden xs:block">
                              Pay when you receive
                            </p>
                          </div>
                        </div>
                        <FiTruck className="text-gray-400" size={16} />
                      </label>
                    </div>

                    {/* Card Details Form */}
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Card Number *
                          </label>
                          <div className="relative">
                            <FiCreditCard
                              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <input
                              {...registerPayment("cardNumber")}
                              className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="1234 5678 9012 3456"
                              maxLength={16}
                            />
                          </div>
                          {paymentErrors.cardNumber && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {paymentErrors.cardNumber.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Name on Card *
                          </label>
                          <input
                            {...registerPayment("cardName")}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="JOHN DOE"
                          />
                          {paymentErrors.cardName && (
                            <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                              {paymentErrors.cardName.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                              Expiry Date *
                            </label>
                            <input
                              {...registerPayment("expiryDate")}
                              className="w-full px-2 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {paymentErrors.expiryDate && (
                              <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                                {paymentErrors.expiryDate.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                              CVV *
                            </label>
                            <input
                              {...registerPayment("cvv")}
                              type="password"
                              className="w-full px-2 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="123"
                              maxLength={4}
                            />
                            {paymentErrors.cvv && (
                              <p className="mt-1 text-[10px] sm:text-xs text-red-500">
                                {paymentErrors.cvv.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            {...registerPayment("saveCard")}
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                            Save card for future purchases
                          </label>
                        </div>
                      </motion.div>
                    )}

                    {/* Order Notes */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Special instructions for delivery"
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiArrowLeft size={14} />
                        Back
                      </button>
                      <button
                        onClick={onPaymentSubmit}
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-accent text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                      >
                        {processing ? (
                          <>
                            <FiRefreshCw className="animate-spin" size={14} />
                            <span className="hidden xs:inline">
                              Processing...
                            </span>
                            <span className="xs:hidden">...</span>
                          </>
                        ) : (
                          <>
                            Place Order
                            <FiArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 sm:top-6 md:top-8 lg:top-24 space-y-4 sm:space-y-5 md:space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiShoppingBag className="text-primary-600" size={18} />
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    
                    {/* Items List */}
                    <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 md:max-h-60 overflow-y-auto">
                      {items.map((item, index) => {
                        const imageUrl = getImageUrl(item);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 sm:gap-3"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/60";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-[10px] sm:text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Shipping
                        </span>
                        <div className="text-right">
                          {shipping === 0 ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Free
                            </span>
                          ) : (
                            <span className="text-gray-900 dark:text-white font-medium">
                              ${shipping.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Tax (10%)
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${tax.toFixed(2)}
                        </span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-[10px] sm:text-xs text-green-600 dark:text-green-400">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Coupon Code */}
                    <div className="relative">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="w-full pl-7 sm:pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <FiPercent
                        className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        size={12}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                        className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-600 text-white text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Total */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <div className="text-right">
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary-600">
                            ${grandTotal.toFixed(2)}
                          </span>
                          <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                            incl. ${tax.toFixed(2)} tax
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="text-center">
                      <FiLock className="text-green-500 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        Secure Payment
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        256-bit SSL
                      </p>
                    </div>
                    <div className="text-center">
                      <FiShield className="text-blue-500 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        Buyer Protection
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        100% covered
                      </p>
                    </div>
                    <div className="text-center">
                      <FiRefreshCw className="text-purple-500 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        30-Day Returns
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        Hassle-free
                      </p>
                    </div>
                    <div className="text-center">
                      <FiGift className="text-yellow-500 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                      <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 dark:text-white">
                        Gift Options
                      </p>
                      <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                        Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
