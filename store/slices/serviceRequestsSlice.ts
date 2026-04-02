import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServiceRequest, ServiceRequestStatus } from '../../types';
import { mockServiceRequests } from '../../data/mockData';

interface ServiceRequestsState {
  items: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceRequestsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchServiceRequests = createAsyncThunk(
  'serviceRequests/fetchAll',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockServiceRequests;
  }
);

export const createServiceRequest = createAsyncThunk(
  'serviceRequests/create',
  async (request: ServiceRequest) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return request;
  }
);

const serviceRequestsSlice = createSlice({
  name: 'serviceRequests',
  initialState,
  reducers: {
    updateStatus(
      state,
      action: PayloadAction<{ id: string; status: ServiceRequestStatus; logMessage: string }>
    ) {
      const { id, status, logMessage } = action.payload;
      const req = state.items.find((r) => r.id === id);
      if (req) {
        req.status = status;
        req.updatedAt = new Date().toISOString();
        req.activityLog.push({
          id: `al_${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: logMessage,
          type: 'status_change',
        });
      }
    },
    addNote(state, action: PayloadAction<{ id: string; note: string }>) {
      const { id, note } = action.payload;
      const req = state.items.find((r) => r.id === id);
      if (req) {
        req.updatedAt = new Date().toISOString();
        req.activityLog.push({
          id: `al_${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: note,
          type: 'note',
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServiceRequests.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load service requests.';
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { updateStatus, addNote } = serviceRequestsSlice.actions;
export default serviceRequestsSlice.reducer;
