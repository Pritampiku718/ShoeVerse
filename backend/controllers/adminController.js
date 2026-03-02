import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import {
  emitLowStock,
  emitNewUser,
  emitStatsUpdate,
} from "../service/socketService.js";

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Only count delivered orders for revenue
    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
    });

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );

    // Calculate average order value
    const averageOrderValue =
      deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

    // Get recent stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo },
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthAgo },
    });

    // Order status counts
    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });
    const deliveredOrdersCount = await Order.countDocuments({
      orderStatus: "Delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });
    const refundedOrders = await Order.countDocuments({
      orderStatus: "Refunded",
    });

    // Get recent orders for dashboard
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("orderNumber totalPrice orderStatus createdAt");

    // Get low stock products (less than 10 units)
    const lowStockProducts = await Product.find({ totalStock: { $lt: 10 } })
      .select("name images totalStock")
      .limit(5);

    // Get top products by sales
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          revenue: 1,
          "product.name": 1,
          "product.images": 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
          averageOrderValue,
        },
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrdersCount,
          cancelled: cancelledOrders,
          refunded: refundedOrders,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts.length,
        },
        recentOrders,
        lowStockProducts,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Dashboard stats error",
    });
  }
};

// Revenue Analytics
export const getRevenueSummary = async (req, res) => {
  try {
    // Total revenue from delivered orders
    const deliveredOrders = await Order.find({ orderStatus: "Delivered" });
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );
    const totalOrders = deliveredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly revenue (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Quarterly revenue
    const quarterlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            quarter: {
              $ceil: { $divide: [{ $month: "$createdAt" }, 3] },
            },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.quarter": -1 } },
      { $limit: 4 },
    ]);

    res.json({
      success: true,
      data: {
        total: totalRevenue,
        averageOrderValue,
        daily: dailyRevenue,
        monthly: monthlyRevenue,
        quarterly: quarterlyRevenue,
      },
    });
  } catch (error) {
    console.error("Revenue summary error:", error);
    res.status(500).json({
      success: false,
      message: "Revenue summary error",
    });
  }
};

export const getRevenueByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { orderStatus: "Delivered" };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const revenue = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: revenue[0] || { total: 0, orders: 0 },
    });
  } catch (error) {
    console.error("Revenue by range error:", error);
    res.status(500).json({
      success: false,
      message: "Revenue by range error",
    });
  }
};

// Get revenue by product
// GET/api/admin/revenue/products
// Private/Admin
export const getRevenueByProduct = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const revenueByProduct = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
          quantity: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          revenue: 1,
          quantity: 1,
          "product.name": 1,
          "product.images": 1,
          "product.sellPrice": 1,
          "product.category": 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: revenueByProduct,
    });
  } catch (error) {
    console.error("Revenue by product error:", error);
    res.status(500).json({
      success: false,
      message: "Revenue by product error",
    });
  }
};

// Get revenue by category
// GET /api/admin/revenue/categories
// Private/Admin
export const getRevenueByCategory = async (req, res) => {
  try {
    const revenueByCategory = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      success: true,
      data: revenueByCategory,
    });
  } catch (error) {
    console.error("Revenue by category error:", error);
    res.status(500).json({
      success: false,
      message: "Revenue by category error",
    });
  }
};

// Get revenue by payment method
// GET /api/admin/revenue/payment-methods
// Private/Admin
export const getRevenueByPaymentMethod = async (req, res) => {
  try {
    const revenueByPayment = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      {
        $group: {
          _id: "$paymentMethod",
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: revenueByPayment,
    });
  } catch (error) {
    console.error("Revenue by payment method error:", error);
    res.status(500).json({
      success: false,
      message: "Revenue by payment method error",
    });
  }
};

// Get revenue forecast
// GET /api/admin/revenue/forecast
// Private/Admin
export const getRevenueForecast = async (req, res) => {
  try {
    const { months = 3 } = req.query;

    // Get historical data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historicalData = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate growth rate
    let growthRate = 0.05; // Default 5% growth
    if (historicalData.length >= 2) {
      const lastMonth = historicalData[historicalData.length - 1].revenue;
      const previousMonth = historicalData[historicalData.length - 2].revenue;
      growthRate = (lastMonth - previousMonth) / previousMonth;
    }

    // Generate forecast
    const lastDate =
      historicalData.length > 0
        ? new Date(historicalData[historicalData.length - 1]._id + "-01")
        : new Date();

    const lastRevenue =
      historicalData.length > 0
        ? historicalData[historicalData.length - 1].revenue
        : 0;

    const forecast = [];
    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);

      forecast.push({
        month: forecastDate.toISOString().slice(0, 7),
        forecast: lastRevenue * Math.pow(1 + growthRate, i),
      });
    }

    res.json({
      success: true,
      data: {
        historical: historicalData,
        forecast,
        growthRate,
      },
    });
  } catch (error) {
    console.error("Revenue forecast error:", error);
    res.status(500).json({
      success: false,
      message: "Revenue forecast error",
    });
  }
};

// Get real-time revenue
// GET /api/admin/revenue/realtime
// Private/Admin
export const getRealtimeRevenue = async (req, res) => {
  try {
    
    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    // Last hour revenue
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const lastHourRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: oneHourAgo },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        today: todayRevenue[0] || { revenue: 0, orders: 0 },
        lastHour: lastHourRevenue[0] || { revenue: 0, orders: 0 },
      },
    });
  } catch (error) {
    console.error("Real-time revenue error:", error);
    res.status(500).json({
      success: false,
      message: "Real-time revenue error",
    });
  }
};

// User Management
// Get all users with stats
// GET /api/admin/users
// Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const status = req.query.status || "";

    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role === "admin") {
      query.isAdmin = true;
    } else if (role === "user") {
      query.isAdmin = false;
    }

    // Filter by status
    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Get order counts and total spent for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });

        const totalSpentResult = await Order.aggregate([
          { $match: { user: user._id, orderStatus: "Delivered" } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        const totalSpent = totalSpentResult[0]?.total || 0;

        const lastOrder = await Order.findOne({ user: user._id })
          .sort({ createdAt: -1 })
          .select("createdAt");

        return {
          ...user.toObject(),
          orderCount,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt || null,
        };
      }),
    );

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get user details
// GET /api/admin/users/:id
// Private/Admin
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's orders
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate total spent
    const totalSpentResult = await Order.aggregate([
      { $match: { user: user._id, orderStatus: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalSpent = totalSpentResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        user,
        orders,
        stats: {
          totalOrders: await Order.countDocuments({ user: user._id }),
          totalSpent,
          memberSince: user.createdAt,
          lastActive: user.lastLogin || user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

// Update user
// PUT /api/admin/users/:id
// Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow removing admin from yourself
    if (
      user._id.toString() === req.user._id.toString() &&
      req.body.isAdmin === false
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove admin status from yourself",
      });
    }

    user.isAdmin =
      req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isActive =
      req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// Delete user
// DELETE /api/admin/users/:id
// Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // Check if user has orders
    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0) {
      
      // Soft delete - just deactivate
      user.isActive = false;
      await user.save();

      return res.json({
        success: true,
        message: "User has orders, account deactivated instead",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// Toggle user block status
// PATCH /api/admin/users/:id/toggle-block
// Private/Admin
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow blocking yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot block your own account",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Emit user status update to admin room
    try {
      const io = req.app.get("io");
      if (io) {
        io.to("admin").emit("userStatusUpdate", {
          userId: user._id,
          name: user.name,
          isActive: user.isActive,
          message: `User ${user.name} ${user.isActive ? "unblocked" : "blocked"}`,
          timestamp: new Date(),
        });
        console.log(
          `User status update emitted: ${user.name} ${user.isActive ? "unblocked" : "blocked"}`,
        );
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        isActive: user.isActive,
        message: `User ${user.isActive ? "unblocked" : "blocked"} successfully`,
      },
    });
  } catch (error) {
    console.error("Toggle user block error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle user status",
    });
  }
};

// Get user activity
// GET /api/admin/users/:id/activity
// Private/Admin
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(userId).select(
      "name email lastLogin createdAt",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("orderNumber totalPrice orderStatus createdAt");

    res.json({
      success: true,
      data: {
        user,
        activity: {
          lastLogin: user.lastLogin,
          recentOrders,
          totalOrders: await Order.countDocuments({ user: userId }),
          memberSince: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
    });
  }
};

// Export users to CSV
// GET /api/admin/users/export/csv
// Private/Admin
export const exportUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const csvData = users.map((user) => ({
      ID: user._id.toString(),
      Name: user.name,
      Email: user.email,
      Role: user.isAdmin ? "Admin" : "User",
      Status: user.isActive ? "Active" : "Blocked",
      "Join Date": user.createdAt.toISOString().split("T")[0],
      "Last Login": user.lastLogin?.toISOString().split("T")[0] || "Never",
    }));

    res.json({
      success: true,
      data: csvData,
    });
  } catch (error) {
    console.error("Export users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export users",
    });
  }
};

// Order Management
// Get all orders with pagination and filters
// GET /api/admin/orders
// Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};

    // Filter by status
    if (status && status !== "all") {
      query.orderStatus = status;
    }

    // Search by order ID or customer name/email
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order details by ID
// GET /api/admin/orders/:id
// Private/Admin
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name brand images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status (with auto-payment for Delivered)
// PUT /api/admin/orders/:id/status
// Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    // If status is Delivered, update delivery info AND mark as paid
    if (orderStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      // AUTO-MARK AS PAID
      order.isPaid = true;
      order.paidAt = new Date();
    }

    // If status is Cancelled, make sure it's not marked as delivered/paid
    if (orderStatus === "Cancelled") {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    await order.save();

    //Emit order status update to relevant rooms
    try {
      const io = req.app.get("io");
      if (io) {
        
        // Notify admin room
        io.to("admin").emit("orderStatusUpdate", {
          orderId: order._id,
          orderNumber: order.orderNumber || order._id.slice(-8),
          status: orderStatus,
          customerName: order.user?.name || "Customer",
          updatedAt: new Date(),
        });

        // Notify specific user if they're connected
        if (order.user) {
          io.to(`order-${order._id}`).emit("userOrderUpdate", {
            orderId: order._id,
            status: orderStatus,
            updatedAt: new Date(),
          });
        }

        console.log(
          `Order status update emitted: ${order._id} -> ${orderStatus}`,
        );
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete order
// DELETE /api/admin/orders/:id
// Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    // Emit order deletion notification
    try {
      const io = req.app.get("io");
      if (io) {
        io.to("admin").emit("orderDeleted", {
          orderId: order._id,
          orderNumber: order.orderNumber || order._id.slice(-8),
          message: `Order deleted by admin`,
          timestamp: new Date(),
        });
        console.log(`Order deletion emitted: ${order._id}`);
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order statistics
// GET /api/admin/orders/stats
// Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: today },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      success: true,
      data: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        averageOrderValue:
          deliveredOrders > 0
            ? (totalRevenue[0]?.total || 0) / deliveredOrders
            : 0,
      },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk update orders
// PATCH /api/admin/orders/bulk-update
// Private/Admin
export const bulkUpdateOrders = async (req, res) => {
  try {
    const { orderIds, orderStatus } = req.body;

    if (!orderIds || !orderIds.length || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order IDs and status are required",
      });
    }

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { orderStatus },
    );

    // Emit bulk update notification
    try {
      const io = req.app.get("io");
      if (io && result.modifiedCount > 0) {
        io.to("admin").emit("bulkOrderUpdate", {
          orderIds,
          status: orderStatus,
          count: result.modifiedCount,
          message: `${result.modifiedCount} orders updated to ${orderStatus}`,
          timestamp: new Date(),
        });
        console.log(
          `Bulk order update emitted: ${result.modifiedCount} orders -> ${orderStatus}`,
        );
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
