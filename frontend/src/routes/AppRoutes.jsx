import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Loader from '../components/common/Loader';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/client/Home'));
const Products = lazy(() => import('../pages/client/Products'));
const ProductDetails = lazy(() => import('../pages/client/ProductDetails'));
const Cart = lazy(() => import('../pages/client/Cart'));
const Checkout = lazy(() => import('../pages/client/Checkout'));
const Profile = lazy(() => import('../pages/client/Profile'));
const Orders = lazy(() => import('../pages/client/Orders'));
const Wishlist = lazy(() => import('../pages/client/Wishlist'));
const Login = lazy(() => import('../pages/client/Login'));
const Register = lazy(() => import('../pages/client/Register'));
const NotFound = lazy(() => import('../pages/client/NotFound'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));
const Revenue = lazy(() => import('../pages/admin/Revenue'));
const AddProduct = lazy(() => import('../pages/admin/AddProduct'));
const EditProduct = lazy(() => import('../pages/admin/EditProduct'));

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Client Routes */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};