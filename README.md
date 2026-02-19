# 👟 ShoeVerse - MERN Stack E-Commerce Website

ShoeVerse is a modern full-stack e-commerce web application built with the **MERN Stack**.  
It allows users to browse shoes, view product details, add items to cart, and place orders with authentication.

---

## 🚀 Live Demo

Frontend: (Coming Soon)  
Backend API: (Coming Soon)

---

## 🛠 Tech Stack

### Frontend
- React.js  
- React Router  
- Bootstrap / CSS  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  

### Database
- MongoDB Atlas  

---

## ✨ Features

- User Authentication (Login / Signup)
- Product Listing & Details Page
- Add to Cart Functionality
- Wishlist Feature
- Admin Product Management (Upcoming)
- Responsive UI for Mobile & Desktop

---

## 📂 Project Structure

ShoeVerse/
│
├── backend/
│ │
│ ├── config/
│ │ └── db.js # MongoDB connection setup
│ │
│ ├── controllers/
│ │ ├── adminController.js # Admin operations logic
│ │ ├── authController.js # Login/Register logic
│ │ ├── orderController.js # Order handling logic
│ │ └── productController.js # Product CRUD logic
│ │
│ ├── middleware/
│ │ ├── adminMiddleware.js # Admin route protection
│ │ └── authMiddleware.js # JWT authentication middleware
│ │
│ ├── models/
│ │ ├── Order.js # Order schema
│ │ ├── Product.js # Product schema
│ │ └── User.js # User schema
│ │
│ ├── routes/
│ │ ├── adminRoutes.js # Admin API routes
│ │ ├── authRoutes.js # Auth API routes
│ │ ├── orderRoutes.js # Order API routes
│ │ ├── productRoutes.js # Product API routes
│ │ └── uploadRoutes.js # Image upload API routes
│ │
│ ├── uploads/ # Uploaded product images folder
│ │
│ ├── .env # Environment variables (NOT pushed to GitHub)
│ ├── package.json # Backend dependencies
│ ├── package-lock.json
│ ├── seed-final.js # Sample product seeding script
│ └── server.js # Main backend entry point
│
├── frontend/
│ │
│ ├── public/ # Static files
│ │
│ ├── src/
│ │ │
│ │ ├── admin/
│ │ │ ├── AdminDashboard.jsx # Admin main dashboard
│ │ │ ├── ManageOrders.jsx # Admin order management
│ │ │ ├── ManageProducts.jsx # Admin product management
│ │ │ ├── ManageUsers.jsx # Admin user management
│ │ │ └── RevenueDetails.jsx # Admin revenue analytics
│ │ │
│ │ ├── api/
│ │ │ └── axiosInstance.js # Axios base URL + interceptor setup
│ │ │
│ │ ├── assets/ # Images, logos, icons
│ │ │
│ │ ├── components/
│ │ │ ├── AdminRoute.jsx # Admin protected routes
│ │ │ ├── Footer.jsx # Footer component
│ │ │ ├── ImageUploader.jsx # Upload product images
│ │ │ ├── Loader.jsx # Loading spinner
│ │ │ ├── Navbar.jsx # Navigation bar
│ │ │ ├── PrivateRoute.jsx # User protected routes
│ │ │ └── ProductCard.jsx # Product card UI component
│ │ │
│ │ ├── context/
│ │ │ ├── AuthContext.jsx # Authentication state management
│ │ │ └── CartContext.jsx # Cart state management
│ │ │
│ │ ├── pages/ # Main website pages
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Cart.jsx
│ │ │ └── ProductDetails.jsx
│ │ │
│ │ ├── App.jsx # Main React app component
│ │ ├── main.jsx # React entry point
│ │ └── main.css # Global styling
│ │
│ ├── index.html
│ ├── vite.config.js # Vite configuration
│ ├── package.json # Frontend dependencies
│ └── package-lock.json
│
├── README.md # Project documentation
└── .gitignore # Git ignored files