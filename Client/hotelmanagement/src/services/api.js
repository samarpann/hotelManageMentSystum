// 2
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth APIs
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // User APIs
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Hostel APIs
  async getHostels() {
    return this.request('/hostels');
  }

  async createHostel(hostelData) {
    return this.request('/hostels', {
      method: 'POST',
      body: JSON.stringify(hostelData),
    });
  }

  async updateHostel(hostelId, hostelData) {
    return this.request(`/hostels/${hostelId}`, {
      method: 'PUT',
      body: JSON.stringify(hostelData),
    });
  }

  async deleteHostel(hostelId) {
    return this.request(`/hostels/${hostelId}`, {
      method: 'DELETE',
    });
  }

  async getHostelById(hostelId) {
    return this.request(`/hostels/${hostelId}`);
  }

  // Room APIs
  async getRooms(hostelId) {
    return this.request(`/rooms?hostelId=${hostelId}`);
  }

  async createRoom(roomData) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async updateRoom(roomId, roomData) {
    return this.request(`/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  }

  async deleteRoom(roomId) {
    return this.request(`/rooms/${roomId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();