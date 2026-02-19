import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";

import { FaSearch, FaSave, FaTrash, FaEye } from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import "./ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/admin/all");

      // Remove invalid guest ₹0 orders
      const validOrders = data.filter((order) => order.totalPrice > 0);

      setOrders(validOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // ✅ Auto Refresh every 5 sec
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Status Badge UI
  const getStatusBadge = (status) => {
    const colors = {
      Processing: "warning",
      Shipped: "info",
      Delivered: "success",
      Cancelled: "danger",
    };

    return (
      <Badge bg={colors[status] || "secondary"} className="status-badge">
        {status}
      </Badge>
    );
  };

  // ✅ Date Format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Change Status Locally
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, newStatus } : order
      )
    );
  };

  // ✅ Save Status Update
  const handleSaveStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/admin/${orderId}/status`, {
        orderStatus: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      alert("✅ Order status updated!");
    } catch (error) {
      alert("❌ Failed to update status");
    }
  };

  // ✅ Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axiosInstance.delete(`/orders/admin/${orderId}`);

      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      alert("🗑️ Order deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete order");
    }
  };

  // ✅ View Order Details Modal
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // ✅ Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ Pagination Logic
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) return <Loader text="Loading Orders..." />;

  return (
    <div className="manage-orders">
      <Container fluid>
        <h1 className="page-title">Manage Orders</h1>

        {/* Search + Filter */}
        <Row className="filters-row">
          <Col md={6}>
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by Order ID or Username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </Col>

          <Col md={6}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Orders Table */}
        <div className="table-responsive">
          <Table hover className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-8)}</td>

                  <td>
                    <strong>{order.user?.name}</strong>
                    <br />
                    <small>{order.user?.email}</small>
                  </td>

                  <td>{formatDate(order.createdAt)}</td>

                  <td className="order-total">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>

                  <td>{getStatusBadge(order.orderStatus)}</td>

                  {/* Update Status */}
                  <td>
                    <Form.Select
                      size="sm"
                      value={order.newStatus || order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Form.Select>

                    <Button
                      size="sm"
                      className="save-btn mt-2"
                      onClick={() =>
                        handleSaveStatus(
                          order._id,
                          order.newStatus || order.orderStatus
                        )
                      }
                    >
                      <FaSave /> Save
                    </Button>
                  </td>

                  {/* Actions */}
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleViewOrder(order)}
                    >
                      <FaEye />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="pagination-box">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedOrder && (
              <>
                <p>
                  <strong>User:</strong> {selectedOrder.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.user?.email}
                </p>
                <p>
                  <strong>Total:</strong> ₹{selectedOrder.totalPrice}
                </p>

                <hr />

                <h6>Items:</h6>
                {selectedOrder.orderItems.map((item, index) => (
                  <p key={index}>
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageOrders;
