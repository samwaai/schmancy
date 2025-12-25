/**
 * Melanie NGTECO Devices API Types
 * Request/response types for NGTECO devices operations
 */

/**
 * Device information
 */
export interface Device {
  /** Device ID */
  id: string;
  /** Device name (alias or name) */
  name: string;
  /** Device type/model */
  type: string;
  /** Device serial number */
  sn: string;
}

/**
 * Request to get NGTECO devices
 */
export interface Request {
  /** Organization ID */
  orgId: string;
}

/**
 * Response with NGTECO devices
 */
export interface Response {
  /** Whether operation succeeded */
  success: boolean;
  /** Array of device data */
  data: Device[];
  /** Total number of devices */
  total: number;
}
