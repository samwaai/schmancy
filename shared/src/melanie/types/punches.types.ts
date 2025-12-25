/**
 * Punch Types - Single source of truth for attendance punch data
 *
 * IMPORTANT: This replaces NGTecoAttendanceItem for all new code
 * Each punch is stored as an individual document in Firebase
 */

import type { DocumentAuditLog } from '../../types/audit.types';

/**
 * Individual punch record from NGTeco stored in Firebase
 *
 * Collection: 'punches'
 * Document structure: Each punch = one document
 *
 * Query examples:
 * - By organization & employee: where('orgId', '==', 'ORG123').where('employeeId', '==', 'EMP001')
 * - By organization & date range: where('orgId', '==', 'ORG123').where('punchTimestampUTC', '>=', '2025-01-01T00:00:00.000Z').where('punchTimestampUTC', '<', '2025-02-01T00:00:00.000Z')
 * - For single date: where('punchTimestampUTC', '>=', '2025-01-31T00:00:00.000Z').where('punchTimestampUTC', '<', '2025-02-01T00:00:00.000Z')
 */
export interface Punch {
  // ========== Core Punch Data ==========
  id: string;                 // Unique punch ID from NGTeco or Firebase document ID
  orgId: string;              // Organization ID for multi-tenant support
  employeeId: string;         // Employee's unique ID (e.g., "EMP001")
  att_date: string;           // Date format (e.g., "2025-01-31 " with trailing space for NGTeco compatibility)
  attendance_status: string;  // Punch time in HH:MM:SS format (e.g., "14:30:00")
  timezone: string;           // Original timezone offset (e.g., "+01:00")
  punch_from: string;         // Device ID where punch was recorded (e.g., "NMR2242100913" or "qr-{businessId}")

  // ========== QR Scanner Fields ==========
  punchType?: 'in' | 'out';   // For QR scanner: check-in or check-out
  punchTime?: string;         // ISO timestamp for QR punches (alternative to att_date + attendance_status)
  businessId?: string;        // Business ID for QR scanner punches
  businessName?: string;      // Business name for display

  // ========== UTC Timestamp for Querying ==========
  punchTimestampUTC: string;  // ISO 8601 UTC timestamp (e.g., "2025-01-31T13:30:00.000Z")
  
  // ========== Metadata ==========
  syncedAt: string;           // ISO 8601 timestamp when this punch was synced to Firebase
  source: 'ngteco' | 'manual' | 'qr-scanner'; // Data source: 'ngteco' for synced, 'manual' for our system, 'qr-scanner' for QR attendance

  // ========== Sync Queue Fields ==========
  syncQueueRef?: string;      // Reference to queue document
  syncStatus?: 'pending' | 'synced' | 'failed';  // Sync status
  externalId?: string;        // External system ID (e.g., NGTeco record ID)

  // ========== Manual Entry Metadata ==========
  manualEntry?: {
    reason: string;
    createdBy: string;
    createdAt: string;
  };

  // ========== Runtime Enrichment Fields ==========
  // These fields are added at runtime by enriching from employees collection
  // They are not stored in the punches collection to avoid duplication
  employee_name?: string;     // Added at runtime from employees collection
  first_name?: string;        // Added at runtime from employees collection
  last_name?: string;         // Added at runtime from employees collection
  department_name?: string;   // Added at runtime from employees collection

  // ========== Payment & Tips Fields ==========
  // These fields are added at runtime from employees collection for payment processing
  iban?: string;              // Employee's IBAN for payment
  bic?: string;               // Employee's BIC for payment
  ibanRecipientName?: string; // Recipient name for payment
  paymentType?: string;       // Payment type: 'hourly' or 'flat'
  hourlyRate?: number;        // Hourly rate for hourly employees
  flatPaymentAmount?: number; // Flat payment amount for flat-rate employees
  excludeFromTips?: boolean;  // Whether to exclude from tips calculation

  // ========== Audit & Ignore Fields ==========
  ignored?: boolean;          // If true, exclude this punch from all calculations
  audit?: DocumentAuditLog;   // Audit trail for changes to this punch
}


/**
 * Query parameters for fetching punches
 */
export interface PunchQuery {
  startDateUTC: string;       // Start date in UTC (YYYY-MM-DD)
  endDateUTC: string;         // End date in UTC (YYYY-MM-DD)
  employeeId?: string;        // Optional: filter by employee
  limit?: number;             // Optional: limit number of results
}

/**
 * Aggregated punch data for a specific date
 * Used for attendance reports and hour calculations
 */
export interface DailyPunchSummary {
  employeeId: string;
  date: string;               // YYYY-MM-DD format
  punches: Punch[];           // All punches for this employee on this date
  totalHours?: number;        // Calculated total hours (if applicable)
  firstPunch?: string;        // First punch time
  lastPunch?: string;         // Last punch time
}
