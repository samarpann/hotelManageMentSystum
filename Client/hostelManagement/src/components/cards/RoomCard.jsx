import React from 'react';
import { Users, DollarSign, Edit, Trash2 } from 'lucide-react';

const RoomCard = ({ room, onEdit, onDelete, showActions = true }) => {
  const getStatusColor = () => {
    if (!room.isAvailable) return 'bg-gray-100 text-gray-800';
    if (room.currentOccupancy === 0) return 'bg-green-100 text-green-800';
    if (room.currentOccupancy < room.capacity) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    if (!room.isAvailable) return 'Unavailable';
    if (room.currentOccupancy === 0) return 'Available';
    if (room.currentOccupancy < room.capacity) return 'Partially Occupied';
    return 'Full';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Room {room.roomNumber}
          </h3>
          <p className="text-sm text-gray-600 capitalize">{room.type}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {showActions && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(room)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(room._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Capacity: {room.capacity}</span>
          </div>
          <span>Occupied: {room.currentOccupancy}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>₹{room.rent}/month</span>
        </div>
      </div>

      {room.facilities && room.facilities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Facilities</h4>
          <div className="flex flex-wrap gap-1">
            {room.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              >
                {facility}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                +{room.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {room.residents && room.residents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Residents</h4>
          <div className="space-y-1">
            {room.residents.slice(0, 2).map((resident, index) => (
              <div key={index} className="text-sm text-gray-600">
                {resident.name} - {resident.phone}
              </div>
            ))}
            {room.residents.length > 2 && (
              <div className="text-sm text-gray-500">
                +{room.residents.length - 2} more residents
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;