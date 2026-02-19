import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import axiosInstance from "../api/axiosInstance";
import "./Checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phoneNumber: "",
    landmark: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  /* ================= SHIPPING SUBMIT ================= */
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: cartTotal * 0.1,
        shippingPrice: 0,
        totalPrice: cartTotal + cartTotal * 0.1,
      };

      const { data } = await axiosInstance.post("/orders", orderData);

      setOrderId(data._id);
      clearCart();
      setStep(3);
    } catch (error) {
      console.log("Order Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Container>
        <h1 className="checkout-title">Checkout</h1>

        <Row className="checkout-layout">
          {/* ================= LEFT SIDE ================= */}
          <Col lg={8}>
            {/* STEP 1 SHIPPING */}
            {step === 1 && (
              <div className="amazon-box">
                <h3 className="box-title">1. Shipping Address</h3>

                <Form onSubmit={handleShippingSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        placeholder="Full Name"
                        required
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Control
                        placeholder="Mobile Number"
                        required
                        value={shippingAddress.phoneNumber}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        placeholder="Landmark (Optional)"
                        value={shippingAddress.landmark}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            landmark: e.target.value,
                          })
                        }
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Control
                        placeholder="Street Address"
                        required
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        placeholder="City"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Control
                        placeholder="State"
                        required
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            state: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        placeholder="ZIP Code"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Select
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            country: e.target.value,
                          })
                        }
                      >
                        <option>India</option>
                        <option>USA</option>
                        <option>UK</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Button type="submit" className="amazon-btn">
                    Continue →
                  </Button>
                </Form>
              </div>
            )}

            {/* STEP 2 PAYMENT */}
            {step === 2 && (
              <div className="amazon-box">
                <h3 className="box-title">2. Payment Method</h3>

                <p className="payment-note">
                  Select your preferred payment option:
                </p>

                <div className="payment-options">
                  {/* COD */}
                  <label className="payment-item">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-text">
                      <h5>Cash on Delivery</h5>
                      <p>Pay when you receive your order</p>
                    </div>
                  </label>

                  {/* CARD */}
                  <label className="payment-item">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-text">
                      <h5>Credit / Debit Card</h5>
                      <p>Visa, Mastercard, Rupay supported</p>
                    </div>
                  </label>

                  {/* UPI */}
                  <label className="payment-item">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-text">
                      <h5>UPI Payment</h5>
                      <p>Google Pay, PhonePe, Paytm</p>
                    </div>
                  </label>

                  {/* NETBANKING */}
                  <label className="payment-item">
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === "netbanking"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-text">
                      <h5>Net Banking</h5>
                      <p>Pay directly through your bank</p>
                    </div>
                  </label>
                </div>

                <Button
                  className="amazon-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>

                <Button
                  variant="light"
                  className="back-btn"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              </div>
            )}

            {/* STEP 3 SUCCESS */}
            {step === 3 && (
              <div className="amazon-box success-box">
                <FaCheckCircle className="success-icon" />
                <h2>Order Placed Successfully!</h2>
                <p>
                  Order ID: <strong>#{orderId}</strong>
                </p>

                <Button
                  className="amazon-btn"
                  onClick={() => navigate("/orders")}
                >
                  View Orders
                </Button>
              </div>
            )}
          </Col>

          {/* ================= RIGHT SIDE ORDER SUMMARY ================= */}
          <Col lg={4}>
            <div className="order-box">
              <h3 className="order-title">Order Summary</h3>

              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="order-name">{item.name}</p>
                    <span>
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>
                </div>
              ))}

              <hr />

              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="price-row">
                <span>Tax (10%)</span>
                <span>₹{(cartTotal * 0.1).toFixed(2)}</span>
              </div>

              <div className="price-total">
                <span>Total</span>
                <span>₹{(cartTotal * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
