import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  /* ================================
     ✅ Cloudinary Optimization Helper
     Compress + Resize for Faster Load
  ================================= */
  const getOptimizedImage = (url) => {
    if (!url) {
      return "https://via.placeholder.com/300?text=No+Image";
    }

    // ✅ Only optimize Cloudinary images
    if (!url.includes("cloudinary")) return url;

    // ✅ Auto compress + auto format + resize for cards
    return url.replace(
      "/upload/",
      "/upload/q_auto,f_auto,w_500/"
    );
  };

  /* ================================
     ✅ Get Primary Image Object
  ================================= */
  const getPrimaryImage = () => {
    if (!product.images || product.images.length === 0) {
      return "https://via.placeholder.com/300?text=No+Image";
    }

    const primary =
      product.images.find((img) => img.isPrimary) || product.images[0];

    // ✅ Return Optimized URL
    return getOptimizedImage(primary.url);
  };

  const primaryImageUrl = getPrimaryImage();

  /* ================================
     ✅ Discount Calculation
  ================================= */
  const price = product.price || 0;

  const originalPrice =
    product.originalPrice && product.originalPrice > price
      ? product.originalPrice
      : price + 2000;

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <Link to={`/product/${product._id}`} className="myntra-card-link">
      <Card className="myntra-card">
        {/* Wishlist Icon */}
        <div className="wishlist-icon">
          <FaHeart />
        </div>

        {/* Product Image */}
        <div className="myntra-img-box">
          <img
            src={primaryImageUrl}
            alt={product.name}
            loading="lazy" // ✅ Faster page load
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300?text=Image+Error";
            }}
          />
        </div>

        {/* Product Info */}
        <div className="myntra-info">
          {/* Brand */}
          <h6 className="brand-name">
            {product.brand || "SHOEVERSE"}
          </h6>

          {/* Subtitle */}
          <p className="product-subtitle">
            {product.category || "Running Shoes"}
          </p>

          {/* Full Product Name */}
          <p className="full-product-name">{product.name}</p>

          {/* Price + Discount */}
          <div className="price-row">
            <span className="new-price">₹{price}</span>

            <span className="old-price">₹{originalPrice}</span>

            <span className="discount-text">({discount}% OFF)</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
