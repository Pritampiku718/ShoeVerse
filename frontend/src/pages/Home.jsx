import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import axiosInstance from '../api/axiosInstance';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products for home page...');
      
      // Fetch products - limit to 8 for home page
      const { data } = await axiosInstance.get('/products?limit=8');
      console.log('Products fetched:', data);
      
      if (data && data.products) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.log('Unexpected data format:', data);
        setProducts([]);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else if (!error.response) {
        setError('Cannot connect to server. Please make sure backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <FaTruck />, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: <FaShieldAlt />, title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: <FaHeadset />, title: '24/7 Support', desc: 'Dedicated customer support' },
    { icon: <FaShoppingBag />, title: 'Easy Returns', desc: '30-day return policy' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Full Image */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-background"></div>
        <Container>
          <Row className="align-items-center hero-content-row">
            <Col lg={7} className="hero-content">
              <h1 className="hero-title">
                Step Into <span className="highlight">Style</span>
              </h1>
              <p className="hero-subtitle">
                Discover the perfect pair for every occasion. From casual comfort to athletic performance, we've got you covered with the latest trends and timeless classics.
              </p>
              <div className="hero-buttons">
                <Button as={Link} to="/products" variant="primary" size="lg" className="shop-now-btn">
                  SHOP NOW
                </Button>
                <Button as={Link} to="/products?sort=newest" variant="outline-light" size="lg" className="new-arrivals-btn">
                  NEW ARRIVALS
                </Button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Brands</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="featured-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">
            Our <span className="highlight">Products</span>
          </h2>
          
          {loading ? (
            <div className="text-center py-5">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <Button 
                variant="primary" 
                onClick={fetchProducts} 
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <Row>
                {products.length > 0 ? (
                  products.map(product => (
                    <Col lg={3} md={4} sm={6} key={product._id} className="mb-4">
                      <ProductCard product={product} />
                    </Col>
                  ))
                ) : (
                  <Col className="text-center py-5">
                    <div className="empty-state">
                      <FaShoppingBag className="empty-icon" />
                      <h4>No Products Available</h4>
                      <p className="text-muted">Be the first to add products to the store!</p>
                      <Button as={Link} to="/admin/products" variant="primary">
                        Add Products
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
              {products.length > 0 && (
                <div className="text-center mt-4">
                  <Button as={Link} to="/products" variant="primary" size="lg" className="view-all-btn">
                    View All Products
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Home;