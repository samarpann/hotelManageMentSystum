import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'triple', 'dormitory'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  rent: {
    type: Number,
    required: true
  },
  facilities: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  residents: [{
    name: String,
    phone: String,
    email: String,
    joinDate: Date
  }]
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);