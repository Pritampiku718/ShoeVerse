import { create } from 'zustand';
import { ordersAPI } from '../services/api';
import { toast } from 'react-hot-toast';

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  createOrder: async (orderData) => {
    console.log('📞 createOrder called with:', orderData);
    set({ isLoading: true });
    try {
      const response = await ordersAPI.create(orderData);
      console.log('✅ API response:', response.data);
      toast.success('Order placed successfully!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('❌ API error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to place order');
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await ordersAPI.getMyOrders();
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await ordersAPI.getById(id);
      set({ currentOrder: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch order:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await ordersAPI.getAll();
      set({ allOrders: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success('Order status updated');
      await get().fetchAllOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      await ordersAPI.delete(id);
      toast.success('Order deleted');
      await get().fetchAllOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
      throw error;
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));