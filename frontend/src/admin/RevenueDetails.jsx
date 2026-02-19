import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRupeeSign, FaChartLine } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import "./RevenueDetails.css";

/* =======================
   Chart Imports
======================= */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const RevenueDetails = () => {
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("monthly");
  const [revenueData, setRevenueData] = useState([]);

  const [allOrders, setAllOrders] = useState([]);

  /* Drilldown */
  const [showDrillDownModal, setShowDrillDownModal] = useState(false);
  const [drillDownTitle, setDrillDownTitle] = useState("");
  const [drillDownData, setDrillDownData] = useState([]);

  const navigate = useNavigate();

  /* =======================
     Fetch Orders
  ======================= */
  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (allOrders.length > 0) {
      processRevenueData();
    }
  }, [viewType, allOrders]);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/orders/admin/all");
      setAllOrders(data || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Process Revenue
  ======================= */
  const processRevenueData = () => {
    const deliveredOrders = allOrders.filter(
      (o) => o.orderStatus === "Delivered"
    );

    /* ===== DAILY ===== */
    if (viewType === "daily") {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const dailyData = {};

      deliveredOrders.forEach((order) => {
        const date = new Date(order.createdAt);

        if (date >= last30Days) {
          const key = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });

          if (!dailyData[key]) {
            dailyData[key] = { period: key, total: 0, count: 0 };
          }

          dailyData[key].total += order.totalPrice;
          dailyData[key].count += 1;
        }
      });

      setRevenueData(Object.values(dailyData));
    }

    /* ===== MONTHLY ===== */
    if (viewType === "monthly") {
      const monthlyData = {};

      deliveredOrders.forEach((order) => {
        const date = new Date(order.createdAt);

        const key = date.toLocaleString("en-IN", {
          month: "long",
          year: "numeric",
        });

        if (!monthlyData[key]) {
          monthlyData[key] = {
            period: key,
            total: 0,
            count: 0,
            monthYear: `${date.getFullYear()}-${date.getMonth() + 1}`,
          };
        }

        monthlyData[key].total += order.totalPrice;
        monthlyData[key].count += 1;
      });

      setRevenueData(Object.values(monthlyData));
    }

    /* ===== QUARTERLY ===== */
    if (viewType === "quarterly") {
      const quarterlyData = {};

      deliveredOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        const quarter = Math.floor(date.getMonth() / 3) + 1;

        const key = `Q${quarter} ${date.getFullYear()}`;

        if (!quarterlyData[key]) {
          quarterlyData[key] = { period: key, total: 0, count: 0 };
        }

        quarterlyData[key].total += order.totalPrice;
        quarterlyData[key].count += 1;
      });

      setRevenueData(Object.values(quarterlyData));
    }
  };

  /* =======================
     Drilldown Click
  ======================= */
  const handleItemClick = (item) => {
    if (viewType === "monthly") {
      showMonthlyDrillDown(item.period, item.monthYear);
    }
  };

  const showMonthlyDrillDown = (monthName, monthYear) => {
    const [year, month] = monthYear.split("-").map(Number);

    const dailyData = {};

    allOrders.forEach((order) => {
      if (order.orderStatus === "Delivered") {
        const date = new Date(order.createdAt);

        if (date.getFullYear() === year && date.getMonth() === month - 1) {
          const key = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });

          if (!dailyData[key]) {
            dailyData[key] = { period: key, total: 0, count: 0 };
          }

          dailyData[key].total += order.totalPrice;
          dailyData[key].count += 1;
        }
      }
    });

    setDrillDownTitle(`Daily Revenue - ${monthName}`);
    setDrillDownData(Object.values(dailyData));
    setShowDrillDownModal(true);
  };

  /* =======================
     Currency Format
  ======================= */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const totalRevenue = revenueData.reduce((sum, i) => sum + i.total, 0);
  const totalOrders = revenueData.reduce((sum, i) => sum + i.count, 0);

  /* =======================
     Chart Data
  ======================= */
  const chartData = {
    labels: revenueData.map((i) => i.period),
    datasets: [
      {
        label: `${viewType.toUpperCase()} Revenue`,
        data: revenueData.map((i) => i.total),
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  /* =======================
     Loading
  ======================= */
  if (loading) {
    return (
      <div className="revenue-page">
        <Container>
          <Loader size="lg" text="Loading Revenue Analytics..." />
        </Container>
      </div>
    );
  }

  return (
    <div className="revenue-page">
      <Container>
        {/* Back */}
        <Button
          variant="link"
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          <FaArrowLeft /> Back to Dashboard
        </Button>

        {/* Title */}
        <h1 className="revenue-title">Revenue Analytics</h1>

        {/* View Selector */}
        <div className="view-type-selector">
          <Button
            className={viewType === "daily" ? "active-btn" : ""}
            onClick={() => setViewType("daily")}
          >
            Daily
          </Button>

          <Button
            className={viewType === "monthly" ? "active-btn" : ""}
            onClick={() => setViewType("monthly")}
          >
            Monthly
          </Button>

          <Button
            className={viewType === "quarterly" ? "active-btn" : ""}
            onClick={() => setViewType("quarterly")}
          >
            Quarterly
          </Button>
        </div>

        {/* Summary */}
        <Row>
          <Col md={6}>
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon">
                  <FaRupeeSign />
                </div>
                <div className="summary-content">
                  <h3>Total Revenue</h3>
                  <h2>{formatCurrency(totalRevenue)}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon">
                  <FaChartLine />
                </div>
                <div className="summary-content">
                  <h3>Total Orders</h3>
                  <h2>{totalOrders}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Chart */}
        <Card className="revenue-card">
          <h3 className="center-title">Revenue Trend</h3>
          <div style={{ height: "250px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Table */}
        <Card className="revenue-card">
          <h3 className="center-title">
            {viewType.toUpperCase()} Revenue
          </h3>

          <Table bordered hover responsive className="revenue-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Average</th>
              </tr>
            </thead>

            <tbody>
              {revenueData.map((item, idx) => {
                const avg =
                  item.count > 0 ? item.total / item.count : 0;

                return (
                  <tr
                    key={idx}
                    className={
                      viewType === "monthly" ? "clickable-row" : ""
                    }
                    onClick={() =>
                      viewType === "monthly" && handleItemClick(item)
                    }
                  >
                    <td>{item.period}</td>
                    <td>
                      <span className="order-badge">{item.count}</span>
                    </td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>{formatCurrency(avg)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>

        {/* Drilldown Modal */}
        <Modal
          show={showDrillDownModal}
          onHide={() => setShowDrillDownModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{drillDownTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Table bordered hover responsive className="drilldown-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {drillDownData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.period}</td>
                    <td>
                      <span className="order-badge">{item.count}</span>
                    </td>
                    <td>{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default RevenueDetails;
