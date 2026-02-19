import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaEye, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Processing': { bg: 'warning', text: 'Processing' },
      'Shipped': { bg: 'info', text: 'Shipped' },
      'Delivered': { bg: 'success', text: 'Delivered' },
      'Cancelled': { bg: 'danger', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPaymentBadge = (isPaid) => {
    return isPaid ? (
      <Badge bg="success">Paid</Badge>
    ) : (
      <Badge bg="warning">Pending</Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader size="lg" text="Loading your orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page empty-orders">
        <Container>
          <Row className="justify-content-center text-center py-5">
            <Col md={8} lg={6}>
              <div className="empty-orders-icon">
                <FaShoppingBag />
              </div>
              <h2>No Orders Yet</h2>
              <p className="text-muted mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Button as={Link} to="/products" variant="primary" size="lg">
                Start Shopping
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Container>
        <h1 className="orders-title">My Orders</h1>
        
        <Row>
          <Col lg={8}>
            {/* Orders List */}
            <div className="orders-list">
              {orders.map((order) => (
                <Card key={order._id} className="order-card">
                  <Card.Body>
                    <div className="order-header">
                      <div className="order-info">
                        <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                        <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-status">
                        {getStatusBadge(order.orderStatus)}
                        {getPaymentBadge(order.isPaid)}
                      </div>
                    </div>

                    <div className="order-items">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="order-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="order-item-details">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                          </div>
                          <div className="order-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <p className="text-muted small mt-2">
                          +{order.orderItems.length - 3} more items
                        </p>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: </strong>
                        <span className="total-amount">${order.totalPrice.toFixed(2)}</span>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      >
                        <FaEye /> {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>

                    {/* Order Details (Expandable) */}
                    {selectedOrder === order._id && (
                      <div className="order-details">
                        <hr />
                        <Row>
                          <Col md={6}>
                            <h5>Shipping Address</h5>
                            <p>
                              {order.shippingAddress.address}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                              {order.shippingAddress.country}
                            </p>
                          </Col>
                          <Col md={6}>
                            <h5>Payment Method</h5>
                            <p>{order.paymentMethod}</p>
                            <h5>Delivery Status</h5>
                            <p>
                              {order.isDelivered ? (
                                <>Delivered on {formatDate(order.deliveredAt)}</>
                              ) : (
                                'Not delivered yet'
                              )}
                            </p>
                          </Col>
                        </Row>

                        <h5>Order Summary</h5>
                        <Table size="sm" className="order-summary-table">
                          <tbody>
                            <tr>
                              <td>Subtotal</td>
                              <td className="text-end">${order.itemsPrice?.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Shipping</td>
                              <td className="text-end">${order.shippingPrice?.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Tax</td>
                              <td className="text-end">${order.taxPrice?.toFixed(2)}</td>
                            </tr>
                            <tr className="total-row">
                              <td><strong>Total</strong></td>
                              <td className="text-end"><strong>${order.totalPrice?.toFixed(2)}</strong></td>
                            </tr>
                          </tbody>
                        </Table>

                        {/* Tracking Information */}
                        {order.orderStatus === 'Shipped' && (
                          <div className="tracking-info">
                            <h5>Tracking Information</h5>
                            <div className="tracking-progress">
                              <div className="progress-step completed">
                                <FaCheckCircle />
                                <span>Order Confirmed</span>
                              </div>
                              <div className="progress-step completed">
                                <FaCheckCircle />
                                <span>Processed</span>
                              </div>
                              <div className="progress-step active">
                                <FaTruck />
                                <span>Shipped</span>
                              </div>
                              <div className="progress-step">
                                <FaCheckCircle />
                                <span>Delivered</span>
                              </div>
                            </div>
                            <p className="mt-3">
                              Tracking Number: <strong>TRK{Math.random().toString(36).substr(2, 9).toUpperCase()}</strong>
                            </p>
                          </div>
                        )}

                        {order.orderStatus === 'Delivered' && (
                          <div className="delivery-info">
                            <div className="delivery-message">
                              <FaCheckCircle className="text-success" />
                              <span>Your order has been delivered on {formatDate(order.deliveredAt)}</span>
                            </div>
                            <Button variant="outline-primary" size="sm" className="mt-3">
                              Write a Review
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            {/* Order Summary Card */}
            <Card className="order-stats-card">
              <Card.Body>
                <h3>Order Statistics</h3>
                
                <div className="stat-item">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{orders.length}</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-label">Total Spent</div>
                  <div className="stat-value">
                    ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-label">Average Order Value</div>
                  <div className="stat-value">
                    ${(orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length).toFixed(2)}
                  </div>
                </div>

                <hr />

                <h4>Order Status</h4>
                <div className="status-breakdown">
                  <div className="status-item">
                    <span className="status-label">Processing</span>
                    <span className="status-count">
                      {orders.filter(o => o.orderStatus === 'Processing').length}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Shipped</span>
                    <span className="status-count">
                      {orders.filter(o => o.orderStatus === 'Shipped').length}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Delivered</span>
                    <span className="status-count">
                      {orders.filter(o => o.orderStatus === 'Delivered').length}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Cancelled</span>
                    <span className="status-count">
                      {orders.filter(o => o.orderStatus === 'Cancelled').length}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Orders;