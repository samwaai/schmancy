// Transformed Types for Frontend
export interface AttendancePunch {
  id?: string;          // Punch ID for ignore functionality - optional for backward compatibility
  punch_time: string;
  punch_from: string;
  punch_date?: string;  // The actual date this punch occurred (YYYY-MM-DD) - optional for backward compatibility
  ignored?: boolean;    // Whether this punch is ignored - optional for backward compatibility
  manualEntry?: {       // Manual entry metadata - present only for manually created punches
    reason: string;
    createdBy: string;
    createdAt: string;
  };
}

export interface AttendanceRecord {
  employee_code: string;
  first_name: string;
  last_name: string;
  date: string;
  punches: AttendancePunch[];
  department: string;
  total_hours?: number;
  tipAmount?: number;
  // Business fields (new)
  businessId?: string;
  businessName?: string;
  // Restaurant fields (legacy - kept for backward compatibility)
  restaurantId?: string;
  restaurantName?: string;

  // Payment & Tips Fields - added at runtime from employees collection
  iban?: string;              // Employee's IBAN for payment
  bic?: string;               // Employee's BIC for payment
  ibanRecipientName?: string; // Recipient name for payment
  paymentType?: string;       // Payment type: 'hourly' or 'flat'
  hourlyRate?: number;        // Hourly rate for hourly employees
  flatPaymentAmount?: number; // Flat payment amount for flat-rate employees
  excludeFromTips?: boolean;  // Whether to exclude from tips calculation

  // Tax Information - added at runtime from employees collection
  taxIdNumber?: string;       // Steuer ID Nr. (German tax identification number)
}

// Shift tracking (previously DeviceHours)
export interface Shift {
  device: string;
  hours: number;
  punches: AttendancePunch[];
}

export interface AttendanceApiResponse {
  success: boolean;
  data: AttendanceRecord[];
  startDate: string;
  endDate: string;
  total: number;
  timezone?: string;
  cached?: boolean;
}

// Manual attendance creation types
export interface ManualAttendanceRequest {
  employee_code: string;
  attendance_time: string;
  punch_from: string; // Required - device/location identifier
  reason: string; // Required - explanation for manual change
  changedBy: string; // Required - email of person making the change
  employeeName?: string; // Optional - for better email context
}

export interface ManualAttendanceResponse {
  success: boolean;
  data?: any; // NGTeco response data
  emailSent?: boolean;
  error?: string;
  details?: any;
}
