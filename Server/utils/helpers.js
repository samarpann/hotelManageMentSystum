export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const calculateOccupancyRate = (occupied, total) => {
  return total > 0 ? Math.round((occupied / total) * 100) : 0;
};

export const generateRoomNumber = (floor, roomIndex) => {
  return `${floor}${String(roomIndex).padStart(2, '0')}`;
};