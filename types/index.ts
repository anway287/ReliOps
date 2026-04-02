export enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
  Warning = 'warning',
}

export enum ServiceRequestStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum Priority {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum Category {
  Repair = 'repair',
  PreventiveMaintenance = 'preventive_maintenance',
  Inspection = 'inspection',
  Replacement = 'replacement',
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'status_change' | 'note';
}

export interface ServiceRequest {
  id: string;
  deviceId: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  status: ServiceRequestStatus;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityLogEntry[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  location: string;
  lastSeen: string;
  lastMaintenanceDate: string | null;
}
