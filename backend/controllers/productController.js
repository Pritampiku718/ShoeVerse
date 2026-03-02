import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import { emitLowStock } from "../service/socketService.js";

//GET ALL PRODUCTS (Search + Filter + Pagination)
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    //SEARCH FILTER
    const keywordFilter = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    //CATEGORY FILTER
    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

  
    //BRAND FILTER
    const brandFilter = req.query.brand ? { brand: req.query.brand } : {};

    //PRICE FILTER
    let priceFilter = {};
    if (req.query.price) {
      const [min, max] = req.query.price.split("-");

      priceFilter = {
        sellPrice: {
          $gte: Number(min),
          $lte: Number(max),
        },
      };
    }

    //COMBINE ALL FILTERS
    const query = {
      ...keywordFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
    };

    //SORT OPTIONS
    let sortOption = {};

    if (req.query.sort === "price-low") {
      sortOption = { sellPrice: 1 };
    } else if (req.query.sort === "price-high") {
      sortOption = { sellPrice: -1 };
    } else if (req.query.sort === "newest") {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    //COUNT PRODUCTS
    const count = await Product.countDocuments(query);

    //FETCH PRODUCTS WITH PAGINATION
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

//GET SINGLE PRODUCT
//GET /api/products/:id
const getProductById = async (req, res) => {
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

//CREATE PRODUCT (Admin)
//POST /api/admin/products
//Admin Only
const createProduct = async (req, res) => {
  try {
    console.log("Creating product with data:", req.body);

    const {
      name,
      brand,
      category,
      sizes,
      stock,
      colors,
      images,
      currentPrice,
      sellPrice,
      description,
      isActive,
    } = req.body;

    // Calculate discount
    const discount =
      currentPrice && sellPrice
        ? Math.round(((currentPrice - sellPrice) / currentPrice) * 100)
        : 0;

    // Calculate total stock
    const totalStock = stock
      ? Object.values(stock).reduce((sum, qty) => sum + (qty || 0), 0)
      : 0;

    const product = new Product({
      name,
      brand,
      category,
      sizes: sizes || [],
      stock: stock || {},
      colors: colors || [],
      images: images || [],
      currentPrice: Number(currentPrice),
      sellPrice: Number(sellPrice),
      discount,
      totalStock,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdProduct = await product.save();

    //Check if product has low stock on creation
    if (createdProduct.totalStock < 10) {
      try {
        const io = req.app.get("io");
        if (io) {
          emitLowStock(io, {
            _id: createdProduct._id,
            name: createdProduct.name,
            stock: createdProduct.totalStock,
          });
          console.log(
            `Low stock alert emitted for new product: ${createdProduct.name} (${createdProduct.totalStock} left)`,
          );
        }
      } catch (socketError) {
        console.error("Failed to emit socket event:", socketError.message);
      }
    }

    res.status(201).json({
      success: true,
      data: createdProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//UPDATE PRODUCT (Admin)
//PUT /api/admin/products/:id
//Admin Only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      brand,
      category,
      sizes,
      stock,
      colors,
      images,
      currentPrice,
      sellPrice,
      description,
      isActive,
    } = req.body;

    // Calculate discount if prices changed
    let discount = product.discount;
    if (currentPrice && sellPrice) {
      discount = Math.round(((currentPrice - sellPrice) / currentPrice) * 100);
    }

    // Calculate total stock
    const previousStock = product.totalStock;
    const totalStock = stock
      ? Object.values(stock).reduce((sum, qty) => sum + (qty || 0), 0)
      : product.totalStock;

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.sizes = sizes || product.sizes;
    product.stock = stock || product.stock;
    product.colors = colors || product.colors;
    product.images = images || product.images;
    product.currentPrice = currentPrice || product.currentPrice;
    product.sellPrice = sellPrice || product.sellPrice;
    product.discount = discount;
    product.totalStock = totalStock;
    product.description = description || product.description;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    const updatedProduct = await product.save();

    //Check if stock dropped below threshold
    if (updatedProduct.totalStock < 10 && previousStock >= 10) {
      try {
        const io = req.app.get("io");
        if (io) {
          emitLowStock(io, {
            _id: updatedProduct._id,
            name: updatedProduct.name,
            stock: updatedProduct.totalStock,
          });
          console.log(
            `Low stock alert emitted: ${updatedProduct.name} (${updatedProduct.totalStock} left)`,
          );
        }
      } catch (socketError) {
        console.error("Failed to emit socket event:", socketError.message);
      }
    }

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//DELETE PRODUCT + CLOUDINARY IMAGES
//DELETE /api/admin/products/:id
//Admin Only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //DELETE IMAGES FROM CLOUDINARY
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          
          // Extract publicId from Cloudinary URL
          const urlParts = imageUrl.split("/");
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split(".")[0];
          const folder = urlParts[urlParts.length - 2];

          if (folder && publicId && folder !== "upload") {
            await cloudinary.uploader.destroy(`${folder}/${publicId}`);
            console.log("Deleted from Cloudinary:", `${folder}/${publicId}`);
          }
        } catch (err) {
          console.error(
            "❌ Cloudinary delete failed for:",
            imageUrl,
            err.message,
          );
        }
      }
    }

    //DELETE PRODUCT FROM DATABASE
    await product.deleteOne();

    // Emit product deletion notification
    try {
      const io = req.app.get("io");
      if (io) {
        io.to("admin").emit("productDeleted", {
          productId: product._id,
          productName: product.name,
          message: `Product "${product.name}" was deleted`,
          timestamp: new Date(),
        });
        console.log(`Product deletion emitted: ${product.name}`);
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//TOGGLE PRODUCT STATUS
//PATCH /api/admin/products/:id/toggle
//Admin Only
const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    //Emit product status change notification
    try {
      const io = req.app.get("io");
      if (io) {
        io.to("admin").emit("productStatusChanged", {
          productId: product._id,
          productName: product.name,
          isActive: product.isActive,
          message: `Product "${product.name}" is now ${product.isActive ? "active" : "inactive"}`,
          timestamp: new Date(),
        });
        console.log(
          `Product status change emitted: ${product.name} -> ${product.isActive ? "active" : "inactive"}`,
        );
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      data: {
        _id: product._id,
        isActive: product.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle product status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET LOW STOCK PRODUCTS
//GET /api/admin/products/low-stock
//Admin Only
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ totalStock: { $lt: 10 } })
      .select("name images totalStock sizes stock")
      .limit(10);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Low stock products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET OUT OF STOCK PRODUCTS
//GET /api/admin/products/out-of-stock
//Admin Only
const getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ totalStock: 0 }).select(
      "name images",
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Out of stock products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//BULK DELETE PRODUCTS
//POST /api/admin/products/bulk-delete
//Admin Only
const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    // Get products before deletion for notification
    const products = await Product.find({ _id: { $in: ids } }).select("name");

    await Product.deleteMany({ _id: { $in: ids } });

    //Emit bulk deletion notification
    try {
      const io = req.app.get("io");
      if (io && products.length > 0) {
        io.to("admin").emit("bulkProductDelete", {
          count: ids.length,
          products: products.map((p) => p.name),
          message: `${ids.length} products deleted`,
          timestamp: new Date(),
        });
        console.log(`Bulk product deletion emitted: ${ids.length} products`);
      }
    } catch (socketError) {
      console.error("Failed to emit socket event:", socketError.message);
    }

    res.json({
      success: true,
      message: `${ids.length} products deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//UPDATE PRODUCT STOCK
//PATCH /api/admin/products/:id/stock
//Admin Only
const updateStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { stock } = req.body;

    const previousStock = product.totalStock;
    product.stock = stock;
    product.totalStock = Object.values(stock).reduce(
      (sum, qty) => sum + (qty || 0),
      0,
    );

    await product.save();

    // Check if stock dropped below threshold
    if (product.totalStock < 10 && previousStock >= 10) {
      try {
        const io = req.app.get("io");
        if (io) {
          emitLowStock(io, {
            _id: product._id,
            name: product.name,
            stock: product.totalStock,
          });
          console.log(
            `Low stock alert emitted: ${product.name} (${product.totalStock} left)`,
          );
        }
      } catch (socketError) {
        console.error("Failed to emit socket event:", socketError.message);
      }
    }

    res.json({
      success: true,
      data: {
        _id: product._id,
        stock: product.stock,
        totalStock: product.totalStock,
      },
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//EXPORT PRODUCTS TO CSV
//GET /api/admin/products/export
//Admin Only
const exportProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    const csvData = products.map((product) => ({
      ID: product._id.toString(),
      Name: product.name,
      Brand: product.brand,
      Category: product.category,
      "Current Price": product.currentPrice,
      "Sell Price": product.sellPrice,
      Discount: `${product.discount}%`,
      "Total Stock": product.totalStock,
      Status: product.isActive ? "Active" : "Inactive",
    }));

    res.json({
      success: true,
      data: csvData,
    });
  } catch (error) {
    console.error("Export products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//FEATURED PRODUCTS
//GET /api/products/featured
//Public
const getFeaturedProducts = async (req, res) => {
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

//GET CATEGORIES
//GET /api/products/categories
//Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//GET BRANDS
//GET /api/products/brands
//Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json(brands);
  } catch (error) {
    console.error("Brands error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//GET NEW ARRIVALS
//GET /api/products/new-arrivals
//Public
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(8);

    res.json(products);
  } catch (error) {
    console.error("New arrivals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//GET BEST SELLERS
//GET /api/products/best-sellers
//Public
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find().limit(8);

    res.json(products);
  } catch (error) {
    console.error("Best sellers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//SEARCH PRODUCTS
//GET /api/products/search
//Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    res.json(products);
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//EXPORT ALL FUNCTIONS - SINGLE EXPORT STATEMENT
export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getLowStockProducts,
  getOutOfStockProducts,
  bulkDeleteProducts,
  updateStock,
  exportProducts,
  getFeaturedProducts,
  getCategories,
  getBrands,
  getNewArrivals,
  getBestSellers,
  searchProducts,
};
