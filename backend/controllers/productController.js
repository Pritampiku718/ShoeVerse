import Product from "../models/Product.js";

/* ======================================
   @desc    Get all products with Filters + Search + Sort
   @route   GET /api/products
   @access  Public
====================================== */
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;

    // ✅ Frontend sends: ?page=1
    const page = Number(req.query.page) || 1;

    /* ================================
       ✅ SEARCH FILTER (keyword)
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
      ? { brand: req.query.category } // Nike, Adidas etc
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
      ...priceFilter,
    };

    /* ================================
       ✅ SORT OPTIONS
    ================================= */
    let sortOption = {};

    if (req.query.sort === "price-low") {
      sortOption = { price: 1 };
    } else if (req.query.sort === "newest") {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { rating: -1 }; // Default Popularity
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
   @desc    Get single product
   @route   GET /api/products/:id
   @access  Public
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
   @desc    Create product
   @route   POST /api/products
   @access  Private/Admin
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
   @desc    Update product
   @route   PUT /api/products/:id
   @access  Private/Admin
====================================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.originalPrice =
        req.body.originalPrice || product.originalPrice;
      product.stock = req.body.stock || product.stock;
      product.images = req.body.images || product.images;
      product.sizes = req.body.sizes || product.sizes;
      product.colors = req.body.colors || product.colors;
      product.isFeatured =
        req.body.isFeatured !== undefined
          ? req.body.isFeatured
          : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   @desc    Delete product
   @route   DELETE /api/products/:id
   @access  Private/Admin
====================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   @desc    Get featured products
   @route   GET /api/products/featured
   @access  Public
====================================== */
export const getFeaturedProducts = async (req, res) => {
  try {
    let products = await Product.find({ isFeatured: true }).limit(8);

    if (products.length === 0) {
      products = await Product.find().limit(4);
    }

    res.json(products);
  } catch (error) {
    console.error("Get featured error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   @desc    Get categories
   @route   GET /api/products/categories
   @access  Public
====================================== */
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
