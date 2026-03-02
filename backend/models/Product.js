import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hex: {
    type: String,
    required: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Please add a brand"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["running", "sports", "casual", "formal", "Boots", "Sneakers"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    currentPrice: {
      type: Number,
      required: [true, "Please add current price"],
      min: 0,
    },
    sellPrice: {
      type: Number,
      required: [true, "Please add sell price"],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Map,
      of: Number,
      default: {},
    },
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [{
      type: String,
      required: true
    }],
    sizes: [{
      type: String,
      enum: ["US 6", "US 7", "US 8", "US 9", "US 10"],
    }],
    colors: [colorSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;