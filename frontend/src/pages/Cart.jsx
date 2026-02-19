import React from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Currency Format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const shippingCost = cartTotal > 1000 ? 0 : 40;
  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + shippingCost + tax;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item._id, item.size, item.color, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <Container>
          <div className="empty-cart-box">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any shoes yet.</p>
            <Button as={Link} to="/products" size="lg" className="shop-now-btn">
              Continue Shopping
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Container>
        <h1 className="cart-title">Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>

        <Row className="cart-layout">
          {/* LEFT SIDE CART ITEMS */}
          <Col lg={8}>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div
                  key={`${item._id}-${item.size}-${item.color}-${index}`}
                  className="cart-item"
                >
                  {/* Product Image */}
                  <div className="cart-img">
                    <img 
                      src={item.image || 'https://via.placeholder.com/90'} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/90';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="cart-info">
                    <Link to={`/product/${item._id}`} className="cart-name">
                      {item.name}
                    </Link>

                    <p className="cart-meta">
                      Size: <span>{item.size || 'N/A'}</span> | Color:{" "}
                      <span>{item.color || 'N/A'}</span>
                    </p>

                    <p className="cart-price">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-qty">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>

                    <Form.Control
                      value={item.quantity}
                      type="number"
                      min="1"
                      max={item.stock}
                      onChange={(e) =>
                        handleQuantityChange(item, parseInt(e.target.value) || 1)
                      }
                      className="qty-input"
                    />

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </Button>
                  </div>

                  {/* Subtotal */}
                  <div className="cart-subtotal">
                    {formatCurrency(item.price * item.quantity)}
                  </div>

                  {/* Remove */}
                  <button
                    className="cart-remove"
                    onClick={() =>
                      removeFromCart(item._id, item.size, item.color)
                    }
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="cart-actions">
              <Button as={Link} to="/products" variant="outline-primary">
                <FaArrowLeft /> Continue Shopping
              </Button>

              <Button variant="outline-danger" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </Col>

          {/* RIGHT SIDE SUMMARY */}
          <Col lg={4}>
            <Card className="order-summary">
              <Card.Body>
                <h3>Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : formatCurrency(shippingCost)}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <hr />

                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>

                <Button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout <FaArrowRight />
                </Button>

                <p className="delivery-note">
                  🚚 Free Delivery on orders above ₹1,000
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;