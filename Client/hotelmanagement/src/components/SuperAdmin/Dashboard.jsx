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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
    logout();
    navigate("/login");
  };

  const fetchDashboardStats = async () => {
    try {
      const [users, hostels] = await Promise.all([
        apiService.getUsers(),
        apiService.getHostels()
      ]);
      
      setStats({
        totalUsers: users.length || 0,
        totalHostels: hostels.length || 0,
        totalOwners: users.filter(u => u.role === 'owner').length || 0,
        totalRooms: hostels.reduce((sum, hostel) => sum + (hostel.rooms || 0), 0)
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
    { id: 'owners', label: 'Hostel Owners', icon: '👔' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
  ];

  const StatCard = ({ title, value, change, color, icon }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            {change && (
              <p className={`text-xs mt-1 flex items-center ${
                change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                <span className="mr-1">{change.startsWith('+') ? '↑' : '↓'}</span>
                {change.replace(/^[+-]/, '')}
              </p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
            <p className="opacity-90 mt-1">Here's what's happening with your system today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setActiveTab('reports')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+12 this month"
          color="bg-indigo-500"
          icon="👥"
        />
        <StatCard
          title="Active Hostels"
          value={stats.totalHostels}
          change="+3 this month"
          color="bg-teal-500"
          icon="🏨"
        />
        <StatCard
          title="Hostel Owners"
          value={stats.totalOwners}
          change="+2 this month"
          color="bg-purple-500"
          icon="👔"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          change="+15 this month"
          color="bg-orange-500"
          icon="🛏️"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <span className="text-xl text-blue-600">➕</span>
              </div>
              <p className="font-medium text-gray-800 group-hover:text-blue-700">Add New User</p>
              <p className="text-sm text-gray-500 mt-1">Create admin or owner account</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('hostels')}
            className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <span className="text-xl text-green-600">🏨</span>
              </div>
              <p className="font-medium text-gray-800 group-hover:text-green-700">Add New Hostel</p>
              <p className="text-sm text-gray-500 mt-1">Register a new hostel</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <span className="text-xl text-purple-600">📊</span>
              </div>
              <p className="font-medium text-gray-800 group-hover:text-purple-700">View Reports</p>
              <p className="text-sm text-gray-500 mt-1">System analytics & reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { 
              id: 1, 
              title: 'New hostel "Green Valley" registered', 
              time: '2 hours ago', 
              icon: '🏨', 
              color: 'bg-green-500' 
            },
            { 
              id: 2, 
              title: 'New admin user created', 
              time: '5 hours ago', 
              icon: '👤', 
              color: 'bg-blue-500' 
            },
            { 
              id: 3, 
              title: 'System backup completed', 
              time: '1 day ago', 
              icon: '💾', 
              color: 'bg-purple-500' 
            },
            { 
              id: 4, 
              title: 'Maintenance scheduled for tomorrow', 
              time: '2 days ago', 
              icon: '🛠️', 
              color: 'bg-yellow-500' 
            }
          ].map(activity => (
            <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`h-8 w-8 rounded-full ${activity.color} flex items-center justify-center text-white mr-3 mt-1`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
          ))}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Hostel Owners</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add New Owner
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
              <div className="text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-1">No hostel owners yet</h4>
              <p className="text-gray-500 max-w-md mx-auto">You haven't added any hostel owners. Click the button above to add your first owner.</p>
            </div>
          </div>
        );
      case 'settings':
        return <SystemSettings />;
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Reports & Analytics</h3>
              <div className="flex space-x-2">
                <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Export
                </button>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Generate Report
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">User Growth</h4>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center text-gray-400">
                  User growth chart will appear here
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">Hostel Occupancy</h4>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center text-gray-400">
                  Occupancy chart will appear here
                </div>
              </div>
            </div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-gray-500 hover:text-gray-600 lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🏨</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">HostelHub Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium text-gray-700">{user?.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hidden md:inline-block" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
              <p className="text-xs text-gray-500">Super Admin Panel</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <span className="ml-auto h-2 w-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Need help?</p>
                    <p className="text-xs text-gray-500">Contact our support team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="p-6 overflow-y-auto h-full">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-800 font-medium capitalize">{activeTab}</span>
              </div>
              
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;