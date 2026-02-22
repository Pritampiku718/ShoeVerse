import { create } from "zustand";
import { productsAPI } from "../services/api";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  isLoading: false,
  totalPages: 1,
  currentPage: 1,
  filters: {
    keyword: "",
    category: "",
    brand: "",
    price: "",
    sort: "newest",
    page: 1,
  },

  // Fetch all products
  // Fetch all products
  fetchProducts: async (params = {}) => {
    console.log("🔵 Fetching products with params:", params);
    set({ isLoading: true });

    try {
      // Merge filters with params
      const queryParams = { ...get().filters, ...params };
      console.log("📤 Sending request with:", queryParams);

      const response = await productsAPI.getAll(queryParams);
      console.log("📦 API Response:", response);
      console.log("📦 Response data:", response.data);

      // ✅ FIXED STRUCTURE MATCH WITH YOUR BACKEND
      if (response.data && response.data.products) {
        const productsData = response.data.products || [];

        console.log("✅ Products received:", productsData.length);

        set({
          products: productsData,
          totalPages: response.data.pages || 1,
          currentPage: response.data.page || 1,
          isLoading: false,
        });
      } else {
        console.error("❌ Unexpected response structure:", response.data);

        set({
          products: [],
          totalPages: 1,
          currentPage: 1,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      console.error("Error details:", error.response?.data || error.message);

      toast.error("Failed to load products");

      set({
        products: [],
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
      });
    }
  },
  // Fetch featured products
  fetchFeaturedProducts: async () => {
    try {
      const response = await productsAPI.getFeatured();
      if (response.data && response.data.success) {
        set({ featuredProducts: response.data.data || [] });
      } else {
        set({ featuredProducts: [] });
      }
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      set({ featuredProducts: [] });
    }
  },

  // Fetch single product
fetchProductById: async (id) => {
  set({ isLoading: true });

  try {
    const response = await productsAPI.getOne(id);
    console.log("📦 Single Product Response:", response.data);

    // ✅ Since backend returns product directly
    if (response.data && response.data._id) {
      set({
        currentProduct: response.data,
        isLoading: false
      });
    } else {
      toast.error("Product not found");
      set({ isLoading: false });
    }

  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    toast.error("Product not found");
    set({ isLoading: false });
  }
},
  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await productsAPI.getCategories();
      if (response.data && response.data.success) {
        set({ categories: response.data.data || [] });
      } else {
        set({ categories: [] });
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set({ categories: [] });
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const response = await productsAPI.create(productData);
      toast.success("Product created successfully");
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
      set({ isLoading: false });
      throw error;
    }
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    try {
      const response = await productsAPI.update(id, productData);
      toast.success("Product updated successfully");
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
      set({ isLoading: false });
      throw error;
    }
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    try {
      await productsAPI.delete(id);
      toast.success("Product deleted successfully");
      // Refresh products
      get().fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
      throw error;
    }
  },

  // Update filters
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters, page: 1 } });
    get().fetchProducts();
  },

  // Set page
  setPage: (page) => {
    set({ filters: { ...get().filters, page } });
    get().fetchProducts();
  },

  // Clear current product
  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
