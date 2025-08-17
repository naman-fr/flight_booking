import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* More nested admin routes */}
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        {/*... Airline and Customer Routes */}
        
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </Router>
  );
}

export default AppRouter; 