import Hostel from '../models/Hostel.js';
import Room from '../models/Room.js';

export const getHostels = async (req, res) => {
  try {
    const query = req.user.role === 'owner' ? { owner: req.user._id } : {};
    const hostels = await Hostel.find(query).populate('owner', 'name email');
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHostel = async (req, res) => {
  try {
    const hostelData = { ...req.body, owner: req.user._id };
    const hostel = await Hostel.create(hostelData);
    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    await Room.deleteMany({ hostel: req.params.id });
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHostelStats = async (req, res) => {
  try {
    const totalHostels = await Hostel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ currentOccupancy: { $gt: 0 } });
    
    res.json({
      totalHostels,
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};