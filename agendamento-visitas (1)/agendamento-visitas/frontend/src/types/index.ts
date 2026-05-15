export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type AppointmentStatus = 'SCHEDULED' | 'CANCELED' | 'COMPLETED';

export interface Appointment {
  id: number;
  startTime: string;
  endTime: string;
  reason: string;
  status: AppointmentStatus;
  userId: number;
  user?: { id: number; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  hour: string;
  startTime: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  weekend: boolean;
  slots: Slot[];
}
