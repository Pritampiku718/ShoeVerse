import { create } from "zustand";
import { ordersAPI } from "../services/api";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set, get) => ({
  
  // State
  orders: [],
  allOrders: [],
  currentOrder: null,
  selectedOrder: null,
  stats: {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  },
  isLoading: false,
  error: null,

  // CREATE ORDER (User)
  createOrder: async (orderData) => {
    console.log("createOrder called with:", orderData);
    set({ isLoading: true });
    try {
      const response = await ordersAPI.create(orderData);
      console.log("API response:", response.data);
      toast.success("Order placed successfully!");
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to place order");
      set({ isLoading: false });
      throw error;
    }
  },

  // FETCH MY ORDERS (User)
  fetchMyOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await ordersAPI.getMyOrders();
      set({ orders: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // FETCH ORDER BY ID (User)
  fetchOrderById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await ordersAPI.getById(id);
      set({ currentOrder: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // CANCEL ORDER (User)
  cancelOrder: async (orderId, reason = "") => {
    set({ isLoading: true, error: null });
    try {
      console.log(`Cancelling order: ${orderId}, reason: ${reason}`);
      const response = await ordersAPI.cancel(orderId, reason);
      console.log("Order cancelled:", response.data);

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "Cancelled",
                cancelledAt: new Date().toISOString(),
                cancellationReason: reason,
              }
            : order,
        ),
        allOrders: state.allOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "Cancelled",
                cancelledAt: new Date().toISOString(),
                cancellationReason: reason,
              }
            : order,
        ),
        currentOrder:
          state.currentOrder?._id === orderId
            ? {
                ...state.currentOrder,
                orderStatus: "Cancelled",
                cancelledAt: new Date().toISOString(),
                cancellationReason: reason,
              }
            : state.currentOrder,
        selectedOrder:
          state.selectedOrder?._id === orderId
            ? {
                ...state.selectedOrder,
                orderStatus: "Cancelled",
                cancelledAt: new Date().toISOString(),
                cancellationReason: reason,
              }
            : state.selectedOrder,
        isLoading: false,
      }));

      // Recalculate stats
      get().calculateStats();

      toast.success("Order cancelled successfully");
      return response.data;
    } catch (error) {
      console.error("Cancel order error:", error);
      console.error("Error response:", error.response?.data);
      set({
        error: error.response?.data?.message || "Failed to cancel order",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Failed to cancel order");
      throw error;
    }
  },

  // FETCH ALL ORDERS (Admin)
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

      set({ allOrders: ordersData, isLoading: false });

      // Calculate stats after fetching
      get().calculateStats(ordersData);

      return ordersData;
    } catch (error) {
      console.error("Failed to fetch all orders:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        isLoading: false,
      });
      toast.error("Failed to fetch orders");
      throw error;
    }
  },

  // CALCULATE STATS (local calculation)
  calculateStats: (ordersData) => {
    const orders = ordersData || get().allOrders || get().orders || [];

    const total = orders.length;
    const pending = orders.filter((o) => o?.orderStatus === "Pending").length;
    const processing = orders.filter(
      (o) => o?.orderStatus === "Processing",
    ).length;
    const shipped = orders.filter((o) => o?.orderStatus === "Shipped").length;
    const delivered = orders.filter(
      (o) => o?.orderStatus === "Delivered",
    ).length;
    const cancelled = orders.filter(
      (o) => o?.orderStatus === "Cancelled",
    ).length;

    const totalRevenue = orders
      .filter((o) => o?.orderStatus === "Delivered")
      .reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

    const averageOrderValue = delivered > 0 ? totalRevenue / delivered : 0;

    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => o?.createdAt && new Date(o.createdAt).toDateString() === today,
    ).length;

    const todayRevenue = orders
      .filter((o) => {
        return (
          o?.createdAt &&
          new Date(o.createdAt).toDateString() === today &&
          o?.orderStatus === "Delivered"
        );
      })
      .reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

    set({
      stats: {
        total,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalRevenue,
        averageOrderValue: averageOrderValue.toFixed(2),
        todayOrders,
        todayRevenue,
      },
    });
  },

  // GET ORDER STATS (Admin)
  getOrderStats: async () => {
    try {
      const response = await ordersAPI.getStats().catch(() => null);
      if (response?.data) {
        set({ stats: response.data.data || response.data });
        return response.data;
      }
      
      // Fallback to local calculation
      get().calculateStats();
      return get().stats;
    } catch (error) {
      console.error("Failed to fetch order stats:", error);
      
      // Fallback to local calculation
      get().calculateStats();
      return get().stats;
    }
  },

  // UPDATE ORDER STATUS (Admin)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await ordersAPI.updateStatus(id, status);
      toast.success("Order status updated successfully");

      // Update local state
      set((state) => ({
        allOrders: state.allOrders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order,
        ),
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order,
        ),
        selectedOrder:
          state.selectedOrder?._id === id
            ? { ...state.selectedOrder, orderStatus: status }
            : state.selectedOrder,
        currentOrder:
          state.currentOrder?._id === id
            ? { ...state.currentOrder, orderStatus: status }
            : state.currentOrder,
      }));

      // Recalculate stats
      get().calculateStats();

      return response.data;
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
      throw error;
    }
  },

  // DELETE ORDER (Admin)
  deleteOrder: async (id) => {
    try {
      await ordersAPI.delete(id);
      toast.success("Order deleted successfully");

      // Update local state
      set((state) => ({
        allOrders: state.allOrders.filter((order) => order._id !== id),
        orders: state.orders.filter((order) => order._id !== id),
        selectedOrder:
          state.selectedOrder?._id === id ? null : state.selectedOrder,
        currentOrder:
          state.currentOrder?._id === id ? null : state.currentOrder,
      }));

      // Recalculate stats
      get().calculateStats();

      return true;
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
      throw error;
    }
  },

  // BULK UPDATE STATUS (Admin)
  bulkUpdateStatus: async (orderIds, status) => {
    try {
      const response = await ordersAPI.bulkUpdateStatus({ orderIds, status });
      toast.success(`${orderIds.length} orders updated successfully`);

      // Update local state
      set((state) => ({
        allOrders: state.allOrders.map((order) =>
          orderIds.includes(order._id)
            ? { ...order, orderStatus: status }
            : order,
        ),
        orders: state.orders.map((order) =>
          orderIds.includes(order._id)
            ? { ...order, orderStatus: status }
            : order,
        ),
      }));

      // Recalculate stats
      get().calculateStats();

      return response.data;
    } catch (error) {
      console.error("Bulk update error:", error);
      toast.error(error.response?.data?.message || "Failed to update orders");
      throw error;
    }
  },

  // FETCH ORDER BY ID (Admin)
  fetchAdminOrderById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await ordersAPI.getById(id);
      set({
        selectedOrder: response.data.data || response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      set({ isLoading: false });
      toast.error("Failed to fetch order details");
      throw error;
    }
  },

  // EXPORT ORDERS
  exportOrders: async (ordersToExport) => {
    try {
      const orders = ordersToExport || get().allOrders || get().orders || [];

      // Format data for export
      const exportData = orders.map((order) => ({
        "Order ID": order.orderNumber || order._id?.slice(-8) || "N/A",
        Date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A",
        Customer: order.user?.name || "Guest",
        Email: order.user?.email || "N/A",
        Total: order.totalPrice || 0,
        Status: order.orderStatus || "N/A",
        Payment: order.isPaid ? "Paid" : "Unpaid",
        Items: order.orderItems?.length || 0,
        "Shipping Address": order.shippingAddress?.address || "N/A",
        City: order.shippingAddress?.city || "N/A",
        Phone:
          order.shippingAddress?.phoneNumber ||
          order.shippingAddress?.phone ||
          "N/A",
      }));

      return exportData;
    } catch (error) {
      console.error("Export orders error:", error);
      toast.error("Failed to export orders");
      throw error;
    }
  },

  // CLEAR FUNCTIONS
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },

  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
