/**
 * Melanie Sync Punches API Types
 * Request/response types for attendance punch synchronization
 */

/**
 * Request to sync attendance punches
 */
export interface Request {
  /** Organization ID */
  orgId: string;
  /** Start date for sync (YYYY-MM-DD) */
  startDate: string;
  /** End date for sync (YYYY-MM-DD) */
  endDate: string;
  /** Optional employee code to filter by specific employee */
  employeeCode?: string;
}

/**
 * Response from punch sync
 */
export interface Response {
  /** Whether sync succeeded */
  success: boolean;
  /** Message describing the sync result */
  message: string;
  /** Number of punches synced */
  syncedCount: number;
  /** Total number of punches found */
  totalPunches: number;
  /** Date range of the sync */
  dateRange: {
    /** Start date */
    start: string;
    /** End date */
    end: string;
  };
  /** Array of error messages if any occurred */
  errors?: string[];
}
