import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },

        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },

        size: Number,
        color: String,
      },
    ],

    /* ✅ FULL SHIPPING ADDRESS */
    shippingAddress: {
      fullName: { type: String },
      phoneNumber: { type: String },
      landmark: { type: String },

      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true,
      default: "Cash on Delivery",
    },

    /* ✅ PRICE DETAILS */
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    /* ✅ PAYMENT STATUS */
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    /* ✅ DELIVERY STATUS */
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,

    /* ✅ ORDER STATUS */
    orderStatus: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
