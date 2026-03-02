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
├── backend/                         # Node.js + Express Backend
│
│   ├── config/                      # Configuration files
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/                 # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── middleware/                  # Custom middlewares
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   │
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── service/                     # External services
│   │   └── socketService.js
│   │
│   ├── seed-final.js                # Database seed script
│   ├── server.js                    # Entry point
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
│
├── frontend/                        # React + Vite Frontend
│
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │
│   │   ├── assets/                  # Static assets
│   │   │   └── payments/
│   │   │
│   │   ├── components/              # Reusable UI components
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
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── TrendingNow.jsx
│   │   │   │   ├── BrandStrip.jsx
│   │   │   │   ├── Newsletter.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   └── Stats.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGallery.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductFilters.jsx
│   │   │   │   └── MobileProductFilters.jsx
│   │   │   │
│   │   │   └── order/
│   │   │       ├── DeliveryCelebration.jsx
│   │   │       └── OrderTimeline.jsx
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProducts.js
│   │   │   ├── useRevenue.js
│   │   │   ├── useSocket.js
│   │   │   └── useCountUp.js
│   │   │
│   │   ├── layouts/                 # Layout wrappers
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ClientLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── Revenue.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── charts/
│   │   │   │
│   │   │   └── client/              # Customer pages
│   │   │       ├── Home.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── ProductDetails.jsx
│   │   │       ├── Cart.jsx
│   │   │       ├── Checkout.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── Wishlist.jsx
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       ├── Profile.jsx
│   │   │       └── NotFound.jsx
│   │   │
│   │   ├── routes/                  # Route protection
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   │
│   │   ├── services/                # API & integrations
│   │   │   ├── api.js
│   │   │   └── cloudinary.js
│   │   │
│   │   ├── store/                   # Global state (Zustand)
│   │   │   ├── authStore.js
│   │   │   ├── productStore.js
│   │   │   ├── cartStore.js
│   │   │   ├── orderStore.js
│   │   │   ├── adminStore.js
│   │   │   ├── wishlistStore.js
│   │   │   ├── uploadStore.js
│   │   │   └── themeStore.js
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── utils/                   # Helper utilities
│   │   │   ├── cn.js
│   │   │   ├── formatCurrency.js
│   │   │   ├── exportUtils.js
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
│   └── .gitignore
│
│
├── README.md
└── .gitignore
