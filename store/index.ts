import { configureStore } from '@reduxjs/toolkit';
import devicesReducer from './slices/devicesSlice';
import serviceRequestsReducer from './slices/serviceRequestsSlice';

export const store = configureStore({
  reducer: {
    devices: devicesReducer,
    serviceRequests: serviceRequestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
