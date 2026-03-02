import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye,
  FiEyeOff,
  FiArrowRight, 
  FiCheckCircle,
  FiZap,
  FiStar,
  FiGlobe
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { toast } from "react-hot-toast";

// Registration validation schema
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { register: registerUser, isLoading } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Watch password for strength indicator
  const password = watch("password", "");

  // Calculate password strength
  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength += 25;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    return strength;
  };

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/login");
      toast.success("Registration successful! Please login.");
    } catch (error) {
    }
  };

  const premiumFeatures = [
    { icon: FiZap, text: "Early Access", color: "from-amber-500 to-orange-500" },
    { icon: FiStar, text: "Exclusive Drops", color: "from-purple-500 to-pink-500" },
    { icon: FiGlobe, text: "Global Shipping", color: "from-blue-500 to-cyan-500" },
  ];

  return (
    <>
      <Helmet>
        <title>Create Account - ShoeVerse Premium</title>
        <meta
          name="description"
          content="Join ShoeVerse to access exclusive sneaker drops and premium collections."
        />
      </Helmet>

      <div className={`relative min-h-screen flex items-start justify-center pt-3 sm:pt-4 px-3 sm:px-4 overflow-hidden ${
        darkMode 
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" 
          : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
      }`}>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          
          {/* Gradient Orbs */}
          <div className={`absolute top-0 -left-20 w-48 xs:w-56 sm:w-64 md:w-80 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-primary-600" : "bg-primary-500"
          }`} style={{ height: 'clamp(12rem, 30vw, 20rem)' }} />
          <div className={`absolute bottom-0 -right-20 w-48 xs:w-56 sm:w-64 md:w-80 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-accent-600" : "bg-accent-500"
          }`} style={{ height: 'clamp(12rem, 30vw, 20rem)' }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${
                darkMode ? '#ffffff' : '#000000'
              } 1px, transparent 0)`,
              backgroundSize: 'clamp(20px, 4vw, 40px) clamp(20px, 4vw, 40px)',
            }}
          />
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:max-w-[400px]">
        
         {/* Register Card */}
          <div className={`relative rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm ${
            darkMode
              ? "bg-gray-800/95 border border-gray-700/50"
              : "bg-white/95 border border-gray-200/50 shadow-gray-200/50"
          }`}>
            
            {/* ShoeVerse Header */}
            <div className={`px-4 xs:px-5 py-3 xs:py-4 border-b ${
              darkMode ? "border-gray-700/50" : "border-gray-200/50"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={`text-lg xs:text-xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                    darkMode
                      ? "from-white to-gray-300"
                      : "from-gray-900 via-gray-800 to-gray-700"
                  }`}>
                    ShoeVerse
                  </h1>
                  <p className={`text-[9px] xs:text-[10px] mt-0.5 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Premium Shoes Collection
                  </p>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="px-4 xs:px-5 pt-3 xs:pt-4 pb-1">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 ${
                darkMode
                  ? "bg-gradient-to-r from-primary-600 to-accent"
                  : "bg-gradient-to-r from-primary-500 to-accent"
              }`}>
                <FiZap size={10} className="text-white" />
                <span className="text-[8px] font-bold tracking-wider text-white">
                  JOIN PREMIUM
                </span>
                <FiZap size={10} className="text-white" />
              </div>
              <h2 className={`text-sm xs:text-base font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Create Account
              </h2>
            </div>

            {/* Form Body */}
            <div className="px-4 xs:px-5 pb-3 xs:pb-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 xs:space-y-3.5">
                
                {/* Name Field */}
                <div>
                  <label className={`block text-[10px] xs:text-[11px] font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                      focusedField === "name"
                        ? "opacity-100 bg-gradient-to-r from-primary-500 to-accent-500"
                        : "opacity-0"
                    }`} />
                    <div className="relative">
                      <FiUser className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === "name"
                          ? "text-white"
                          : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                      }`} size={14} />
                      <input
                        type="text"
                        {...register("name")}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-9 pr-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                          focusedField === "name"
                            ? "border-transparent bg-white/10 text-white placeholder-white/70 ring-2 ring-primary-500"
                            : darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-[9px] xs:text-[10px] text-red-500 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className={`block text-[10px] xs:text-[11px] font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                      focusedField === "email"
                        ? "opacity-100 bg-gradient-to-r from-primary-500 to-accent-500"
                        : "opacity-0"
                    }`} />
                    <div className="relative">
                      <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === "email"
                          ? "text-white"
                          : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                      }`} size={14} />
                      <input
                        type="email"
                        {...register("email")}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-9 pr-4 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                          focusedField === "email"
                            ? "border-transparent bg-white/10 text-white placeholder-white/70 ring-2 ring-primary-500"
                            : darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-[9px] xs:text-[10px] text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-[10px] xs:text-[11px] font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                      focusedField === "password"
                        ? "opacity-100 bg-gradient-to-r from-primary-500 to-accent-500"
                        : "opacity-0"
                    }`} />
                    <div className="relative">
                      <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === "password"
                          ? "text-white"
                          : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                      }`} size={14} />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-9 pr-10 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                          focusedField === "password"
                            ? "border-transparent bg-white/10 text-white placeholder-white/70 ring-2 ring-primary-500"
                            : darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                          darkMode
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <span className={`text-[8px] xs:text-[9px] font-medium ${
                          passwordStrength <= 25
                            ? "text-red-500"
                            : passwordStrength <= 50
                              ? "text-orange-500"
                              : passwordStrength <= 75
                                ? "text-yellow-500"
                                : "text-green-500"
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-[9px] xs:text-[10px] text-red-500 font-medium">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className={`block text-[10px] xs:text-[11px] font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                      focusedField === "confirmPassword"
                        ? "opacity-100 bg-gradient-to-r from-primary-500 to-accent-500"
                        : "opacity-0"
                    }`} />
                    <div className="relative">
                      <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === "confirmPassword"
                          ? "text-white"
                          : darkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                      }`} size={14} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-9 pr-10 py-2 xs:py-2.5 text-xs xs:text-sm rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                          focusedField === "confirmPassword"
                            ? "border-transparent bg-white/10 text-white placeholder-white/70 ring-2 ring-primary-500"
                            : darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                          darkMode
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[9px] xs:text-[10px] text-red-500 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <div className="relative flex items-center h-5">
                      <input
                        type="checkbox"
                        id="terms"
                        {...register("terms")}
                        className="w-3.5 h-3.5 rounded border-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                        style={{
                          accentColor: darkMode ? '#3b82f6' : '#2563eb'
                        }}
                      />
                    </div>
                    <label
                      htmlFor="terms"
                      className={`text-[9px] xs:text-[10px] transition-colors duration-300 cursor-pointer select-none ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className={`font-medium transition-colors ${
                          darkMode
                            ? "text-primary-400 hover:text-primary-300"
                            : "text-primary-600 hover:text-primary-700"
                        }`}
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className={`font-medium transition-colors ${
                          darkMode
                            ? "text-primary-400 hover:text-primary-300"
                            : "text-primary-600 hover:text-primary-700"
                        }`}
                      >
                        Privacy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-[9px] xs:text-[10px] text-red-500 font-medium ml-5">{errors.terms.message}</p>
                  )}
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 xs:py-3 px-4 rounded-lg font-semibold text-xs xs:text-sm transition-all duration-200 ${
                    darkMode
                      ? "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30"
                      : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-1.5"
                  >
                    <span className={`text-[10px] xs:text-[11px] ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Already have an account?
                    </span>
                    <span className={`text-[10px] xs:text-[11px] font-semibold transition-colors ${
                      darkMode
                        ? "text-primary-400 group-hover:text-primary-300"
                        : "text-primary-600 group-hover:text-primary-700"
                    }`}>
                      Sign In
                    </span>
                    <FiArrowRight className={`w-2.5 h-2.5 xs:w-3 xs:h-3 transition-transform group-hover:translate-x-0.5 ${
                      darkMode ? "text-primary-400" : "text-primary-600"
                    }`} />
                  </Link>
                </div>
              </form>
            </div>

            {/* Features Footer */}
            <div className={`px-4 xs:px-5 py-2.5 xs:py-3 border-t flex items-center justify-center gap-2 xs:gap-3 flex-wrap ${
              darkMode ? "border-gray-700/50" : "border-gray-200/50"
            }`}>
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-1">
                    <div className={`p-1 rounded-full bg-gradient-to-r ${feature.color}`}>
                      <Icon className="text-white" size={8} />
                    </div>
                    <span className={`text-[8px] xs:text-[9px] font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;