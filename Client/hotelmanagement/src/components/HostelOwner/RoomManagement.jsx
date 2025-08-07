import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const RoomManagement = ({ hostel, onUpdate }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: 1,
    type: 'single',
    rent: '',
    capacity: 1,
    isAC: false,
    isOccupied: false,
    facilities: [],
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roomFacilities = [
    'Attached Bathroom', 'Balcony', 'Study Table', 'Wardrobe', 'Wi-Fi', 'TV', 'Refrigerator', 'Geyser'
  ];

  useEffect(() => {
    if (hostel) {
      fetchRooms();
    }
  }, [hostel]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRooms(hostel._id);
      setRooms(response);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to fetch rooms');
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

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      floor: 1,
      type: 'single',
      rent: '',
      capacity: 1,
      isAC: false,
      isOccupied: false,
      facilities: [],
      description: ''
    });
    setEditingRoom(null);
    setError('');
    setSuccess('');
  };

  const openModal = (roomToEdit = null) => {
    if (roomToEdit) {
      setFormData({
        roomNumber: roomToEdit.roomNumber,
        floor: roomToEdit.floor,
        type: roomToEdit.type,
        rent: roomToEdit.rent,
        capacity: roomToEdit.capacity,
        isAC: roomToEdit.isAC,
        isOccupied: roomToEdit.isOccupied,
        facilities: roomToEdit.facilities || [],
        description: roomToEdit.description || ''
      });
      setEditingRoom(roomToEdit);
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

    try {
      const roomData = { ...formData, hostelId: hostel._id };
      
      if (editingRoom) {
        await apiService.updateRoom(editingRoom._id, roomData);
        setSuccess('Room updated successfully!');
      } else {
        await apiService.createRoom(roomData);
        setSuccess('Room created successfully!');
      }
      
      fetchRooms();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setError(error.message || 'Failed to save room');
    }
  };

  const handleDelete = async (roomId, roomNumber) => {
    if (window.confirm(`Are you sure you want to delete room "${roomNumber}"?`)) {
      try {
        await apiService.deleteRoom(roomId);
        setSuccess('Room deleted successfully!');
        fetchRooms();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.message || 'Failed to delete room');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const getFloorOptions = () => {
    if (!hostel) return [];
    return Array.from({ length: hostel.totalFloors }, (_, i) => i + 1);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesFloor = filterFloor === 'all' || room.floor === parseInt(filterFloor);
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesFloor && matchesType;
  });

  if (!hostel) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-6">🏨</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Hostel Assigned</h3>
        <p className="text-gray-600">Please contact the administrator to assign a hostel to your account.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading rooms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
          <p className="text-gray-600">Manage rooms in {hostel.name}</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <span className="mr-2">🛏️</span>
          Add New Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Floor</label>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Floors</option>
              {getFloorOptions().map(floor => (
                <option key={floor} value={floor}>Floor {floor}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
              <option value="dormitory">Dormitory</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </div>
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

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Room {room.roomNumber}</h3>
                  <p className="text-sm text-gray-500">Floor {room.floor}</p>
                </div>
                <div className="flex space-x-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    room.isOccupied 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {room.isOccupied ? 'Occupied' : 'Available'}
                  </span>
                  {room.isAC && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      AC
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Capacity:</span>
                  <span>{room.capacity} person{room.capacity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rent:</span>
                  <span className="font-semibold text-green-600">₹{room.rent}/month</span>
                </div>
              </div>

              {/* Facilities */}
              {room.facilities && room.facilities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.facilities.slice(0, 3).map((facility) => (
                      <span key={facility} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {facility}
                      </span>
                    ))}
                    {room.facilities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{room.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openModal(room)}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id, room.roomNumber)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-gray-400 text-6xl mb-4">🛏️</div>
          <p className="text-gray-500 text-lg mb-4">
            {filterFloor !== 'all' || filterType !== 'all' ? 'No rooms match your filters' : 'No rooms found'}
          </p>
          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add First Room
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
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
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="e.g., 101, A-201"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor *
                    </label>
                    <select
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {getFloorOptions().map(floor => (
                        <option key={floor} value={floor}>Floor {floor}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
                      <option value="dormitory">Dormitory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent (₹) *
                    </label>
                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAC"
                      checked={formData.isAC}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Air Conditioned (AC)</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isOccupied"
                      checked={formData.isOccupied}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Currently Occupied</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Facilities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roomFacilities.map(facility => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional room details or special notes..."
                  />
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
                    {editingRoom ? 'Update Room' : 'Create Room'}
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

export default RoomManagement;