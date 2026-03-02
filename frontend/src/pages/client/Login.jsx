import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiZap,
  FiStar,
  FiGlobe,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Valid email required").min(1, "Email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login, isLoading } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      navigate(user?.isAdmin ? "/admin" : "/");
    } catch (error) {
    }
  };

  const premiumFeatures = [
    {
      icon: FiZap,
      text: "Early Access",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FiStar,
      text: "Exclusive Drops",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FiGlobe,
      text: "Global Shipping",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sign In - ShoeVerse Premium</title>
        <meta
          name="description"
          content="Access your premium ShoeVerse account"
        />
      </Helmet>

      <div
        className={`relative min-h-screen flex items-start justify-center pt-3 sm:pt-4 px-3 sm:px-4 overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          
          {/* Gradient Orbs */}
          <div
            className={`absolute top-0 -left-20 w-48 xs:w-56 sm:w-64 md:w-80 rounded-full blur-3xl opacity-20 ${
              darkMode ? "bg-primary-600" : "bg-primary-500"
            }`}
            style={{ height: "clamp(12rem, 30vw, 20rem)" }}
          />
          <div
            className={`absolute bottom-0 -right-20 w-48 xs:w-56 sm:w-64 md:w-80 rounded-full blur-3xl opacity-20 ${
              darkMode ? "bg-accent-600" : "bg-accent-500"
            }`}
            style={{ height: "clamp(12rem, 30vw, 20rem)" }}
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${
                darkMode ? "#ffffff" : "#000000"
              } 1px, transparent 0)`,
              backgroundSize: "clamp(20px, 4vw, 40px) clamp(20px, 4vw, 40px)",
            }}
          />
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-[320px] xs:max-w-[340px] sm:max-w-[360px] md:max-w-[380px]">
          
          {/* Premium Login Card */}
          <div
            className={`relative rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm ${
              darkMode
                ? "bg-gray-800/95 border border-gray-700/50"
                : "bg-white/95 border border-gray-200/50 shadow-gray-200/50"
            }`}
          >
            {/* ShoeVerse Header */}
            <div
              className={`px-4 xs:px-5 py-3 xs:py-4 border-b ${
                darkMode ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={`text-lg xs:text-xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                      darkMode
                        ? "from-white to-gray-300"
                        : "from-gray-900 via-gray-800 to-gray-700"
                    }`}
                  >
                    ShoeVerse
                  </h1>
                  <p
                    className={`text-[9px] xs:text-[10px] mt-0.5 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
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
              <h2
                className={`text-sm xs:text-base font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome Back
              </h2>
            </div>

            {/* Form Body */}
            <div className="px-4 xs:px-5 pb-3 xs:pb-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 xs:space-y-3.5"
              >
                {/* Email Field */}
                <div>
                  <label
                    className={`block text-[10px] xs:text-[11px] font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                        focusedField === "email"
                          ? "opacity-100 bg-gradient-to-r from-primary-500 to-accent-500"
                          : "opacity-0"
                      }`}
                    />
                    <div className="relative">
                      <FiMail
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                          focusedField === "email"
                            ? "text-white"
                            : darkMode
                              ? "text-gray-500"
                              : "text-gray-500"
                        }`}
                        size={14}
                      />
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
                    <p className="mt-1 text-[9px] xs:text-[10px] text-red-500 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    className={`block text-[10px] xs:text-[11px] font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                        focusedField === "password"
                          ? "opacity-100 bg-gradient-to-r from-primary-500 to-accent-500"
                          : "opacity-0"
                      }`}
                    />
                    <div className="relative">
                      <FiLock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                          focusedField === "password"
                            ? "text-white"
                            : darkMode
                              ? "text-gray-500"
                              : "text-gray-500"
                        }`}
                        size={14}
                      />
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
                        {showPassword ? (
                          <FiEyeOff size={14} />
                        ) : (
                          <FiEye size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[9px] xs:text-[10px] text-red-500 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-start">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-3.5 h-3.5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                          rememberMe
                            ? "bg-primary-500 border-primary-500"
                            : darkMode
                              ? "border-gray-600 bg-gray-700"
                              : "border-gray-400 bg-gray-100"
                        }`}
                      >
                        {rememberMe && (
                          <FiCheckCircle className="text-white" size={8} />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] xs:text-[11px] ${
                        darkMode
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-600 group-hover:text-gray-700"
                      }`}
                    >
                      Remember
                    </span>
                  </label>
                </div>

                {/* SIGN IN BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 xs:py-3 px-4 rounded-lg font-semibold text-xs xs:text-sm transition-all duration-200 ${
                    darkMode
                      ? "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30"
                      : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Create Account */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/register")}
                    className="group inline-flex items-center gap-1.5"
                  >
                    <span
                      className={`text-[10px] xs:text-[11px] ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      New here?
                    </span>
                    <span
                      className={`text-[10px] xs:text-[11px] font-semibold transition-colors ${
                        darkMode
                          ? "text-primary-400 group-hover:text-primary-300"
                          : "text-primary-600 group-hover:text-primary-700"
                      }`}
                    >
                      Create Account
                    </span>
                    <FiArrowRight
                      className={`w-2.5 h-2.5 xs:w-3 xs:h-3 transition-transform group-hover:translate-x-0.5 ${
                        darkMode ? "text-primary-400" : "text-primary-600"
                      }`}
                    />
                  </button>
                </div>
              </form>
            </div>

            {/* Features Footer */}
            <div
              className={`px-4 xs:px-5 py-2.5 xs:py-3 border-t flex items-center justify-center gap-2 xs:gap-3 flex-wrap ${
                darkMode ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className={`p-1 rounded-full bg-gradient-to-r ${feature.color}`}
                    >
                      <Icon className="text-white" size={8} />
                    </div>
                    <span
                      className={`text-[8px] xs:text-[9px] font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
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

export default Login;
