import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
} from "react-bootstrap";

import { FaShoppingCart, FaUserShield } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import "./Navbar.css";

const NavbarComponent = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  // ✅ Scroll Shadow State
  const [scrolled, setScrolled] = useState(false);

  // ✅ Add Shadow on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`shoeverse-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          Shoe<span>Verse</span>
        </Navbar.Brand>

        {/* ✅ Animated Hamburger */}
        <Navbar.Toggle aria-controls="main-navbar" className="custom-toggler">
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>

        <Navbar.Collapse
          id="main-navbar"
          className="justify-content-between"
        >
          {/* LEFT LINKS */}
          <Nav className="nav-links">
            {/* Normal User Links */}
            {!user?.isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/">
                  Home
                </Nav.Link>

                <Nav.Link as={NavLink} to="/products">
                  Products
                </Nav.Link>
              </>
            )}

            {/* Admin Links */}
            {user?.isAdmin && (
              <Nav.Link as={NavLink} to="/admin">
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>

          {/* RIGHT LINKS */}
          <Nav className="nav-actions">
            {/* ✅ MY ORDERS LINK */}
            {user && !user.isAdmin && (
              <Nav.Link as={NavLink} to="/orders" className="orders-link">
                My Orders
              </Nav.Link>
            )}

            {/* ✅ CART */}
            {user && !user.isAdmin && (
              <Nav.Link as={NavLink} to="/cart" className="cart-link">
                <FaShoppingCart size={18} />
                <span className="ms-1">Cart</span>

                {cartItems.length > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {cartItems.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {/* USER DROPDOWN */}
            {user ? (
              <NavDropdown
                title={
                  <>
                    {user.isAdmin && (
                      <FaUserShield className="me-1 text-warning" />
                    )}
                    {user.name}
                  </>
                }
                id="user-dropdown"
                align="end"
                className="user-dropdown"
              >
                {/* ADMIN MENU */}
                {user.isAdmin && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Manage Products
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/admin/orders">
                      Manage Orders
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/admin/users">
                      Manage Users
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/admin/revenue">
                      Revenue Analytics
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                  </>
                )}

                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {/* Guest Links */}
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>

                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
