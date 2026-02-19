import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
    });

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    // Get recent stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: monthAgo } });

    const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });
    const processingOrders = await Order.countDocuments({ orderStatus: "Processing" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "Shipped" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "Cancelled" });

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      pendingOrders,
      processingOrders,
      shippedOrders,
      cancelledOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

// @desc    Get all users with stats
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    
    // Get order counts and total spent for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        
        const totalSpentResult = await Order.aggregate([
          { $match: { user: user._id, orderStatus: "Delivered" } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        
        const totalSpent = totalSpentResult[0]?.total || 0;
        
        const lastOrder = await Order.findOne({ user: user._id })
          .sort({ createdAt: -1 })
          .select('createdAt');
        
        return {
          ...user.toObject(),
          orderCount,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt || null
        };
      })
    );
    
    res.json(usersWithStats);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    // Check if user has orders
    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete user with existing orders. Consider deactivating instead." 
      });
    }
    
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// @desc    Update user (toggle admin, etc.)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't allow removing admin from yourself
    if (user._id.toString() === req.user._id.toString() && req.body.isAdmin === false) {
      return res.status(400).json({ message: "Cannot remove admin status from yourself" });
    }
    
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};