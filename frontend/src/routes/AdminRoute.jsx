// frontend/src/routes/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AdminRoute = ({ children }) => {
  const { user, token, isLoading, isAdmin } = useAuthStore();

  console.log('AdminRoute Debug:', { 
    user, 
    token: token ? 'exists' : 'missing',
    isLoading,
    isAdmin: isAdmin() 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!token || !user) {
    console.log('No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    console.log('User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted');
  return children;
};

export default AdminRoute;