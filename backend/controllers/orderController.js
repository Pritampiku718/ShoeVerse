import Order from "../models/Order.js";

/* ================================
   ✅ CREATE ORDER (User)
================================ */
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,

      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,

      orderStatus: "Processing",
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order Create Error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ================================
   ✅ GET MY ORDERS (User)
================================ */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("My Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================================
   ✅ GET ORDER BY ID
================================ */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Order By ID Error:", error);
    res.status(500).json({ message: "Order fetch failed" });
  }
};

/* ================================
   ✅ ADMIN: GET ALL ORDERS
================================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

/* ================================
   ✅ ADMIN: UPDATE ORDER STATUS
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Update Status
    order.orderStatus = orderStatus || order.orderStatus;

    // ✅ If Delivered
    if (orderStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // ✅ If Cancelled
    if (orderStatus === "Cancelled") {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Order Status Update Error:", error);
    res.status(500).json({ message: "Order status update failed" });
  }
};

/* ================================
   ✅ ADMIN: DELETE ORDER
================================ */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Order delete failed" });
  }
};