import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import HostelList from './HostelList';
import OwnerList from './OwnerList';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalHostels: 0,
    totalOwners: 0,
    totalRooms: 0,
    activeHostels: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [hostels, users] = await Promise.all([
        apiService.getHostels(),
        apiService.getUsers()
      ]);
      
      const owners = users.filter(u => u.role === 'hostel_owner');
      const activeHostels = hostels.filter(h => h.isActive);
      
      setStats({
        totalHostels: hostels.length || 0,
        totalOwners: owners.length || 0,
        activeHostels: activeHostels.length || 0,
        totalRooms: hostels.reduce((sum, h) => sum + (h.totalRooms || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'hostels', label: 'Hostel Management', icon: '🏨' },
    { id: 'owners', label: 'Hostel Owners', icon: '👤' },
    { id: 'reports', label: 'Reports', icon: '📈' },
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
          title="Total Hostels"
          value={stats.totalHostels}
          change="+3 this month"
          color="from-blue-500 to-blue-600"
          icon="🏨"
        />
        <StatCard
          title="Active Hostels"
          value={stats.activeHostels}
          change="+2 this month"
          color="from-green-500 to-green-600"
          icon="✅"
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
            onClick={() => setActiveTab('hostels')}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏨</div>
              <p className="font-medium text-gray-700">Manage Hostels</p>
              <p className="text-sm text-gray-500">Add, edit or delete hostels</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('owners')}
            className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">👤</div>
              <p className="font-medium text-gray-700">Manage Owners</p>
              <p className="text-sm text-gray-500">View and manage hostel owners</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-gray-700">View Reports</p>
              <p className="text-sm text-gray-500">Hostel analytics & reports</p>
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
              <p className="text-sm font-medium text-gray-800">Hostel "Green Valley" activated</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New owner "John Doe" registered</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Hostel "Blue Sky" updated</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports & Analytics</h3>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800">This Month</h4>
            <p className="text-2xl font-bold text-blue-600">+5</p>
            <p className="text-sm text-blue-600">New Hostels</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800">Occupancy Rate</h4>
            <p className="text-2xl font-bold text-green-600">78%</p>
            <p className="text-sm text-green-600">Average</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800">Revenue</h4>
            <p className="text-2xl font-bold text-purple-600">₹2.5L</p>
            <p className="text-sm text-purple-600">This Month</p>
          </div>
        </div>

        {/* Charts would go here */}
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600">Detailed analytics and charts will be implemented here</p>
          <p className="text-sm text-gray-500 mt-2">Revenue trends, occupancy rates, popular hostels, etc.</p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'hostels':
        return <HostelList onStatsUpdate={fetchDashboardStats} />;
      case 'owners':
        return <OwnerList onStatsUpdate={fetchDashboardStats} />;
      case 'reports':
        return <ReportsTab />;
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
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
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

export default AdminDashboard;