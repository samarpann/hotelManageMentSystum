import api from './api.js';

const roomService = {
  getRooms: async (hostelId = null) => {
    const params = hostelId ? { hostelId } : {};
    const response = await api.get('/rooms', { params });
    return response.data;
  },

  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  }
};

export default roomService;