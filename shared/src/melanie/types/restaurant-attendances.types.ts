import type { AttendanceRecord } from './attendance.types';
import type { Shift } from './attendance.types';

// Request type for restaurant attendances endpoint
export interface RestaurantAttendancesRequest {
  restaurantId: string;
  startDate: string;
  endDate: string;
  forceRefresh?: boolean;
}

// Response type for restaurant attendances endpoint
export interface RestaurantAttendancesResponse {
  success: boolean;
  restaurantId: string;
  restaurantName: string;
  startDate: string;
  endDate: string;
  attendances: ProcessedAttendanceRecord[];
  totalAttendances: number;
  totalHours: number;
  devices: Array<{ sn: string; name: string }>;
  warnings?: string[];
  errors?: string[];
}

// Extended attendance record with calculated hours per device
export interface ProcessedAttendanceRecord extends AttendanceRecord {
  shifts: Shift[];
  totalHours: number;

  // Banking
  iban?: string;
  bic?: string;
  ibanRecipientName?: string;

  // Payment
  paymentType?: string;
  hourlyRate?: number;
  flatPaymentAmount?: number;

  // Tips
  excludeFromTips?: boolean;
}