import React from 'react';
import { MapPin, Phone, Users, Edit, Trash2 } from 'lucide-react';

const HostelCard = ({ hostel, onEdit, onDelete, showActions = true }) => {
  const occupancyRate = hostel.totalRooms > 0 
    ? Math.round((hostel.occupiedRooms / hostel.totalRooms) * 100) 
    : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{hostel.name}</h3>
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(hostel)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(hostel._id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{hostel.address.street}, {hostel.address.city}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          <span>{hostel.contactInfo.phone}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <span>{hostel.occupiedRooms}/{hostel.totalRooms} rooms occupied</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Occupancy Rate</span>
          <span>{occupancyRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
      </div>

      {hostel.facilities && hostel.facilities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Facilities</h4>
          <div className="flex flex-wrap gap-1">
            {hostel.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {facility}
              </span>
            ))}
            {hostel.facilities.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{hostel.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelCard;