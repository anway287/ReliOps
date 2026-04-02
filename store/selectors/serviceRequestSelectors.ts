import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ServiceRequestStatus, Priority } from '../../types';

const selectServiceRequests = (state: RootState) => state.serviceRequests.items;

export const selectCountsByStatus = createSelector([selectServiceRequests], (requests) => ({
  [ServiceRequestStatus.Open]: requests.filter((r) => r.status === ServiceRequestStatus.Open).length,
  [ServiceRequestStatus.InProgress]: requests.filter((r) => r.status === ServiceRequestStatus.InProgress).length,
  [ServiceRequestStatus.Completed]: requests.filter((r) => r.status === ServiceRequestStatus.Completed).length,
  [ServiceRequestStatus.Cancelled]: requests.filter((r) => r.status === ServiceRequestStatus.Cancelled).length,
}));

export const selectCountsByPriority = createSelector([selectServiceRequests], (requests) => ({
  [Priority.Critical]: requests.filter((r) => r.priority === Priority.Critical).length,
  [Priority.High]: requests.filter((r) => r.priority === Priority.High).length,
  [Priority.Medium]: requests.filter((r) => r.priority === Priority.Medium).length,
  [Priority.Low]: requests.filter((r) => r.priority === Priority.Low).length,
}));

export const selectOverdueRequests = createSelector([selectServiceRequests], (requests) => {
  const now = new Date();
  return requests.filter((r) => {
    const isActive =
      r.status !== ServiceRequestStatus.Completed && r.status !== ServiceRequestStatus.Cancelled;
    const isPast = new Date(r.scheduledDate) < now;
    return isActive && isPast;
  });
});

export const selectRequestById = (id: string) =>
  createSelector([selectServiceRequests], (requests) => requests.find((r) => r.id === id));
