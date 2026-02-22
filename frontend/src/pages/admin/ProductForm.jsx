// frontend/src/pages/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiX,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiImage,
  FiSave
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useProducts } from '../../hooks/useProducts';
import { uploadImage } from '../../services/cloudinary';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'running',
    sizes: [],
    stock: {},
    colors: [],
    images: [],
    currentPrice: '',
    sellPrice: '',
    description: '',
    isActive: true
  });

  const [colorInput, setColorInput] = useState({ name: '', hex: '#000000' });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  const { createProduct, updateProduct } = useProducts();

  const categories = ['running', 'sports', 'casual', 'formal'];
  const sizeOptions = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'];

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSelectedSizes(product.sizes || []);
      setStockInputs(product.stock || {});
    }
  }, [product]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (colorInput.name && colorInput.hex) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { ...colorInput }]
      }));
      setColorInput({ name: '', hex: '#000000' });
    }
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
      // Update form data
      setFormData(prevForm => ({
        ...prevForm,
        sizes: newSizes
      }));
      
      return newSizes;
    });
  };

  const handleStockChange = (size, value) => {
    setStockInputs(prev => ({
      ...prev,
      [size]: parseInt(value) || 0
    }));
    
    setFormData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: parseInt(value) || 0
      }
    }));
  };

  const calculateDiscount = () => {
    if (formData.currentPrice && formData.sellPrice) {
      const discount = ((formData.currentPrice - formData.sellPrice) / formData.currentPrice * 100).toFixed(0);
      return discount > 0 ? discount : 0;
    }
    return 0;
  };

  const calculateTotalStock = () => {
    return Object.values(stockInputs).reduce((sum, stock) => sum + (stock || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        discount: calculateDiscount(),
        totalStock: calculateTotalStock()
      };

      if (product) {
        await updateProduct(product._id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(product ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sizes and Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Sizes & Stock
            </label>
            <div className="grid grid-cols-5 gap-4">
              {sizeOptions.map(size => (
                <div key={size} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedSizes.includes(size)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                  {selectedSizes.includes(size) && (
                    <input
                      type="number"
                      min="0"
                      value={stockInputs[size] || ''}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      placeholder="Stock"
                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Total Stock: {calculateTotalStock()}
            </p>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Colors
            </label>
            <div className="flex gap-4 mb-3">
              <input
                type="text"
                value={colorInput.name}
                onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                placeholder="Color name"
                className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="color"
                value={colorInput.hex}
                onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                className="w-16 h-10 bg-gray-700/50 border border-gray-600 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiPlus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full"
                >
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-white">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Product Images
            </label>
            <div className="grid grid-cols-4 gap-4 mb-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={12} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-600 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
                ) : (
                  <>
                    <FiUpload className="text-gray-400 mb-1" size={20} />
                    <span className="text-xs text-gray-400">Upload</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sell Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Discount
              </label>
              <div className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
                {calculateDiscount()}%
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-400">Status</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.isActive ? 'translate-x-6' : ''
                }`}
              />
            </button>
            <span className="text-sm text-white">
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <FiSave size={18} />
              )}
              {product ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;