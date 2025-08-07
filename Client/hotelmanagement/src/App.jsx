import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// import ProtectedRoute from './components/Shared/ProtectedRoute';
import Login from './components/Auth/Login';
import SuperAdminDashboard from './components/SuperAdmin/Dashboard';
import AdminDashboard from './components/Admin/Dashboard';
// import HostelOwnerDashboard from './components/HostelOwner/Dashboard';
import './App.css';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HostelOwnerDashboard from './components/HostelOwner/Dashobard';
// import HostelOwnerDashboard from './components/HostelOwner/Dashobard';

// Main App Content Component
const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.role)} replace />
            ) : (
              <Login />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/super-admin/*" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/owner/*" 
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <HostelOwnerDashboard/>
            </ProtectedRoute>
          } 
        />

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-gray-600 text-2xl">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

// Helper function to get dashboard route based on user role
const getDashboardRoute = (role) => {
  switch (role) {
    case 'superadmin':
      return '/super-admin';
    case 'admin':
      return '/admin';
    case 'owner':
      return '/owner';
    default:
      return '/login';
  }
};

// Main App Component
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;