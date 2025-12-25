/**
 * Payload that is encoded in the QR code
 * Supports both businessId (new) and restaurantId (legacy) for backward compatibility
 */
export interface QRPayload {
  orgId: string;
  restaurantId: string; // Legacy field for backward compatibility
  businessId?: string; // New field - will eventually replace restaurantId
  timestamp: number;
  nonce?: string; // Optional - removed from new pipe-delimited format (timestamp is unique per second)
  signature: string; // Truncated to 10 chars (60 bits entropy)
}

/**
 * Request sent when an employee scans a QR code to check in/out
 * The system automatically determines if it's a check-in or check-out based on the last punch
 */
export interface QRCheckInRequest {
  qrData: string;
  employeeId: string;
  // Note: orgId removed as it should come from auth context or QR payload
}

/**
 * Response from the QR check-in function
 */
export interface QRCheckInResponse {
  success: boolean;
  action: 'in' | 'out'; // Automatically determined based on last punch
  timestamp: string;
  message?: string;
  restaurantId?: string; // Keep for backward compatibility
  businessId?: string; // New field for business ID
  employeeName?: string;
}

/**
 * Request to generate a QR code for a business
 */
export interface QRGenerateRequest {
  orgId: string;
  restaurantId?: string; // Legacy field for backward compatibility
  businessId?: string; // New field - preferred over restaurantId
}

/**
 * Response containing the generated QR code data
 */
export interface QRGenerateResponse {
  qrData: string;
  timestamp: number;
}

/**
 * Signed QR payload with HMAC signature
 */
export interface SignedQRPayload {
  payload: Omit<QRPayload, 'signature'>;
  signature: string;
}