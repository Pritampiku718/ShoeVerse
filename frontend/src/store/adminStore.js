import { create } from "zustand";
import { adminAPI, ordersAPI } from "../services/api";
import { toast } from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  
  // Dashboard Stats
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

  // User Management
  users: [],
  selectedUser: null,

  // Order Management
  orders: [],
  selectedOrder: null,

  // UI State
  isLoading: false,
  error: null,

  // DASHBOARD STATS
  fetchDashboardStats: async () => {
    console.log("fetchDashboardStats called");
    set({ isLoading: true, error: null });

    try {
      console.log("Making API call...");
      const response = await adminAPI.getDashboardStats();
      console.log("API Response:", response);
      console.log("Response data:", response.data);

      set({
        stats: response.data,
        isLoading: false,
      });

      console.log("Store updated with stats:", response.data);
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error response:", error.response);

      const message =
        error.response?.data?.message || "Failed to load dashboard stats";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // USER MANAGEMENT
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getUsers(params);
      console.log("Raw fetched users:", response.data);

      // Handle different response structures
      let usersData = [];
      if (response.data.data?.users) {
        usersData = response.data.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data.users) {
        usersData = response.data.users;
      }
      
      const processedUsers = usersData.map((user) => ({
        ...user,
        role:
          user.role ||
          user.userRole ||
          (user.isAdmin ? "admin" : "user") ||
          (user.role === undefined ? "user" : user.role),
        isBlocked:
          user.isBlocked || user.isBlocked === undefined
            ? false
            : user.isBlocked,
      }));

      console.log(
        "Processed users with roles:",
        processedUsers.map((u) => ({
          name: u.name,
          role: u.role,
          email: u.email,
        })),
      );

      set({ users: processedUsers, isLoading: false });
      return processedUsers;
    } catch (error) {
      console.error("Fetch users error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        isLoading: false,
      });
      toast.error("Failed to fetch users");
      throw error;
    }
  },

  getUserStats: async () => {
    try {
      const response = await adminAPI.getUserStats();
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get user stats error:", error);
      toast.error("Failed to fetch user stats");
      throw error;
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await adminAPI.updateUser(userId, { role });
      toast.success("User role updated successfully");

      // Update local state
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, role } : user,
        ),
      }));

      return response.data;
    } catch (error) {
      console.error("Update user role error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user role",
      );
      throw error;
    }
  },

  toggleUserStatus: async (userId, isBlocked) => {
    try {
      const response = await adminAPI.toggleBlockUser(userId, {
        reason: isBlocked ? "Blocked by admin" : "Unblocked by admin",
      });
      toast.success(`User ${isBlocked ? "blocked" : "unblocked"} successfully`);

      // Update local state
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, isBlocked } : user,
        ),
      }));

      return response.data;
    } catch (error) {
      console.error("Toggle user status error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user status",
      );
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted successfully");

      // Update local state
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));

      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
      throw error;
    }
  },

  getUserDetails: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getUserDetails(userId);
      set({
        selectedUser: response.data.data || response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Fetch user details error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch user details",
        isLoading: false,
      });
      toast.error("Failed to fetch user details");
      throw error;
    }
  },

  getUserActivity: async (userId, limit = 10) => {
    try {
      const response = await adminAPI.getUserActivity(userId, { limit });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Fetch user activity error:", error);
      toast.error("Failed to fetch user activity");
      throw error;
    }
  },

  // ORDER MANAGEMENT
  fetchAllOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getAll(params);
      console.log("Fetched orders:", response.data);

      // Handle different response structures
      let ordersData = [];
      if (response.data.data?.orders) {
        ordersData = response.data.data.orders;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data.orders) {
        ordersData = response.data.orders;
      }

      set({ orders: ordersData, isLoading: false });
      return ordersData;
    } catch (error) {
      console.error("Fetch orders error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        isLoading: false,
      });
      toast.error("Failed to fetch orders");
      throw error;
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersAPI.getById(orderId);
      set({
        selectedOrder: response.data.data || response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Fetch order error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch order",
        isLoading: false,
      });
      toast.error("Failed to fetch order");
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await ordersAPI.updateStatus(orderId, status);
      toast.success("Order status updated successfully");

      // Update local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order,
        ),
      }));

      return response.data;
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
      throw error;
    }
  },

  getOrderStats: async () => {
    try {
      const response = await ordersAPI.getStats();
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get order stats error:", error);
      toast.error("Failed to fetch order stats");
      throw error;
    }
  },

  // HELPER FUNCTIONS
  clearSelectedUser: () => set({ selectedUser: null }),
  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));
