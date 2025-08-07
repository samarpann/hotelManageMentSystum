import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import UserManagement from './UserManagement';
import HostelManagement from './HostelManagement';
import SystemSettings from './SystemSettings';
import { useNavigate } from 'react-router-dom';



const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHostels: 0,
    totalOwners: 0,
    totalRooms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const navigate = useNavigate();

   const handleLogout = async () => {
    try {
      
    } catch (err) {
      console.error('Logout failed:', err);
    }
    logout(); // Clears context/localStorage
    navigate("/login");
  };
  const fetchDashboardStats = async () => {
    try {
      // Fetch dashboard statistics
      // You'll need to create these endpoints in your backend
      const [users, hostels] = await Promise.all([
        apiService.getUsers(),
        apiService.getHostels()
      ]);
      
      setStats({
        totalUsers: users.length || 0,
        totalHostels: hostels.length || 0,
        totalOwners: users.filter(u => u.role === 'owner').length || 0,
        totalRooms: 0 // Calculate from hostels
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'hostels', label: 'Hostel Management', icon: '🏨' },
    { id: 'owners', label: 'Hostel Owners', icon: '👤' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
  ];

  const StatCard = ({ title, value, change, color, icon }) => (
    <div className={`bg-gradient-to-r ${color} text-white p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && <p className="text-sm opacity-80 mt-1">{change}</p>}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+12 this month"
          color="from-blue-500 to-blue-600"
          icon="👥"
        />
        <StatCard
          title="Active Hostels"
          value={stats.totalHostels}
          change="+3 this month"
          color="from-green-500 to-green-600"
          icon="🏨"
        />
        <StatCard
          title="Hostel Owners"
          value={stats.totalOwners}
          change="+2 this month"
          color="from-purple-500 to-purple-600"
          icon="👤"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          change="+15 this month"
          color="from-orange-500 to-orange-600"
          icon="🛏️"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">➕</div>
              <p className="font-medium text-gray-700">Add New User</p>
              <p className="text-sm text-gray-500">Create admin or owner account</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('hostels')}
            className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏨</div>
              <p className="font-medium text-gray-700">Add New Hostel</p>
              <p className="text-sm text-gray-500">Register a new hostel</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-gray-700">View Reports</p>
              <p className="text-sm text-gray-500">System analytics & reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New hostel "Green Valley" registered</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New admin user created</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">System backup completed</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UserManagement />;
      case 'hostels':
        return <HostelManagement />;
      case 'owners':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hostel Owners</h3>
            <p className="text-gray-600">Hostel owner management functionality will be implemented here.</p>
          </div>
        );
      case 'settings':
        return <SystemSettings />;
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports & Analytics</h3>
            <p className="text-gray-600">Reports and analytics will be implemented here.</p>
          </div>
        );
      default:
        return <OverviewTab />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">🏨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Hostel Management</h1>
                <p className="text-sm text-gray-600">Super Admin Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
                {/* <Navigate to="/login" replace /> */}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-lg p-6 h-fit">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;