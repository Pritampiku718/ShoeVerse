export const emitNewOrder = (io, orderData) => {
  io.to("admin").emit("newOrder", {
    orderId: orderData._id,
    orderNumber: orderData.orderNumber || orderData._id.slice(-8),
    customerName: orderData.user?.name || "Customer",
    total: orderData.totalPrice,
    createdAt: orderData.createdAt,
  });
};

// Emit low stock alert to admin room
export const emitLowStock = (io, productData) => {
  io.to("admin").emit("lowStock", {
    productId: productData._id,
    productName: productData.name,
    stock: productData.stock,
  });
};

// Emit new user registration to admin room
export const emitNewUser = (io, userData) => {
  io.to("admin").emit("newUser", {
    userId: userData._id,
    userName: userData.name,
    email: userData.email,
    createdAt: userData.createdAt,
  });
};

// Emit failed payment notification
export const emitFailedPayment = (io, paymentData) => {
  io.to("admin").emit("failedPayment", {
    orderId: paymentData.orderId,
    orderNumber: paymentData.orderNumber,
    amount: paymentData.amount,
    error: paymentData.error,
  });
};

// Emit successful payment notification
export const emitSuccessfulPayment = (io, paymentData) => {
  io.to("admin").emit("successfulPayment", {
    orderId: paymentData.orderId,
    orderNumber: paymentData.orderNumber,
    amount: paymentData.amount,
  });
};

// Emit stats update to admin room
export const emitStatsUpdate = (io, stats) => {
  io.to("admin").emit("statsUpdate", stats);
};

// Emit order status update to specific user
export const emitOrderStatusUpdate = (io, orderId, status) => {
  io.to(`order-${orderId}`).emit("orderStatusUpdate", {
    orderId,
    status,
    updatedAt: new Date(),
  });
};
