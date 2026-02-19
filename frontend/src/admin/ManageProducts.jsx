import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Toast,
  ToastContainer,
  Carousel,
} from "react-bootstrap";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaImage,
  FaEye,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import ImageUploader from "../components/ImageUploader";
import "./ManageProducts.css";

const ManageProducts = () => {
  const navigate = useNavigate();

  /* =========================
     STATES
  ========================== */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filters + Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete Modal
  const [deleteId, setDeleteId] = useState(null);

  // View Modal
  const [viewProduct, setViewProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [originalViewProduct, setOriginalViewProduct] = useState(null);

  // Color Tag Input
  const [colorInput, setColorInput] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Toast Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    images: [],
    sizes: [{ size: "", quantity: "" }],
    colors: [],
    isFeatured: false,
  });

  /* =========================
     FETCH PRODUCTS
  ========================== */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/products");
      setProducts(data.products || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HELPERS
  ========================== */

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.url?.startsWith("http")) return image.url;
    return `http://localhost:5000${image.url}`;
  };

  // Discount %
  const getDiscountPercent = () => {
    const original = Number(formData.originalPrice);
    const selling = Number(formData.price);

    if (!original || !selling || original <= selling) return 0;

    return Math.round(((original - selling) / original) * 100);
  };

  // Total Stock Auto Sum
  const getTotalStock = () => {
    return formData.sizes.reduce(
      (total, s) => total + Number(s.quantity || 0),
      0
    );
  };

  /* =========================
     VALIDATION
  ========================== */
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand name is required";
    if (!formData.category) newErrors.category = "Select a category";
    if (!formData.price) newErrors.price = "Selling price is required";

    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    const validSizes = formData.sizes.filter(
      (s) => s.size && s.quantity > 0
    );

    if (validSizes.length === 0)
      newErrors.sizes = "Add at least one size with quantity";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     FILTERING + SORTING
  ========================== */
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "featured"
        ? product.isFeatured
        : statusFilter === "out"
        ? product.stock === 0
        : product.stock > 0 && !product.isFeatured;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting
  if (sortOption === "priceLow")
    filteredProducts.sort((a, b) => a.price - b.price);

  if (sortOption === "priceHigh")
    filteredProducts.sort((a, b) => b.price - a.price);

  if (sortOption === "stockLow")
    filteredProducts.sort((a, b) => a.stock - b.stock);

  if (sortOption === "stockHigh")
    filteredProducts.sort((a, b) => b.stock - a.stock);

  /* =========================
     PAGINATION
  ========================== */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* =========================
     FORM HANDLERS
  ========================== */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (images) => {
    setFormData({ ...formData, images });
  };

  /* ===== Sizes Add/Remove ===== */
  const handleSizeChange = (index, field, value) => {
    const updated = [...formData.sizes];
    updated[index][field] = value;
    setFormData({ ...formData, sizes: updated });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", quantity: "" }],
    });
  };

  const removeSize = (index) => {
    if (formData.sizes.length > 1) {
      const updated = formData.sizes.filter((_, i) => i !== index);
      setFormData({ ...formData, sizes: updated });
    }
  };

  /* ===== Color Tags Add/Remove ===== */
  const addColorTag = () => {
    if (!colorInput.trim()) return;
    if (formData.colors.includes(colorInput.trim())) return;

    setFormData({
      ...formData,
      colors: [...formData.colors, colorInput.trim()],
    });

    setColorInput("");
  };

  const removeColorTag = (color) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== color),
    });
  };

  /* =========================
     EDIT PRODUCT
  ========================== */
  const handleEdit = (product) => {
    setEditingProduct(product);
    setErrors({});

    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || "",
      stock: product.stock,
      images: product.images || [],
      sizes: product.sizes || [{ size: "", quantity: "" }],
      colors: product.colors || [],
      isFeatured: product.isFeatured || false,
    });

    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setErrors({});
    setFormData({
      name: "",
      brand: "",
      category: "",
      description: "",
      price: "",
      originalPrice: "",
      stock: "",
      images: [],
      sizes: [{ size: "", quantity: "" }],
      colors: [],
      isFeatured: false,
    });
  };

  /* =========================
     SUBMIT PRODUCT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const updatedData = {
        ...formData,
        stock: getTotalStock(),
      };

      if (editingProduct) {
        await axiosInstance.put(`/products/${editingProduct._id}`, updatedData);
        triggerToast("✅ Product Updated!");
      } else {
        await axiosInstance.post("/products", updatedData);
        triggerToast("✅ Product Added!");
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      triggerToast("❌ Error Saving Product!");
    }
  };

  /* =========================
     LOADING
  ========================== */
  if (loading) return <Loader size="lg" text="Loading products..." />;

  return (
    <div className="manage-products">
      <Container fluid>
        {/* HEADER */}
        <div className="header-section">
          <h1 className="page-title">📦 Product Dashboard</h1>

          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> Add New Product
          </Button>
        </div>

        {/* STATS */}
        <Row className="stats-row">
          <Col md={3}>
            <div className="stat-card">
              Total Products <h3>{products.length}</h3>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              Featured <h3>{products.filter((p) => p.isFeatured).length}</h3>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              Low Stock <h3>{products.filter((p) => p.stock <= 5).length}</h3>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              Out of Stock <h3>{products.filter((p) => p.stock === 0).length}</h3>
            </div>
          </Col>
        </Row>

        {/* SEARCH */}
        <div className="search-section">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <Form.Text className="helper-text">
            Search products by name or brand
          </Form.Text>
        </div>

        {/* FILTERS */}
        <div className="filter-sort-bar">
          <Form.Select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Running">Running</option>
            <option value="Casual">Casual</option>
            <option value="Sneakers">Sneakers</option>
            <option value="Boots">Boots</option>
          </Form.Select>

          <Form.Select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="featured">Featured</option>
            <option value="normal">Normal</option>
            <option value="out">Out of Stock</option>
          </Form.Select>

          <Form.Select
            className="filter-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
            <option value="stockLow">Stock Low → High</option>
            <option value="stockHigh">Stock High → Low</option>
          </Form.Select>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <Table hover className="products-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>BRAND</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-thumbnail">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                        />
                      ) : (
                        <FaImage />
                      )}
                    </div>
                  </td>

                  <td className="product-name">{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>

                  <td className="product-price">${product.price}</td>

                  <td>
                    <Badge
                      bg={
                        product.stock > 10
                          ? "success"
                          : product.stock > 0
                          ? "warning"
                          : "danger"
                      }
                    >
                      {product.stock}
                    </Badge>
                  </td>

                  <td>
                    {product.stock === 0 ? (
                      <Badge bg="danger">Out</Badge>
                    ) : product.isFeatured ? (
                      <Badge bg="info">Featured</Badge>
                    ) : (
                      <Badge bg="secondary">Normal</Badge>
                    )}
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      className="action-btn"
                      onClick={() => {
                        setViewProduct(product);
                        setEditMode(false);
                      }}
                    >
                      <FaEye />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="action-btn"
                      onClick={() => handleEdit(product)}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="action-btn"
                      onClick={() => setDeleteId(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* PAGINATION */}
          <div className="pagination-box">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {/* =========================
            DELETE CONFIRMATION MODAL
        ========================== */}
        <Modal show={deleteId !== null} onHide={() => setDeleteId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete this product?
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={async () => {
                await axiosInstance.delete(`/products/${deleteId}`);
                triggerToast("🗑 Product Deleted!");
                setDeleteId(null);
                fetchProducts();
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* =========================
            EXTENDED VIEW PRODUCT MODAL
        ========================== */}
        <Modal
          show={viewProduct !== null}
          onHide={() => {
            setViewProduct(null);
            setEditMode(false);
          }}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>👁 Product Details</Modal.Title>
          </Modal.Header>

          {viewProduct && (
            <Modal.Body>
              <Row>
                {/* LEFT: Carousel */}
                <Col md={5}>
                  <Carousel className="product-carousel">
                    {viewProduct.images.map((img, i) => (
                      <Carousel.Item key={i}>
                        <img
                          src={getImageUrl(img)}
                          alt="product"
                          className="carousel-image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>

                  {/* Upload New Images */}
                  {editMode && (
                    <div className="mt-3">
                      <h6 className="section-title">Upload New Images</h6>

                      <ImageUploader
                        onImageUpload={(newImgs) =>
                          setViewProduct({
                            ...viewProduct,
                            images: [...viewProduct.images, ...newImgs],
                          })
                        }
                        existingImages={viewProduct.images}
                      />
                    </div>
                  )}
                </Col>

                {/* RIGHT: Info */}
                <Col md={7}>
                  {/* Name */}
                  <h3>
                    {editMode ? (
                      <Form.Control
                        value={viewProduct.name}
                        onChange={(e) =>
                          setViewProduct({
                            ...viewProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      viewProduct.name
                    )}
                  </h3>

                  {/* Brand */}
                  <p>
                    <strong>Brand:</strong>{" "}
                    {editMode ? (
                      <Form.Control
                        value={viewProduct.brand}
                        onChange={(e) =>
                          setViewProduct({
                            ...viewProduct,
                            brand: e.target.value,
                          })
                        }
                      />
                    ) : (
                      viewProduct.brand
                    )}
                  </p>

                  {/* Created Date */}
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(viewProduct.createdAt).toLocaleDateString()}
                  </p>

                  {/* Copy Product ID */}
                  <p>
                    <strong>Product ID:</strong> {viewProduct._id}
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="ms-2"
                      onClick={() => {
                        navigator.clipboard.writeText(viewProduct._id);
                        triggerToast("📌 Product ID Copied!");
                      }}
                    >
                      Copy
                    </Button>
                  </p>

                  {/* Price */}
                  <p>
                    <strong>Selling Price:</strong> ${viewProduct.price}
                  </p>

                  {/* Discount */}
                  {viewProduct.originalPrice &&
                    viewProduct.originalPrice > viewProduct.price && (
                      <p>
                        <strong>Original Price:</strong> $
                        {viewProduct.originalPrice}{" "}
                        <Badge bg="success" className="ms-2">
                          {Math.round(
                            ((viewProduct.originalPrice - viewProduct.price) /
                              viewProduct.originalPrice) *
                              100
                          )}
                          % OFF
                        </Badge>
                      </p>
                    )}

                  {/* Profit Margin */}
                  {viewProduct.originalPrice && (
                    <p>
                      <strong>Profit Margin:</strong>{" "}
                      <Badge bg="info">
                        $
                        {(
                          viewProduct.originalPrice - viewProduct.price
                        ).toFixed(2)}
                      </Badge>
                    </p>
                  )}

                  {/* Total Stock */}
                  <p>
                    <strong>Total Stock:</strong>{" "}
                    {viewProduct.sizes.reduce(
                      (total, s) => total + Number(s.quantity),
                      0
                    )}{" "}
                    pcs
                  </p>

                  {/* Sizes Inline Edit */}
                  <div className="mt-3">
                    <strong>Sizes:</strong>

                    {editMode ? (
                      viewProduct.sizes.map((s, i) => (
                        <div key={i} className="inline-size-row">
                          <Form.Control
                            type="number"
                            value={s.size}
                            onChange={(e) => {
                              const updated = [...viewProduct.sizes];
                              updated[i].size = e.target.value;
                              setViewProduct({
                                ...viewProduct,
                                sizes: updated,
                              });
                            }}
                          />

                          <Form.Control
                            type="number"
                            value={s.quantity}
                            onChange={(e) => {
                              const updated = [...viewProduct.sizes];
                              updated[i].quantity = e.target.value;
                              setViewProduct({
                                ...viewProduct,
                                sizes: updated,
                              });
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <p>
                        {viewProduct.sizes
                          .map((s) => `${s.size} (${s.quantity})`)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Colors Inline Edit */}
                  <div className="mt-3">
                    <strong>Colors:</strong>{" "}
                    {editMode ? (
                      <Form.Control
                        value={viewProduct.colors.join(", ")}
                        onChange={(e) =>
                          setViewProduct({
                            ...viewProduct,
                            colors: e.target.value
                              .split(",")
                              .map((c) => c.trim()),
                          })
                        }
                      />
                    ) : (
                      viewProduct.colors.join(", ")
                    )}
                  </div>

                  {/* Description Inline Edit */}
                  <div className="mt-3">
                    <strong>Description:</strong>

                    {editMode ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={viewProduct.description}
                        onChange={(e) =>
                          setViewProduct({
                            ...viewProduct,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p>{viewProduct.description}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          )}

          {/* FOOTER */}
          <Modal.Footer>
            {/* Undo */}
            <Button
              variant="warning"
              disabled={!editMode}
              onClick={() => {
                setViewProduct(originalViewProduct);
                triggerToast("↩ Changes Undone!");
              }}
            >
              Undo
            </Button>

            {/* Go Product Page */}
            <Button
              variant="success"
              onClick={() => navigate(`/product/${viewProduct._id}`)}
            >
              🔗 Product Page
            </Button>

            {/* Inline Edit / Save */}
            <Button
              variant="primary"
              onClick={async () => {
                if (editMode) {
                  await axiosInstance.put(
                    `/products/${viewProduct._id}`,
                    viewProduct
                  );
                  triggerToast("✅ Product Updated!");
                  fetchProducts();
                } else {
                  setOriginalViewProduct(
                    JSON.parse(JSON.stringify(viewProduct))
                  );
                }

                setEditMode(!editMode);
              }}
            >
              {editMode ? "💾 Save Changes" : "✏️ Inline Edit"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setViewProduct(null);
                setEditMode(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
                {/* =========================
            PREMIUM ADD / EDIT PRODUCT MODAL
        ========================== */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
          className="glass-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleSubmit}>
            <Modal.Body className="product-modal-body">
              {/* Product Name + Brand */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Text className="helper-text">
                      Enter shoe name (Example: Nike Air Max 270)
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Brand Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      isInvalid={!!errors.brand}
                    />
                    <Form.Text className="helper-text">
                      Enter brand (Example: Adidas, Puma, Nike)
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.brand}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Prices */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Actual Price (MRP)</Form.Label>
                    <Form.Control
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                    />
                    <Form.Text className="helper-text">
                      Original price before discount
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Selling Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      isInvalid={!!errors.price}
                    />
                    <Form.Text className="helper-text">
                      Final price customers will pay
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>

                    {/* Live Discount */}
                    {getDiscountPercent() > 0 && (
                      <div className="live-discount">
                        🎉 Discount:{" "}
                        <span>{getDiscountPercent()}% OFF</span>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Category */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  isInvalid={!!errors.category}
                >
                  <option value="">Select Category</option>
                  <option value="Running">Running</option>
                  <option value="Casual">Casual</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Boots">Boots</option>
                </Form.Select>

                <Form.Text className="helper-text">
                  Select which type of shoe product this is
                </Form.Text>

                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Sizes */}
              <div className="section-box">
                <h6 className="section-title">📏 Sizes & Quantity</h6>

                {formData.sizes.map((s, index) => (
                  <div key={index} className="size-row">
                    <Form.Select
                      value={s.size}
                      onChange={(e) =>
                        handleSizeChange(index, "size", e.target.value)
                      }
                    >
                      <option value="">Select Size</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </Form.Select>

                    <Form.Control
                      type="number"
                      placeholder="Enter Total Quantity for this size"
                      value={s.quantity}
                      onChange={(e) =>
                        handleSizeChange(index, "quantity", e.target.value)
                      }
                    />

                    {index === formData.sizes.length - 1 ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={addSize}
                      >
                        + Add
                      </Button>
                    ) : (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeSize(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}

                {errors.sizes && <p className="error-text">{errors.sizes}</p>}

                {/* Total Stock */}
                <div className="total-stock-box">
                  Total Stock: <strong>{getTotalStock()}</strong> pcs
                </div>
              </div>

              {/* Colors */}
              <div className="section-box">
                <h6 className="section-title">🎨 Colors Available</h6>

                <div className="color-input-row">
                  <Form.Control
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                  />
                  <Button variant="primary" onClick={addColorTag}>
                    + Add
                  </Button>
                </div>

                <Form.Text className="helper-text">
                  Add all available colors for this product
                </Form.Text>

                <div className="color-tags">
                  {formData.colors.map((color, i) => (
                    <span key={i} className="color-tag">
                      {color}
                      <button onClick={() => removeColorTag(color)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <Form.Group className="mb-3 mt-3">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <Form.Text className="helper-text">
                  Write product details, comfort, material, features, etc.
                </Form.Text>
              </Form.Group>

              {/* Images */}
              <div className="section-box">
                <h6 className="section-title">🖼 Upload Product Images</h6>

                <ImageUploader
                  onImageUpload={handleImageUpload}
                  existingImages={formData.images}
                />

                {errors.images && (
                  <p className="error-text">{errors.images}</p>
                )}

                <Form.Text className="helper-text">
                  Upload at least 1 image. First image becomes main thumbnail.
                </Form.Text>

                {/* Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="image-preview-grid">
                    {formData.images.map((img, i) => (
                      <img
                        key={i}
                        src={getImageUrl(img)}
                        alt="preview"
                        className="preview-img"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Featured */}
              <Form.Check
                type="checkbox"
                label="⭐ Mark as Featured Product"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="mt-3"
              />
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>

              <Button variant="primary" type="submit">
                {editingProduct ? "Update Product" : "Save Product"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* =========================
            TOAST NOTIFICATIONS
        ========================== */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={2500}
            autohide
          >
            <Toast.Body>{toastMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default ManageProducts;

