import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Login from './pages/auth/Login.jsx';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import OwnerDashboard from './pages/dashboard/OwnerDashboard.jsx';
import UserManagement from './pages/users/UserManagement.jsx';
import HostelManagement from './pages/hostels/HostelManagement.jsx';
import RoomManagement from './pages/rooms/RoomManagement.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardRouter />
                </PrivateRoute>
              } />
              
              <Route path="/users" element={
                <PrivateRoute roles={['superadmin', 'admin']}>
                  <UserManagement />
                </PrivateRoute>
              } />
              
              <Route path="/hostels" element={
                <PrivateRoute>
                  <HostelManagement />
                </PrivateRoute>
              } />
              
              <Route path="/rooms" element={
                <PrivateRoute>
                  <RoomManagement />
                </PrivateRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

const DashboardRouter = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'owner':
      return <OwnerDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

export default App;