/**
 * Melanie NGTECO Device Person API Types
 * Request/response types for NGTECO device person operations
 */

/**
 * Result of assigning a person to a single device
 */
export interface PersonAssignmentResult {
  /** Device ID */
  deviceId: string;
  /** Person ID */
  personId: string;
  /** Whether assignment succeeded */
  success: boolean;
  /** Result message */
  message: string;
}

/**
 * Request to manage person-device associations in NGTECO
 */
export interface Request {
  /** Organization ID */
  orgId: string;
  /** Person ID to assign */
  personId: string;
  /** Array of device IDs to assign person to */
  deviceIds: string[];
}

/**
 * Response from device person operations
 */
export interface Response {
  /** Whether at least one assignment succeeded */
  success: boolean;
  /** Successfully assigned devices */
  successfulAssignments: PersonAssignmentResult[];
  /** Failed assignments */
  failedAssignments: PersonAssignmentResult[];
  /** Summary message */
  message: string;
}
