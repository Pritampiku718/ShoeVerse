import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaUserShield, FaUser, FaSearch } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`/admin/users/${userToDelete._id}`);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleAdmin = (user) => {
    setSelectedUser(user);
    setIsAdmin(user.isAdmin);
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axiosInstance.put(`/admin/users/${selectedUser._id}`, {
        isAdmin: isAdmin
      });
      toast.success('User role updated successfully');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader text="Loading users..." />;

  return (
    <div className="manage-users">
      <Container fluid>
        <div className="header-section">
          <h1 className="page-title">Manage Users</h1>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="users-table-container">
          <Table hover className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td className="user-name">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.isAdmin ? (
                        <Badge bg="primary" className="role-badge">
                          <FaUserShield className="me-1" /> Admin
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="role-badge">
                          <FaUser className="me-1" /> User
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="action-btn me-2"
                        onClick={() => handleToggleAdmin(user)}
                        title="Toggle Admin Status"
                      >
                        <FaUserShield />
                      </Button>
                      
                      {/* Show delete button only for non-admin users */}
                      {!user.isAdmin && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="action-btn"
                          onClick={() => handleDeleteClick(user)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Toggle Admin Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="modal-header-dark">
            <Modal.Title>Change User Role</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-dark">
            <p className="mb-3">
              Update role for <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
            </p>
            <Form.Check
              type="switch"
              id="admin-switch"
              label="Grant Admin Privileges"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="admin-switch"
            />
          </Modal.Body>
          <Modal.Footer className="modal-footer-dark">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateUser}>
              Update Role
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton className="modal-header-dark">
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-dark">
            <p>Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?</p>
            <p className="text-danger">This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer className="modal-footer-dark">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageUsers;