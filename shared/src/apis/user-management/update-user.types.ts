/**
 * Update User API Types
 * Request/response types for updateUser Cloud Function
 */

/**
 * Request to update a user
 */
export interface Request {
  /** User ID to update */
  userId: string;
  /** User data to update */
  userData: {
    name?: string;
    email?: string;
    photoURL?: string;
    role?: string;
    [key: string]: unknown;
  };
}

/**
 * Response from updating user
 */
export interface Response {
  /** Whether update succeeded */
  success: boolean;
  /** Updated user data */
  user?: {
    id: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  /** Error message if failed */
  error?: string;
}
