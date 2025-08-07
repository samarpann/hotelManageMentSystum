import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import MyHostel from './MyHostel';
import RoomManagement from './RoomManagement';
import { useNavigate } from 'react-router-dom';
 


const HostelOwnerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [myHostel, setMyHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logs
  console.log('HostelOwnerDashboard - User:', user);
  console.log('HostelOwnerDashboard - Loading:', loading);
  console.log('HostelOwnerDashboard - MyHostel:', myHostel);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      
    } catch (err) {
      console.error('Logout failed:', err);
    }
    logout(); // Clears context/localStorage
    navigate("/login");
  };

  useEffect(() => {
    console.log('HostelOwnerDashboard - useEffect triggered');
    fetchMyData();
  }, []);
const fetchMyData = async () => {
  console.log('HostelOwnerDashboard - fetchMyData started');
  try {
    setLoading(true);
    setError(null);

    console.log('Fetching hostels...');
    const hostelsResponse = await apiService.getHostels();
    console.log('Hostels response:', hostelsResponse);

    // ✅ Ensure it's an array
    if (!Array.isArray(hostelsResponse)) {
      throw new Error("Invalid data format: Expected an array of hostels");
    }

    // ✅ Find hostel assigned to this owner
    const assignedHostel = hostelsResponse.find(h =>
      h.owner?._id === user._id || h.owner === user._id
    );

    console.log('Assigned hostel:', assignedHostel);
    setMyHostel(assignedHostel || null);

    if (assignedHostel) {
      try {
        console.log('Fetching rooms for hostel:', assignedHostel._id);
        const roomsResponse = await apiService.getRooms(assignedHostel._id);

        if (!Array.isArray(roomsResponse)) {
          throw new Error("Invalid data format: Expected an array of rooms");
        }

        console.log('Rooms response:', roomsResponse);
        setRooms(roomsResponse);

        // ✅ Calculate stats safely
        const occupiedRooms = roomsResponse.filter(r => r.isOccupied).length;
        const availableRooms = roomsResponse.filter(r => !r.isOccupied).length;
        const monthlyRevenue = roomsResponse.reduce(
          (sum, r) => sum + (r.isOccupied ? r.rent : 0),
          0
        );

        setStats({
          totalRooms: roomsResponse.length,
          occupiedRooms,
          availableRooms,
          monthlyRevenue
        });
      } catch (roomError) {
        console.warn('Room fetching failed:', roomError);
        setRooms([]);
      }
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err.message || "Failed to fetch data");
  } finally {
    setLoading(false);
    console.log('HostelOwnerDashboard - fetchMyData completed');
  }
};


  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'hostel', label: 'My Hostel', icon: '🏨' },
    { id: 'rooms', label: 'Room Management', icon: '🛏️' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
  ];

  const StatCard = ({ title, value, color, icon, subtitle }) => (
    <div className={`bg-gradient-to-r ${color} text-white p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const OverviewTab = () => {
    if (!myHostel) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-6">🏨</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Hostel Assigned</h3>
          <p className="text-gray-600 mb-6">
            You don't have any hostel assigned to your account yet. Please contact the administrator to assign a hostel to you.
          </p>
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              <strong>Contact Admin:</strong> Once a hostel is assigned to you, you'll be able to manage rooms, view bookings, and handle all hostel operations from this dashboard.
            </p>
          </div>
          {/* Debug info */}
          <div className="mt-4 text-left text-xs text-gray-500">
            <p><strong>Debug Info:</strong></p>
            <p>User ID: {user?._id}</p>
            <p>User Role: {user?.role}</p>
            <p>User Name: {user?.name}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Hostel Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{myHostel.name}</h2>
              <p className="opacity-90">{myHostel.city}, {myHostel.state}</p>
              <p className="text-sm opacity-80 mt-1">{myHostel.totalFloors} floors • {myHostel.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                myHostel.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {myHostel.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            color="from-blue-500 to-blue-600"
            icon="🛏️"
          />
          <StatCard
            title="Occupied Rooms"
            value={stats.occupiedRooms}
            color="from-green-500 to-green-600"
            icon="✅"
            subtitle={`${stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% occupancy`}
          />
          <StatCard
            title="Available Rooms"
            value={stats.availableRooms}
            color="from-orange-500 to-orange-600"
            icon="🔓"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            color="from-purple-500 to-purple-600"
            icon="💰"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('rooms')}
              className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🛏️</div>
                <p className="font-medium text-gray-700">Manage Rooms</p>
                <p className="text-sm text-gray-500">Add, edit room details</p>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('hostel')}
              className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🏨</div>
                <p className="font-medium text-gray-700">Hostel Details</p>
                <p className="text-sm text-gray-500">Update hostel information</p>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('bookings')}
              className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <p className="font-medium text-gray-700">View Bookings</p>
                <p className="text-sm text-gray-500">Manage reservations</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Dashboard loaded successfully</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Hostel data synchronized</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingsTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings & Reservations</h3>
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-gray-600">Booking management functionality will be implemented here</p>
        <p className="text-sm text-gray-500 mt-2">View current bookings, check-ins, check-outs, and payment status</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'hostel':
        return <MyHostel hostel={myHostel} onUpdate={fetchMyData} />;
      case 'rooms':
        return <RoomManagement hostel={myHostel} onUpdate={fetchMyData} />;
      case 'bookings':
        return <BookingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchMyData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Try Again
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching hostel data...</p>
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
              <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">🏨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Hostel Management</h1>
                <p className="text-sm text-gray-600">Owner Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">Hostel Owner</p>
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
                      ? 'bg-purple-600 text-white'
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

export default HostelOwnerDashboard;