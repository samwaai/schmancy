/**
 * Punch Sync Queue Item - Root-level collection for triggering Cloud Functions
 * Location: /punchSyncQueue (not under any subcollection)
 */
export interface PunchSyncQueueItem {
  /** Document ID */
  id: string;

  /** Organization ID */
  orgId: string;

  /** Reference to melanie/punches document */
  punchId: string;

  /** Minimal sync data (not duplicating punch data) */
  syncData: {
    employeeId: string;
    timestamp: string;
    deviceId: string;
    employeeEmail?: string;
    employeeName?: string;
    changedBy?: string;
    reason?: string;
  };

  /** Current status of the sync operation */
  status: 'pending' | 'processing' | 'completed' | 'failed';

  /** Creation timestamp (ISO string) */
  createdAt: string;

  /** Number of sync attempts */
  attempts: number;

  /** External system ID after successful sync (e.g., NGTeco record ID) */
  externalId?: string;

  /** Last error message if sync failed */
  lastError?: string;
}