# 👟 ShoeVerse — Full Stack MERN E-Commerce Platform

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

A modern **full-stack e-commerce web application** built using the **MERN Stack** with a professional admin dashboard, real-time updates, secure authentication, and scalable architecture.

---

## 🌐 Live Demo

🚀 **Live Website:**  
👉 https://shoe-verse-one.vercel.app/

⚙️ **Backend API:**  
👉 https://shoeverse-backend.onrender.com

---

## ✨ Features

### 🛍 Customer Features
- Browse & search products
- Advanced product filtering
- Product detail gallery
- Add to cart & wishlist
- Secure authentication (JWT)
- Checkout flow
- Order history & tracking
- Responsive modern UI

### 🧑‍💼 Admin Dashboard
- Product CRUD management
- Order management system
- Revenue analytics dashboard
- Sales charts & statistics
- Low stock alerts
- User management panel

### ⚡ Advanced Functionality
- RESTful API architecture
- Protected routes & role-based access
- Real-time updates using Socket.io
- Cloudinary image uploads
- Global state management (Zustand)
- Skeleton loading UI
- Error boundaries & optimized UX

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Zustand
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- Cloudinary

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📁 Project Structure
ShoeVerse/
│
├── backend/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── service/
│   │   └── socketService.js
│   │
│   ├── seed-final.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
│
├── frontend/
│   │
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │
│   │   ├── assets/
│   │   │   ├── react.svg
│   │   │   └── payments/
│   │   │       ├── american-express-stacked.svg
│   │   │       ├── discover.svg
│   │   │       ├── maestro-card.svg
│   │   │       ├── mastercard-modern-design-.svg
│   │   │       ├── rupay.svg
│   │   │       └── visa-5.svg
│   │   │
│   │   ├── components/
│   │   │
│   │   │   ├── cart/
│   │   │   │   └── CartDrawer.jsx
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── ConfirmationModal.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── LoadingSkeleton.jsx
│   │   │   │   └── SEO.jsx
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── BrandStrip.jsx
│   │   │   │   ├── CategoryShowcase.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── FlashSale.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── InstagramFeed.jsx
│   │   │   │   ├── Newsletter.jsx
│   │   │   │   ├── Stats.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   └── TrendingNow.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── DeliveryCelebration.jsx
│   │   │   │   └── OrderTimeline.jsx
│   │   │   │
│   │   │   └── product/
│   │   │       ├── MobileProductFilters.jsx
│   │   │       ├── ProductCard.jsx
│   │   │       ├── ProductFilters.jsx
│   │   │       ├── ProductGallery.jsx
│   │   │       └── ProductGrid.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCountUp.js
│   │   │   ├── useProducts.js
│   │   │   ├── useRevenue.js
│   │   │   └── useSocket.js
│   │   │
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ClientLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │
│   │   │   ├── admin/
│   │   │   │   ├── ActivityFeed.jsx
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── EditProduct.jsx
│   │   │   │   ├── LowStockAlerts.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── RecentOrdersTable.jsx
│   │   │   │   ├── Revenue.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   ├── TopProducts.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   └── charts/
│   │   │   │       ├── CategoryRevenueChart.jsx
│   │   │   │       ├── MonthlyRevenueChart.jsx
│   │   │   │       ├── PaymentMethodChart.jsx
│   │   │   │       └── RevenueChart.jsx
│   │   │   │
│   │   │   └── client/
│   │   │       ├── Cart.jsx
│   │   │       ├── Checkout.jsx
│   │   │       ├── Home.jsx
│   │   │       ├── Login.jsx
│   │   │       ├── NotFound.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── ProductDetails.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Profile.jsx
│   │   │       ├── Register.jsx
│   │   │       ├── Settings.jsx
│   │   │       └── Wishlist.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── cloudinary.js
│   │   │
│   │   ├── store/
│   │   │   ├── adminStore.js
│   │   │   ├── authStore.js
│   │   │   ├── cartStore.js
│   │   │   ├── orderStore.js
│   │   │   ├── productStore.js
│   │   │   ├── themeStore.js
│   │   │   ├── uploadStore.js
│   │   │   └── wishlistStore.js
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.js
│   │   │   ├── exportUtils.js
│   │   │   ├── formatCurrency.js
│   │   │   ├── smartMessage.js
│   │   │   └── statusConfig.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
│
├── README.md
└── .gitignore
