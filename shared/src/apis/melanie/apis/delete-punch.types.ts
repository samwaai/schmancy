/**
 * Delete Punch API Types
 *
 * Firebase callable function for deleting manual punches with NGTECO integration support
 */

/**
 * Request to delete a punch
 */
export interface DeletePunchRequest {
  /** ID of the punch to delete */
  punchId: string;
}

/**
 * Response from delete punch operation
 */
export interface DeletePunchResponse {
  /** Whether the deletion was successful */
  success: boolean;

  /** Human-readable message about the operation */
  message: string;

  /** Whether the punch was deleted from NGTECO (if applicable) */
  ngtecoDeleted: boolean;

  /** Error details if deletion failed */
  error?: string;
}
