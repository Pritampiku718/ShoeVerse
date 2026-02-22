// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.MODE === 'development') {
      console.log(`🚀 [API] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.MODE === 'development') {
      console.log(`✅ [API] ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`, 
        response.data?.data || response.data);
    }
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ [API] Error ${status}:`, data?.message || error.message);
      
      // Handle 401 Unauthorized
      if (status === 401) {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden');
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        console.error('Resource not found');
      }
      
      // Handle 429 Too Many Requests
      if (status === 429) {
        console.error('Rate limit exceeded');
      }
      
      // Handle 500 Internal Server Error
      if (status >= 500) {
        console.error('Server error');
      }
      
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ [API] No response received:', error.request);
      
      // Check if it's a network error (CORS, offline, etc.)
      if (error.message === 'Network Error') {
        console.error('Network error - check if backend is running');
      }
      
    } else {
      // Something happened in setting up the request
      console.error('❌ [API] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Token refresh mechanism
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // Call your refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        const { token, refreshToken: newRefreshToken } = response.data.data;
        
        // Store new tokens
        localStorage.setItem('token', token);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // Update Authorization header
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Process queued requests
        processQueue(null, token);
        
        // Retry original request
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
        
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common requests
export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

// ======================================
// PRODUCTS API
// ======================================
export const productsAPI = {
  // Public routes
  getAll: (params) => axiosInstance.get('/products', { params }),
  getOne: (id) => axiosInstance.get(`/products/${id}`),
  getFeatured: () => axiosInstance.get('/products/featured'),
  getNewArrivals: () => axiosInstance.get('/products/new-arrivals'),
  getBestSellers: () => axiosInstance.get('/products/best-sellers'),
  getCategories: () => axiosInstance.get('/products/categories'),
  getBrands: () => axiosInstance.get('/products/brands'),
  search: (query) => axiosInstance.get('/products/search', { params: { q: query } }),
  
  // Admin routes (protected)
  create: (data) => {
    if (data instanceof FormData) {
      return axiosInstance.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return axiosInstance.post('/admin/products', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return axiosInstance.put(`/admin/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return axiosInstance.put(`/admin/products/${id}`, data);
  },
  delete: (id) => axiosInstance.delete(`/admin/products/${id}`),
  bulkDelete: (data) => axiosInstance.post('/admin/products/bulk-delete', data),
  toggleStatus: (id) => axiosInstance.patch(`/admin/products/${id}/toggle`),
  getLowStock: (params) => axiosInstance.get('/admin/products/low-stock', { params }),
  getOutOfStock: () => axiosInstance.get('/admin/products/out-of-stock'),
  updateStock: (id, data) => axiosInstance.patch(`/admin/products/${id}/stock`, data),
  exportCSV: (params) => axiosInstance.get('/admin/products/export', { 
    params,
    responseType: 'blob' 
  }),
};

// ======================================
// AUTH API
// ======================================
export const authAPI = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  changePassword: (data) => axiosInstance.put('/auth/change-password', data),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axiosInstance.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
};

// ======================================
// USER API
// ======================================
export const userAPI = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  changePassword: (data) => axiosInstance.put('/users/change-password', data),
  getAddresses: () => axiosInstance.get('/users/addresses'),
  addAddress: (data) => axiosInstance.post('/users/addresses', data),
  updateAddress: (id, data) => axiosInstance.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => axiosInstance.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => axiosInstance.patch(`/users/addresses/${id}/default`),
  getWishlist: () => axiosInstance.get('/users/wishlist'),
  addToWishlist: (productId) => axiosInstance.post('/users/wishlist', { productId }),
  removeFromWishlist: (productId) => axiosInstance.delete(`/users/wishlist/${productId}`),
  clearWishlist: () => axiosInstance.delete('/users/wishlist'),
};

// ======================================
// ORDERS API
// ======================================
export const ordersAPI = {
  // User routes
  create: (orderData) => axiosInstance.post('/orders', orderData),
  getMyOrders: (params) => axiosInstance.get('/orders/my-orders', { params }),
  getById: (id) => axiosInstance.get(`/orders/${id}`),
  cancel: (id, reason) => axiosInstance.put(`/orders/${id}/cancel`, { reason }),
  trackOrder: (trackingNumber) => axiosInstance.get(`/orders/track/${trackingNumber}`),
  returnOrder: (id, data) => axiosInstance.post(`/orders/${id}/return`, data),
  
  // Admin routes
  getAll: (params) => axiosInstance.get('/admin/orders', { params }),
  updateStatus: (id, status) => axiosInstance.put(`/admin/orders/${id}/status`, { orderStatus: status }),
  delete: (id) => axiosInstance.delete(`/admin/orders/${id}`),
  getStats: () => axiosInstance.get('/admin/orders/stats'),
  getRecent: (limit) => axiosInstance.get('/admin/orders/recent', { params: { limit } }),
  bulkUpdateStatus: (data) => axiosInstance.patch('/admin/orders/bulk-update', data),
  exportCSV: (params) => axiosInstance.get('/admin/orders/export', { 
    params,
    responseType: 'blob' 
  }),
  updatePaymentStatus: (id, isPaid) => axiosInstance.put(`/admin/orders/${id}/payment`, { isPaid }),
  addTracking: (id, trackingNumber) => axiosInstance.post(`/admin/orders/${id}/tracking`, { trackingNumber }),
  getByCustomer: (customerId, params) => axiosInstance.get(`/admin/orders/customer/${customerId}`, { params }),
};

// ======================================
// ADMIN API
// ======================================
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => axiosInstance.get('/admin/dashboard-stats'),
  getRevenueStats: (params) => axiosInstance.get('/admin/revenue-stats', { params }),
  getOrderStats: () => axiosInstance.get('/admin/order-stats'),
  getUserStats: () => axiosInstance.get('/admin/user-stats'),
  getProductStats: () => axiosInstance.get('/admin/product-stats'),
  
  // Users management
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getUserDetails: (id) => axiosInstance.get(`/admin/users/${id}`),
  getUserActivity: (id, limit) => axiosInstance.get(`/admin/users/${id}/activity`, { params: { limit } }),
  updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  toggleBlockUser: (id, reason) => axiosInstance.patch(`/admin/users/${id}/toggle-block`, { reason }),
  bulkDeleteUsers: (data) => axiosInstance.post('/admin/users/bulk-delete', data),
  exportUsers: (params) => axiosInstance.get('/admin/users/export', { 
    params,
    responseType: 'blob' 
  }),
  
  // Categories management
  getCategories: (params) => axiosInstance.get('/admin/categories', { params }),
  createCategory: (data) => axiosInstance.post('/admin/categories', data),
  updateCategory: (id, data) => axiosInstance.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/admin/categories/${id}`),
  
  // Brands management
  getBrands: (params) => axiosInstance.get('/admin/brands', { params }),
  createBrand: (data) => axiosInstance.post('/admin/brands', data),
  updateBrand: (id, data) => axiosInstance.put(`/admin/brands/${id}`, data),
  deleteBrand: (id) => axiosInstance.delete(`/admin/brands/${id}`),
  
  // Settings
  getSettings: () => axiosInstance.get('/admin/settings'),
  updateSettings: (data) => axiosInstance.put('/admin/settings', data),
  getLogs: (params) => axiosInstance.get('/admin/logs', { params }),
  clearCache: () => axiosInstance.post('/admin/clear-cache'),
};

// ======================================
// UPLOAD API
// ======================================
export const uploadAPI = {
  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post('/upload/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return axiosInstance.post('/upload/product/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosInstance.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadCategoryImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post('/upload/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadBrandLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return axiosInstance.post('/upload/brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (publicId) => axiosInstance.delete(`/upload/${publicId}`),
  deleteMultiple: (data) => axiosInstance.post('/upload/delete-multiple', data),
};

// ======================================
// REVENUE API
// ======================================
export const revenueAPI = {
  getSummary: () => axiosInstance.get('/revenue/summary'),
  getDaily: (days = 7) => axiosInstance.get('/revenue/daily', { params: { days } }),
  getMonthly: (months = 12) => axiosInstance.get('/revenue/monthly', { params: { months } }),
  getQuarterly: () => axiosInstance.get('/revenue/quarterly'),
  getYearly: () => axiosInstance.get('/revenue/yearly'),
  getByRange: (startDate, endDate) => axiosInstance.get('/revenue/range', { 
    params: { startDate, endDate } 
  }),
  getByProduct: (params) => axiosInstance.get('/revenue/products', { params }),
  getByCategory: () => axiosInstance.get('/revenue/categories'),
  getByCustomer: (params) => axiosInstance.get('/revenue/customers', { params }),
  getForecast: (months = 3) => axiosInstance.get('/revenue/forecast', { params: { months } }),
  getRealtime: () => axiosInstance.get('/revenue/realtime'),
  getByPaymentMethod: () => axiosInstance.get('/revenue/payment-methods'),
  exportReport: (params) => axiosInstance.get('/revenue/export', { 
    params,
    responseType: 'blob' 
  }),
};

// ======================================
// REVIEWS API
// ======================================
export const reviewsAPI = {
  getProductReviews: (productId, params) => 
    axiosInstance.get(`/reviews/product/${productId}`, { params }),
  createReview: (productId, data) => 
    axiosInstance.post(`/reviews/product/${productId}`, data),
  updateReview: (reviewId, data) => 
    axiosInstance.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => 
    axiosInstance.delete(`/reviews/${reviewId}`),
  markHelpful: (reviewId) => 
    axiosInstance.post(`/reviews/${reviewId}/helpful`),
  reportReview: (reviewId, reason) => 
    axiosInstance.post(`/reviews/${reviewId}/report`, { reason }),
  
  // Admin routes
  getAll: (params) => axiosInstance.get('/admin/reviews', { params }),
  moderate: (reviewId, action) => 
    axiosInstance.patch(`/admin/reviews/${reviewId}/moderate`, { action }),
  deleteModerate: (reviewId) => 
    axiosInstance.delete(`/admin/reviews/${reviewId}`),
};

// ======================================
// COUPONS API
// ======================================
export const couponsAPI = {
  validate: (code) => axiosInstance.post('/coupons/validate', { code }),
  applyToCart: (code) => axiosInstance.post('/coupons/apply', { code }),
  removeFromCart: () => axiosInstance.delete('/coupons/remove'),
  
  // Admin routes
  getAll: (params) => axiosInstance.get('/admin/coupons', { params }),
  create: (data) => axiosInstance.post('/admin/coupons', data),
  update: (id, data) => axiosInstance.put(`/admin/coupons/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/coupons/${id}`),
  toggleStatus: (id) => axiosInstance.patch(`/admin/coupons/${id}/toggle`),
  getStats: (id) => axiosInstance.get(`/admin/coupons/${id}/stats`),
  exportCSV: () => axiosInstance.get('/admin/coupons/export', { responseType: 'blob' }),
};

// ======================================
// NOTIFICATIONS API
// ======================================
export const notificationsAPI = {
  getMyNotifications: (params) => axiosInstance.get('/notifications', { params }),
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.patch('/notifications/read-all'),
  delete: (id) => axiosInstance.delete(`/notifications/${id}`),
  deleteAll: () => axiosInstance.delete('/notifications'),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
  
  // Admin routes
  sendToAll: (data) => axiosInstance.post('/admin/notifications/send-all', data),
  sendToUser: (userId, data) => axiosInstance.post(`/admin/notifications/user/${userId}`, data),
};

// ======================================
// PAYMENTS API
// ======================================
export const paymentsAPI = {
  createPaymentIntent: (data) => axiosInstance.post('/payments/create-intent', data),
  confirmPayment: (data) => axiosInstance.post('/payments/confirm', data),
  getPaymentMethods: () => axiosInstance.get('/payments/methods'),
  addPaymentMethod: (data) => axiosInstance.post('/payments/methods', data),
  removePaymentMethod: (id) => axiosInstance.delete(`/payments/methods/${id}`),
  setDefaultMethod: (id) => axiosInstance.patch(`/payments/methods/${id}/default`),
  getTransactions: (params) => axiosInstance.get('/payments/transactions', { params }),
  getTransactionDetails: (id) => axiosInstance.get(`/payments/transactions/${id}`),
  refund: (id, data) => axiosInstance.post(`/payments/transactions/${id}/refund`, data),
};

// ======================================
// SHIPPING API
// ======================================
export const shippingAPI = {
  calculateRates: (data) => axiosInstance.post('/shipping/rates', data),
  getMethods: () => axiosInstance.get('/shipping/methods'),
  trackShipment: (trackingNumber) => axiosInstance.get(`/shipping/track/${trackingNumber}`),
  validateAddress: (address) => axiosInstance.post('/shipping/validate-address', address),
  
  // Admin routes
  getRates: () => axiosInstance.get('/admin/shipping/rates'),
  updateRate: (id, data) => axiosInstance.put(`/admin/shipping/rates/${id}`, data),
  createRate: (data) => axiosInstance.post('/admin/shipping/rates', data),
  deleteRate: (id) => axiosInstance.delete(`/admin/shipping/rates/${id}`),
  getZones: () => axiosInstance.get('/admin/shipping/zones'),
};

// ======================================
// WISHLIST API
// ======================================
export const wishlistAPI = {
  getWishlist: () => axiosInstance.get('/wishlist'),
  addItem: (productId) => axiosInstance.post('/wishlist/items', { productId }),
  removeItem: (productId) => axiosInstance.delete(`/wishlist/items/${productId}`),
  clearWishlist: () => axiosInstance.delete('/wishlist'),
  moveToCart: (productId) => axiosInstance.post('/wishlist/move-to-cart', { productId }),
  isInWishlist: (productId) => axiosInstance.get(`/wishlist/check/${productId}`),
};

// Export the configured instance
export default axiosInstance;