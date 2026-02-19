import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import ManageUsers from "./admin/ManageUsers";
import RevenueDetails from "./admin/RevenueDetails";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* ✅ Full Layout Wrapper */}
        <div className="App d-flex flex-column min-vh-100">
          
          {/* ✅ Navbar Always Top */}
          <Navbar />

          {/* ✅ Main Content Expands */}
          <main className="flex-grow-1">
            <Routes>
              {/* ---------------- PUBLIC ROUTES ---------------- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />

              {/* ---------------- USER PROTECTED ROUTES ---------------- */}
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              {/* ---------------- ADMIN ROUTES ---------------- */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ManageProducts />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <ManageOrders />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <ManageUsers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/revenue"
                element={
                  <AdminRoute>
                    <RevenueDetails />
                  </AdminRoute>
                }
              />

              {/* ---------------- FALLBACK ROUTE ---------------- */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* ✅ Footer Always Bottom */}
          <Footer />

          {/* ✅ Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#222",
                color: "#fff",
                fontSize: "14px",
              },
              success: {
                style: {
                  background: "#28a745",
                },
              },
              error: {
                style: {
                  background: "#dc3545",
                },
              },
              loading: {
                style: {
                  background: "#007bff",
                },
              },
            }}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
