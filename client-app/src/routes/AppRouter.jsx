import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CustomerDashboard from '../pages/customer/CustomerDashboard';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';

// Components
import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Default redirect based on user role */}
        <Route
          path="/"
          element={
            user ? (
              user.userRole === 'Admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user.userRole === 'Customer' ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/airline/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* Add more admin routes here */}
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="Customer">
              <CustomerLayout>
                <CustomerDashboard />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        {/* Airline Routes - Placeholder for future implementation */}
        <Route
          path="/airline/*"
          element={
            <ProtectedRoute role="Airline">
              <div>Airline Dashboard - Coming Soon</div>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
