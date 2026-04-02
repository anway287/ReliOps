import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Device } from '../../types';
import { mockDevices } from '../../data/mockData';

interface DevicesState {
  items: Device[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: DevicesState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
};

export const fetchDevices = createAsyncThunk('devices/fetchDevices', async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockDevices;
});

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDevices.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load devices.';
      });
  },
});

export const { setSearchQuery } = devicesSlice.actions;
export default devicesSlice.reducer;
