import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
//... other slice imports

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // flights: flightsReducer,
    // admin: adminReducer,
  },
}); 