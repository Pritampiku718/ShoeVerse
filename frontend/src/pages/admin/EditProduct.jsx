// frontend/src/pages/admin/EditProduct.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiImage,
  FiTag,
  FiPackage,
  FiDollarSign,
  FiPercent,
  FiEdit3,
  FiLoader
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useProducts } from '../../hooks/useProducts';
import { uploadImage } from '../../services/cloudinary';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProductById, updateProduct, loading } = useProducts();
  
  const [formLoading, setFormLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
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

  const categories = ['running', 'sports', 'casual', 'formal'];
  const sizeOptions = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'];

  // Fetch product data on mount
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setFormLoading(true);
    try {
      const product = await getProductById(id);
      
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || 'running',
        sizes: product.sizes || [],
        stock: product.stock || {},
        colors: product.colors || [],
        images: product.images || [],
        currentPrice: product.currentPrice || '',
        sellPrice: product.sellPrice || '',
        description: product.description || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });

      setSelectedSizes(product.sizes || []);
      setStockInputs(product.stock || {});
      
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setFormLoading(false);
    }
  };

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
      
      setFormData(prevForm => ({
        ...prevForm,
        sizes: newSizes
      }));
      
      return newSizes;
    });
  };

  const handleStockChange = (size, value) => {
    const numValue = parseInt(value) || 0;
    setStockInputs(prev => ({
      ...prev,
      [size]: numValue
    }));
    
    setFormData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: numValue
      }
    }));
  };

  const calculateDiscount = () => {
    if (formData.currentPrice && formData.sellPrice) {
      const current = parseFloat(formData.currentPrice);
      const sell = parseFloat(formData.sellPrice);
      if (current > 0 && sell > 0 && sell < current) {
        const discount = ((current - sell) / current * 100).toFixed(0);
        return discount;
      }
    }
    return 0;
  };

  const calculateTotalStock = () => {
    return Object.values(stockInputs).reduce((sum, stock) => sum + (stock || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        currentPrice: parseFloat(formData.currentPrice),
        sellPrice: parseFloat(formData.sellPrice),
        discount: calculateDiscount(),
        totalStock: calculateTotalStock()
      };

      await updateProduct(id, productData);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-primary-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiX size={20} className="text-gray-400" />
        </button>
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiEdit3 className="text-primary-500" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Nike Air Max 270"
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
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Nike"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.category === cat
                            ? 'bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                        }`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sizes and Stock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiPackage className="text-green-500" />
                Sizes & Stock
              </h2>

              <div className="grid grid-cols-5 gap-4">
                {sizeOptions.map(size => (
                  <div key={size} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
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
                        placeholder="Qty"
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400">Total Stock</p>
                <p className="text-2xl font-bold text-white">{calculateTotalStock()} units</p>
              </div>
            </motion.div>

            {/* Colors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Colors</h2>
              
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={colorInput.name}
                  onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                  placeholder="Color name (e.g., Black)"
                  className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="color"
                  value={colorInput.hex}
                  onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                  className="w-16 h-10 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  Add
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
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter product description..."
                required
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiImage className="text-purple-500" />
                Product Images
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-gray-600 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                  ) : (
                    <>
                      <FiUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-xs text-gray-400">Click to upload</span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500">Upload up to 5 images (JPEG, PNG)</p>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiDollarSign className="text-yellow-500" />
                Pricing
              </h2>

              <div className="space-y-4">
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
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="99.99"
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
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="79.99"
                    required
                  />
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Discount</span>
                    <span className="text-2xl font-bold text-green-400 flex items-center gap-1">
                      {calculateDiscount()}%
                      <FiPercent size={20} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Status</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                <span className="text-white">Active Product</span>
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
              </div>
            </motion.div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Updating...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;