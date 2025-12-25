import type { AttendanceRecord } from './attendance.types';
import type { Shift } from './attendance.types';

/**
 * Employee view data types for public employee view interface
 * Used by both frontend and backend for employee view functionality
 */

/**
 * Public employee data for payroll view
 * Contains only the information needed for employee self-service view
 */
export interface EmployeeViewEmployee {
  employee_code: string;
  employee_name: string;
  iban: string;
  bic?: string;
  paymentType: string;
  hourlyRate?: number;
  flatPaymentAmount?: number;
  professionId?: string;
  // Tips-related fields removed
}

/**
 * Shift details for multi-shift detection
 */
export interface ShiftInfo {
  start: string;
  end: string;
  hours: number;
  device?: string;
  deviceName?: string;
}

/**
 * Extended shift details for attendance records
 */
export interface ShiftDetails {
  shiftCount: number;
  shifts: ShiftInfo[];
  totalHours: number;
}

/**
 * Extended attendance record with shift and device information
 */
export interface AttendanceRecordWithDetails extends AttendanceRecord {
  shiftDetails?: ShiftDetails;
  deviceHours?: Shift[];
}

/**
 * Summary information for employee view
 */
export interface EmployeeViewSummary {
  totalDays: number;
  totalHours: number;
  // totalTips field removed
  startDate: string;
  endDate: string;
}

/**
 * Complete employee view data structure
 * Contains all data needed for employee self-service view
 */
export interface EmployeeViewData {
  employee: EmployeeViewEmployee;
  attendance: AttendanceRecordWithDetails[];
  summary: EmployeeViewSummary;
}

/**
 * Employee view API response
 * Standard API response format for employee view endpoints
 */
export interface EmployeeViewResponse {
  success: boolean;
  data?: EmployeeViewData;
  error?: string;
}
