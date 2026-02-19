import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table } from "react-bootstrap";

import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
  FaArrowRight,
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/admin/dashboard-stats");
      setStats(data);

      const ordersRes = await axiosInstance.get("/orders/admin/all");
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Currency Format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loader text="Loading Dashboard..." />;

  return (
    <div className="admin-dashboard">
      <Container fluid>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back Admin! Here is your store overview.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="mb-5">
          <Col lg={3} md={6} className="mb-4">
            <div
              className="dashboard-card"
              onClick={() => navigate("/admin/products")}
            >
              <div className="dashboard-icon purple">
                <FaBox />
              </div>
              <div>
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
                <small>
                  <FaArrowRight /> Manage Products
                </small>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <div
              className="dashboard-card"
              onClick={() => navigate("/admin/orders")}
            >
              <div className="dashboard-icon pink">
                <FaShoppingCart />
              </div>
              <div>
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
                <small>
                  <FaArrowRight /> Manage Orders
                </small>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <div
              className="dashboard-card"
              onClick={() => navigate("/admin/users")}
            >
              <div className="dashboard-icon blue">
                <FaUsers />
              </div>
              <div>
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
                <small>
                  <FaArrowRight /> Manage Users
                </small>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <div
              className="dashboard-card"
              onClick={() => navigate("/admin/revenue")}
            >
              <div className="dashboard-icon green">
                <FaRupeeSign />
              </div>
              <div>
                <h3>{formatCurrency(stats.totalRevenue)}</h3>
                <p>Total Revenue</p>
                <small>
                  <FaArrowRight /> View Analytics
                </small>
              </div>
            </div>
          </Col>
        </Row>

        {/* Premium Section Row */}
        <Row>
          {/* Recent Orders */}
          <Col lg={7} className="mb-4">
            <Card className="premium-widget">
              <Card.Body>
                <h4 className="widget-title">Recent Orders</h4>

                <Table hover responsive className="orders-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.user?.name}</td>
                        <td>{formatCurrency(order.totalPrice)}</td>
                        <td>
                          <span className="status-badge">
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Revenue Widget */}
          <Col lg={5} className="mb-4">
            <Card className="premium-widget">
              <Card.Body>
                <h4 className="widget-title">Revenue Summary</h4>

                <div className="revenue-box">
                  <h2>{formatCurrency(stats.totalRevenue)}</h2>
                  <p>Total Earnings This Month</p>
                </div>

                <button
                  className="dashboard-btn primary-btn w-100 mt-3"
                  onClick={() => navigate("/admin/revenue")}
                >
                  View Full Analytics →
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
