import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="footer-top">
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-title">
                <span className="shoe-text">Shoe</span>
                <span className="verse-text">Verse</span>
              </h5>
              <p className="footer-description">
                Your premier destination for the latest and greatest in footwear. 
                We bring you the best brands with unbeatable comfort and style.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaYoutube />
                </a>
              </div>
            </Col>

            <Col lg={2} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-subtitle">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/orders">My Orders</Link></li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-subtitle">Categories</h5>
              <ul className="footer-links">
                <li><Link to="/products?category=Running">Running Shoes</Link></li>
                <li><Link to="/products?category=Casual">Casual Shoes</Link></li>
                <li><Link to="/products?category=Sports">Sports Shoes</Link></li>
                <li><Link to="/products?category=Boots">Boots</Link></li>
                <li><Link to="/products?category=Sneakers">Sneakers</Link></li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-subtitle">Contact Info</h5>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Nahata Bokchara Road, India, WB 743290</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>support@shoeverse.com</span>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="copyright mb-0">
                &copy; {new Date().getFullYear()} ShoeVerse. All rights reserved. | 
                <Link to="/privacy" className="ms-2">Privacy Policy</Link> | 
                <Link to="/terms" className="ms-2">Terms of Service</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;