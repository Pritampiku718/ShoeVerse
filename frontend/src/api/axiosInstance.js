import axios from "axios";

/* =====================================
   ✅ Backend API Base URL (LOCAL + LIVE)
===================================== */

// ✅ Localhost fallback
// ✅ Vercel Production URL will come from Environment Variable

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🌐 Connecting to backend at:", API_URL);

/* =====================================
   ✅ Axios Instance Setup
===================================== */

const axiosInstance = axios.create({
  baseURL: API_URL,

  // ❌ IMPORTANT FIX:
  // Do NOT force "Content-Type": "application/json" globally
  // Because file upload needs multipart/form-data
  // Axios will automatically handle Content-Type correctly

  headers: {},

  withCredentials: true,

  timeout: 30000,
});

/* =====================================
   ✅ REQUEST INTERCEPTOR (TOKEN ADD)
===================================== */

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    console.log("Token from localStorage:", token ? "Present" : "Not found");

    if (token) {
      // Attach token properly
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added to request:", config.url);
    } else {
      console.log("❌ No token found for request:", config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =====================================
   ✅ RESPONSE INTERCEPTOR
===================================== */

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },

  (error) => {
    console.error("❌ API Error:", error.message, error.config?.url);

    /* 🔒 Unauthorized */
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - clearing token");

      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      // Redirect to login
      window.location.href = "/login";
    }

    /* ⏳ Timeout */
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        response: {
          data: { message: "Request timeout. Please try again." },
        },
      });
    }

    /* ❌ Backend Not Running */
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message:
              "Cannot connect to server. Please make sure backend is running.",
          },
        },
      });
    }

    return Promise.reject(error);
  }
);

/* =====================================
   ✅ Export Axios Instance
===================================== */

export default axiosInstance;
