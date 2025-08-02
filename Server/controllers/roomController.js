import Room from '../models/Room.js';
import Hostel from '../models/Hostel.js';

export const getRooms = async (req, res) => {
  try {
    const { hostelId } = req.query;
    const query = hostelId ? { hostel: hostelId } : {};
    
    if (req.user.role === 'owner') {
      const userHostels = await Hostel.find({ owner: req.user._id }).select('_id');
      const hostelIds = userHostels.map(h => h._id);
      query.hostel = { $in: hostelIds };
    }

    const rooms = await Room.find(query).populate('hostel', 'name');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    
    // Update hostel total rooms count
    await Hostel.findByIdAndUpdate(req.body.hostel, {
      $inc: { totalRooms: 1 }
    });
    
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    await Room.findByIdAndDelete(req.params.id);
    
    // Update hostel total rooms count
    await Hostel.findByIdAndUpdate(room.hostel, {
      $inc: { totalRooms: -1 }
    });
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};