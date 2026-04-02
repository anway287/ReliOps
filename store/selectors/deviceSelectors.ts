import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

const selectDeviceItems = (state: RootState) => state.devices.items;
const selectSearchQuery = (state: RootState) => state.devices.searchQuery;
const selectServiceRequests = (state: RootState) => state.serviceRequests.items;

export const selectFilteredDevices = createSelector(
  [selectDeviceItems, selectSearchQuery],
  (devices, query) => {
    if (!query.trim()) return devices;
    const lower = query.toLowerCase();
    return devices.filter(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.type.toLowerCase().includes(lower) ||
        d.location.toLowerCase().includes(lower)
    );
  }
);

export const selectOpenRequestCountByDevice = createSelector(
  [selectServiceRequests],
  (requests) => {
    const counts: Record<string, number> = {};
    requests.forEach((r) => {
      if (r.status === 'open' || r.status === 'in_progress') {
        counts[r.deviceId] = (counts[r.deviceId] ?? 0) + 1;
      }
    });
    return counts;
  }
);

export const selectRequestsByDevice = (deviceId: string) =>
  createSelector([selectServiceRequests], (requests) =>
    requests
      .filter((r) => r.deviceId === deviceId)
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
