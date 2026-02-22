import { create } from 'zustand';
import { adminAPI } from '../services/api';
import { toast } from 'react-hot-toast';

export const useAdminStore = create((set, get) => ({
  stats: {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
  },
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    console.log('📊 fetchDashboardStats called');
    set({ isLoading: true, error: null });
    
    try {
      console.log('Making API call...');
      const response = await adminAPI.getDashboardStats();
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      set({ 
        stats: response.data, 
        isLoading: false 
      });
      
      console.log('Store updated with stats:', response.data);
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error response:', error.response);
      
      const message = error.response?.data?.message || 'Failed to load dashboard stats';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },
}));