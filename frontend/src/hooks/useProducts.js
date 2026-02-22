// frontend/src/hooks/useProducts.js
import { useState } from 'react';
import { productsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all products with filters
  const getProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getAll(params);
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single product by ID
  const getProductById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getOne(id);
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      let dataToSend = productData;
      
      // If there are files, use FormData
      if (productData.images && productData.images.length > 0 && productData.images[0] instanceof File) {
        const formData = new FormData();
        
        // Append all fields
        Object.keys(productData).forEach(key => {
          if (key === 'images') {
            productData.images.forEach(image => {
              formData.append('images', image);
            });
          } else if (key === 'colors' || key === 'sizes' || key === 'stock') {
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        });
        
        dataToSend = formData;
      }
      
      const response = await productsAPI.create(dataToSend);
      toast.success('Product created successfully');
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    
    try {
      let dataToSend = productData;
      
      // If there are new files, use FormData
      if (productData.newImages && productData.newImages.length > 0) {
        const formData = new FormData();
        
        // Append all fields
        Object.keys(productData).forEach(key => {
          if (key === 'newImages') {
            productData.newImages.forEach(image => {
              formData.append('images', image);
            });
          } else if (key === 'colors' || key === 'sizes' || key === 'stock') {
            formData.append(key, JSON.stringify(productData[key]));
          } else if (key !== 'images') {
            formData.append(key, productData[key]);
          }
        });
        
        // Append existing images as JSON
        if (productData.images) {
          formData.append('existingImages', JSON.stringify(productData.images));
        }
        
        dataToSend = formData;
      }
      
      const response = await productsAPI.update(id, dataToSend);
      toast.success('Product updated successfully');
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle product status (active/inactive)
  const toggleProductStatus = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.toggleStatus(id);
      toast.success('Product status updated');
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to toggle product status';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete products
  const bulkDeleteProducts = async (ids) => {
    setLoading(true);
    setError(null);
    
    try {
      await productsAPI.bulkDelete({ ids });
      toast.success(`${ids.length} products deleted successfully`);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get low stock products
  const getLowStockProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getLowStock(params);
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch low stock products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get out of stock products
  const getOutOfStockProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getOutOfStock();
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch out of stock products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product stock
  const updateStock = async (id, stockData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.updateStock(id, stockData);
      toast.success('Stock updated successfully');
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update stock';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Export products to CSV
  const exportProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.exportCSV(params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Products exported successfully');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to export products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get product categories
  const getCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getCategories();
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch categories';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get product brands
  const getBrands = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getBrands();
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch brands';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.search(query);
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to search products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get featured products
  const getFeaturedProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getFeatured();
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch featured products';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get new arrivals
  const getNewArrivals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getNewArrivals();
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch new arrivals';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get best sellers
  const getBestSellers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getBestSellers();
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch best sellers';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    loading,
    error,
    
    // CRUD Operations
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    
    // Bulk Operations
    bulkDeleteProducts,
    
    // Stock Management
    getLowStockProducts,
    getOutOfStockProducts,
    updateStock,
    
    // Export
    exportProducts,
    
    // Filters & Categories
    getCategories,
    getBrands,
    searchProducts,
    
    // Featured Collections
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers
  };
};