import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const HostelList = ({ onStatsUpdate }) => {
  const [hostels, setHostels] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    description: '',
    amenities: [],
    totalFloors: 1,
    totalRooms: 0,
    owner: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const amenitiesList = [
    'WiFi', 'AC', 'Mess', 'Laundry', 'Parking', 'Security', 'Gym', 'Common Room', 'Hot Water', 'Power Backup'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hostelsResponse, usersResponse] = await Promise.all([
        apiService.getHostels(),
        apiService.getUsers()
      ]);
      
      setHostels(hostelsResponse);
      setOwners(usersResponse.filter(user => user.role === 'owner'));
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      description: '',
      amenities: [],
      totalFloors: 1,
      totalRooms: 0,
      owner: '',
      isActive: true
    });
    setEditingHostel(null);
    setError('');
    setSuccess('');
  };

  const openModal = (hostelToEdit = null) => {
    if (hostelToEdit) {
      setFormData({
        name: hostelToEdit.name,
        address: hostelToEdit.address,
        city: hostelToEdit.city,
        state: hostelToEdit.state,
        pincode: hostelToEdit.pincode,
        phone: hostelToEdit.phone,
        email: hostelToEdit.email,
        description: hostelToEdit.description || '',
        amenities: hostelToEdit.amenities || [],
        totalFloors: hostelToEdit.totalFloors || 1,
        totalRooms: hostelToEdit.totalRooms || 0,
        owner: hostelToEdit.owner?._id || hostelToEdit.owner || '',
        isActive: hostelToEdit.isActive
      });
      setEditingHostel(hostelToEdit);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
    name: formData.name,
    contactInfo: {
      email: formData.email,
      phone: formData.phone
    },
    address: {
      street: formData.address, // you might want to rename "address" to "street" in formData
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    },
    description: formData.description,
    amenities: formData.amenities,
    totalFloors: formData.totalFloors,
    totalRooms: formData.totalRooms,
    owner: formData.owner,
    isActive: formData.isActive
  };
    try {
     if (editingHostel) {
  await apiService.updateHostel(editingHostel._id, payload);
  setSuccess('Hostel updated successfully!');
} else {
  await apiService.createHostel(payload);
  setSuccess('Hostel created successfully!');
}

      
      fetchData();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setError(error.message || 'Failed to save hostel');
    }
  };

  const handleDelete = async (hostelId, hostelName) => {
    if (window.confirm(`Are you sure you want to delete hostel "${hostelName}"?`)) {
      try {
        await apiService.deleteHostel(hostelId);
        setSuccess('Hostel deleted successfully!');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.message || 'Failed to delete hostel');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const getOwnerName = (ownerId) => {
    const owner = owners.find(o => o._id === ownerId);
    return owner ? owner.name : 'Unassigned';
  };

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && hostel.isActive) ||
                         (filterStatus === 'inactive' && !hostel.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading hostels...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hostel Management</h2>
          <p className="text-gray-600">Manage all hostels in the system</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <span className="mr-2">🏨</span>
          Add New Hostel
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search hostels by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHostels.map((hostel) => (
          <div key={hostel._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{hostel.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  hostel.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hostel.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">📍</span> {hostel.city}, {hostel.state}</p>
                <p><span className="font-medium">📞</span> {hostel.phone}</p>
                <p><span className="font-medium">👤</span> {getOwnerName(hostel.owner?._id || hostel.owner)}</p>
                <div className="flex justify-between">
                  <span><span className="font-medium">🏢</span> {hostel.totalFloors} floors</span>
                  <span><span className="font-medium">🛏️</span> {hostel.totalRooms} rooms</span>
                </div>
              </div>

              {/* Amenities */}
              {hostel.amenities && hostel.amenities.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {hostel.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                    {hostel.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{hostel.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openModal(hostel)}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hostel._id, hostel.name)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHostels.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterStatus !== 'all' ? 'No hostels match your search' : 'No hostels found'}
          </p>
          {(!searchTerm && filterStatus === 'all') && (
            <button
              onClick={() => openModal()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add First Hostel
            </button>
          )}
        </div>
      )}

      {/* Modal - Similar to SuperAdmin but simplified */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-300 text-green-700 px-3 py-2 rounded text-sm">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hostel Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner *
                    </label>
                    <select
                      name="owner"
                      value={formData.owner || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Owner</option>
                      {owners.map(owner => (
                        <option key={owner._id} value={owner._id}>
                          {owner.name} ({owner.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rest of form fields similar to SuperAdmin but with admin-appropriate styling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State *"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode *"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="totalFloors"
                    placeholder="Total Floors *"
                    value={formData.totalFloors}
                    onChange={handleInputChange}
                    min="1"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="number"
                    name="totalRooms"
                    placeholder="Total Rooms"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Active Hostel</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingHostel ? 'Update Hostel' : 'Create Hostel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelList;