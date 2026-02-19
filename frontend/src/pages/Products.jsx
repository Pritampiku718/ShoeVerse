import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Pagination,
  Alert,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import axiosInstance from "../api/axiosInstance";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Filters State
  const [filters, setFilters] = useState({
    sort: "popularity",
    category: "",
    price: "",
    keyword: "",
  });

  const [searchInput, setSearchInput] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();

  /* ================================
     Load Filters from URL
  ================================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const loadedFilters = {
      sort: params.get("sort") || "popularity",
      category: params.get("category") || "",
      price: params.get("price") || "",
      keyword: params.get("keyword") || "",
    };

    setFilters(loadedFilters);
    setSearchInput(loadedFilters.keyword);
  }, [location.search]);

  /* ================================
     Fetch Products
  ================================= */
  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams(location.search);

      const { data } = await axiosInstance.get(
        `/products?${params.toString()}`
      );

      setProducts(data.products || []);

      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || data.products.length,
      });
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     Update Filter in URL
  ================================= */
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(location.search);

    if (value) params.set(key, value);
    else params.delete(key);

    params.set("page", 1);

    navigate(`/products?${params.toString()}`);
  };

  /* ================================
     Search Submit
  ================================= */
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter("keyword", searchInput);
  };

  /* ================================
     Pagination
  ================================= */
  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    navigate(`/products?${params.toString()}`);
  };

  /* ================================
     Clear All Filters
  ================================= */
  const clearAllFilters = () => {
    navigate("/products");
  };

  return (
    <div className="myntra-page">
      <Container fluid>
        <Row>
          {/* ✅ LEFT FILTER SIDEBAR */}
          <Col lg={2} className="myntra-sidebar">
            <h5 className="filter-title">FILTERS</h5>

            {/* Category Filter */}
            <div className="filter-group">
              <h6>CATEGORY</h6>

              {["Nike", "Adidas", "Puma", "Reebok", "One8", "Proship"].map((brand) => (
                <Form.Check
                  key={brand}
                  type="checkbox"
                  label={brand}
                  checked={filters.category === brand}
                  onChange={() =>
                    updateFilter(
                      "category",
                      filters.category === brand ? "" : brand
                    )
                  }
                />
              ))}
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h6>PRICE</h6>

              {[
                ["0-2000", "Below ₹2000"],
                ["2000-5000", "₹2000 - ₹5000"],
                ["5000-10000", "₹5000 - ₹10000"],
                ["10000-20000", "Above ₹10000"],
              ].map(([value, label]) => (
                <Form.Check
                  key={value}
                  type="checkbox"
                  label={label}
                  checked={filters.price === value}
                  onChange={() =>
                    updateFilter(
                      "price",
                      filters.price === value ? "" : value
                    )
                  }
                />
              ))}
            </div>
          </Col>

          {/* ✅ PRODUCTS AREA */}
          <Col lg={10} className="myntra-products">
            {/* ✅ SEARCH BAR */}
            <Form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search shoes, brands..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit">Search</button>
            </Form>

            {/* SORT BAR */}
            <div className="myntra-sortbar">
              <span>Sort By:</span>

              {[
                ["popularity", "Popularity"],
                ["newest", "Newest"],
                ["price-low", "Price"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`sort-tab ${
                    filters.sort === value ? "active" : ""
                  }`}
                  onClick={() => updateFilter("sort", value)}
                >
                  {label}
                </button>
              ))}

              <span className="items-count">
                {pagination.total} items
              </span>
            </div>

            {/* ✅ ACTIVE FILTERS BAR */}
            <div className="active-filters">
              {filters.keyword && (
                <span
                  className="filter-chip"
                  onClick={() => updateFilter("keyword", "")}
                >
                  Search: {filters.keyword} ✕
                </span>
              )}

              {filters.category && (
                <span
                  className="filter-chip"
                  onClick={() => updateFilter("category", "")}
                >
                  Category: {filters.category} ✕
                </span>
              )}

              {filters.price && (
                <span
                  className="filter-chip"
                  onClick={() => updateFilter("price", "")}
                >
                  Price: {filters.price} ✕
                </span>
              )}

              {(filters.keyword || filters.category || filters.price) && (
                <button className="clear-btn" onClick={clearAllFilters}>
                  Clear All
                </button>
              )}
            </div>

            {/* PRODUCTS GRID */}
            {loading ? (
              <Loader />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <>
                <Row className="myntra-grid">
                  {products.map((product) => (
                    <Col lg={3} md={4} sm={6} key={product._id}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>

                {/* PAGINATION */}
                {pagination.pages > 1 && (
                  <Pagination className="justify-content-center mt-4">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <Pagination.Item
                        key={i}
                        active={pagination.page === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Products;
