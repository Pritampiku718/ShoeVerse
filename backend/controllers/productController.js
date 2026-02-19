import Product from "../models/Product.js";
import {v2 as cloudinary} from "cloudinary";

/* ======================================
   ✅ GET ALL PRODUCTS (Search + Filter + Pagination)
   GET /api/products
   Public
====================================== */
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    /* ================================
       ✅ SEARCH FILTER
    ================================= */
    const keywordFilter = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    /* ================================
       ✅ CATEGORY FILTER
    ================================= */
    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    /* ================================
       ✅ BRAND FILTER
    ================================= */
    const brandFilter = req.query.brand
      ? { brand: req.query.brand }
      : {};

    /* ================================
       ✅ PRICE FILTER
       Example: price=2000-5000
    ================================= */
    let priceFilter = {};
    if (req.query.price) {
      const [min, max] = req.query.price.split("-");

      priceFilter = {
        price: {
          $gte: Number(min),
          $lte: Number(max),
        },
      };
    }

    /* ================================
       ✅ COMBINE ALL FILTERS
    ================================= */
    const query = {
      ...keywordFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
    };

    /* ================================
       ✅ SORT OPTIONS
    ================================= */
    let sortOption = {};

    if (req.query.sort === "price-low") {
      sortOption = { price: 1 };
    } else if (req.query.sort === "price-high") {
      sortOption = { price: -1 };
    } else if (req.query.sort === "newest") {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { rating: -1 };
    }

    /* ================================
       ✅ COUNT PRODUCTS
    ================================= */
    const count = await Product.countDocuments(query);

    /* ================================
       ✅ FETCH PRODUCTS WITH PAGINATION
    ================================= */
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   ✅ GET SINGLE PRODUCT
   GET /api/products/:id
   Public
====================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   ✅ CREATE PRODUCT
   POST /api/products
   Admin Only
====================================== */
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      stock: req.body.stock,

      // ✅ Images Stored as Objects (Cloudinary)
      images: req.body.images || [],

      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      isFeatured: req.body.isFeatured || false,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   ✅ UPDATE PRODUCT
   PUT /api/products/:id
   Admin Only
====================================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.originalPrice =
      req.body.originalPrice || product.originalPrice;
    product.stock = req.body.stock || product.stock;

    // ✅ Keep Images as Object Array
    product.images = req.body.images || product.images;

    product.sizes = req.body.sizes || product.sizes;
    product.colors = req.body.colors || product.colors;

    product.isFeatured =
      req.body.isFeatured !== undefined
        ? req.body.isFeatured
        : product.isFeatured;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   ✅ DELETE PRODUCT + CLOUDINARY IMAGES
   DELETE /api/products/:id
   Admin Only
====================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    /* ======================================
       ✅ DELETE IMAGES FROM CLOUDINARY
    ====================================== */
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.publicId) {
          try {
            await cloudinary.v2.uploader.destroy(img.publicId);
            console.log("✅ Deleted from Cloudinary:", img.publicId);
          } catch (err) {
            console.error(
              "❌ Cloudinary delete failed for:",
              img.publicId,
              err.message
            );
          }
        }
      }
    }

    /* ======================================
       ✅ DELETE PRODUCT FROM DATABASE
    ====================================== */
    await product.deleteOne();

    res.json({
      message: "Product and images deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   ✅ FEATURED PRODUCTS
   GET /api/products/featured
   Public
====================================== */
export const getFeaturedProducts = async (req, res) => {
  try {
    let products = await Product.find({ isFeatured: true }).limit(8);

    if (products.length === 0) {
      products = await Product.find().limit(4);
    }

    res.json(products);
  } catch (error) {
    console.error("Featured products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   ✅ GET CATEGORIES
   GET /api/products/categories
   Public
====================================== */
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
