import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  hostels: [],
  rooms: [],
  users: [],
  stats: {
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_HOSTELS':
      return { ...state, hostels: action.payload };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'ADD_HOSTEL':
      return { ...state, hostels: [...state.hostels, action.payload] };
    case 'UPDATE_HOSTEL':
      return {
        ...state,
        hostels: state.hostels.map(h => 
          h._id === action.payload._id ? action.payload : h
        )
      };
    case 'DELETE_HOSTEL':
      return {
        ...state,
        hostels: state.hostels.filter(h => h._id !== action.payload)
      };
    default:
      return state;
  }
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};