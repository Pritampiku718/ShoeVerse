import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      setProduct(data);

      if (data.sizes?.length > 0) setSelectedSize(data.sizes[0].size);
      if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
    } catch (error) {
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Login required!");
      navigate("/login");
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Container>
          <Loader size="lg" text="Loading..." />
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page text-center">
        <h2>Product Not Found</h2>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Container>
        {/* Breadcrumb */}
        <p className="breadcrumb-text">
          Home / Products / <b>{product.name}</b>
        </p>

        {/* Main Layout */}
        <Row className="product-main">
          {/* Left Image */}
          <Col md={6} xs={12}>
            <div className="image-box">
              <img
                src={product.images?.[selectedImage]?.url}
                alt={product.name}
              />
            </div>
          </Col>

          {/* Right Info */}
          <Col md={6} xs={12}>
            <div className="details-box">
              <h2>{product.name}</h2>
              <h4 className="brand">{product.brand}</h4>

              <h3 className="price">${product.price}</h3>

              <Badge bg="success" className="stock-badge">
                In Stock
              </Badge>

              {/* Size */}
              <div className="option-section">
                <p>Select Size</p>
                <div className="options">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      className={selectedSize === s.size ? "active" : ""}
                      onClick={() => setSelectedSize(s.size)}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="option-section">
                <p>Select Color</p>
                <div className="options">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={selectedColor === c ? "active" : ""}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="quantity-section">
                <p>Quantity</p>
                <div className="qty-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="action-buttons">
                <Button className="cart-btn" onClick={handleAddToCart}>
                  <FaShoppingCart /> Add to Cart
                </Button>

                <Button variant="outline-danger" className="wish-btn">
                  <FaHeart /> Wishlist
                </Button>
              </div>

              {/* Description UNDER DETAILS */}
              <div className="description-box">
                <h4>Description</h4>
                <p>
                  {product.description ||
                    "This is a premium quality shoe designed for comfort and daily wear."}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;
