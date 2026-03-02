import Order from "../models/Order.js";
import { emitNewOrder } from "../service/socketService.js";

//CREATE ORDER (User)
export const createOrder = async (req, res) => {
  try {
    console.log(
      "Creating order with data:",
      JSON.stringify(req.body, null, 2),
    );

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

    // Map frontend shippingAddress to match model
    const mappedShippingAddress = {
      fullName: shippingAddress.fullName || "",
      phoneNumber: shippingAddress.phoneNumber || shippingAddress.phone || "", // Handle both field names
      landmark: shippingAddress.apartment || "", // Map apartment to landmark
      address: shippingAddress.address || "",
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      zipCode: shippingAddress.zipCode || "",
      country: shippingAddress.country || "",
    };

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: mappedShippingAddress, // Use the mapped address
      paymentMethod: paymentMethod || "Cash on Delivery",

      itemsPrice: itemsPrice || 0,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || 0,

      orderStatus: "Processing",
    });

    const createdOrder = await order.save();
    console.log("Order created successfully:", createdOrder._id);

    // Emit socket event for new order
    try {
      const io = req.app.get("io");
      if (io) {
        emitNewOrder(io, createdOrder);
        console.log("New order notification emitted to admin room");
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);  
    }
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order Create Error:", error);
    console.error("Error details:", error.message);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Order creation failed" });
  }
};


//CANCEL ORDER (User)
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Order can be cancelled (only Processing orders)
    if (order.orderStatus !== "Processing") {
      return res.status(400).json({
        message: "Only orders in 'Processing' status can be cancelled",
      });
    }

    // Update order status
    order.orderStatus = "Cancelled";
    order.cancelledAt = Date.now();
    order.cancellationReason = reason || "No reason provided";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};


//GET MY ORDERS (User)
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

//GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
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

//ADMIN WILL GET ALL ORDERS
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

// ADMIN UPDATE ORDER STATUS (with auto-payment)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update Status
    order.orderStatus = orderStatus || order.orderStatus;

    // If Delivered - update delivery and mark as paid
    if (orderStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // AUTO-MARK AS PAID
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    // If Cancelled
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

// ADMIN DELETE ORDER
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
