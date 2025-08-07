import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const HostelManagement = () => {
  const [hostels, setHostels] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: { street: '', city: '', state: '', pincode: '' },
    contactInfo: { phone: '', email: '' },
    description: '',
    amenities: [],
    totalFloors: 1,
    totalRooms: 0,
    owner: '',
    isActive: true
  });

  const amenitiesList = [
    'WiFi', 'AC', 'Mess', 'Laundry', 'Parking', 'Security', 'Gym', 'Common Room', 'Hot Water', 'Power Backup'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hostelsResponse, ownersResponse] = await Promise.all([
        apiService.getHostels(),
        apiService.getUsers()
      ]);

      setHostels(hostelsResponse);
      setOwners(ownersResponse.filter(user => user.role === 'owner'));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Handle nested input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: val
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: val
      }));
    }
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
      address: { street: '', city: '', state: '', pincode: '' },
      contactInfo: { phone: '', email: '' },
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
        name: hostelToEdit.name || '',
        address: {
          street: hostelToEdit.address?.street || '',
          city: hostelToEdit.address?.city || '',
          state: hostelToEdit.address?.state || '',
          pincode: hostelToEdit.address?.pincode || ''
        },
        contactInfo: {
          phone: hostelToEdit.contactInfo?.phone || '',
          email: hostelToEdit.contactInfo?.email || ''
        },
        description: hostelToEdit.description || '',
        amenities: hostelToEdit.amenities || [],
        totalFloors: hostelToEdit.totalFloors || 1,
        totalRooms: hostelToEdit.totalRooms || 0,
        owner: hostelToEdit.owner?._id || hostelToEdit.owner || '',
        isActive: hostelToEdit.isActive ?? true
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

    try {
      if (editingHostel) {
        await apiService.updateHostel(editingHostel._id, formData);
        setSuccess('Hostel updated successfully!');
      } else {
        await apiService.createHostel(formData);
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
    if (!ownerId) return 'Unassigned';
    const owner = owners.find(o => o._id === ownerId);
    return typeof owner?.name === 'string' ? owner.name : 'Unassigned';
  };

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
        {hostels.map((hostel) => (
          <div key={hostel._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{hostel.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  hostel.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hostel.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">📍 Address:</span> 
                  {typeof hostel.address === "object"
                    ? `${hostel.address.street}, ${hostel.address.city}, ${hostel.address.state} - ${hostel.address.pincode}`
                    : hostel.address}
                </p>
                <p><span className="font-medium">📞 Phone:</span> {hostel.contactInfo?.phone}</p>
                <p><span className="font-medium">👤 Owner:</span> {getOwnerName(hostel.owner?._id || hostel.owner)}</p>
                <p><span className="font-medium">🏢 Floors:</span> {hostel.totalFloors}</p>
                <p><span className="font-medium">🛏️ Rooms:</span> {hostel.totalRooms}</p>
              </div>

              {/* Amenities */}
              {hostel.amenities && hostel.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {hostel.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                    {hostel.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{hostel.amenities.length - 3} more
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

      {/* Empty State */}
      {hostels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <p className="text-gray-500 text-lg mb-4">No hostels found</p>
          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add First Hostel
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
                {/* Name */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Hostel Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />

                {/* Owner */}
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>

                {/* Address */}
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />

                {/* Contact */}
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                {/* Floors & Rooms */}
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Total Floors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="number"
                  name="totalRooms"
                  value={formData.totalRooms}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Total Rooms"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                {/* Description */}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span>Active Hostel</span>
                </label>

                {/* Submit */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

export default HostelManagement;
