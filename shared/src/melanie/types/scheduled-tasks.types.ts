/**
 * Shared types for daily scheduled tasks system
 */

/**
 * Result from executing a single task
 */
export interface DailyTaskResult {
  taskName: string;
  success: boolean;
  itemsProcessed: number;
  itemsSucceeded: number;
  itemsFailed: number;
  errors: Array<{
    item: string;
    error: string;
  }>;
  duration: number; // milliseconds
  message?: string;
}

/**
 * Summary of all daily tasks execution
 */
export interface DailyTasksSummary {
  executedAt: string; // ISO timestamp
  totalDuration: number;
  tasksExecuted: number;
  tasksSucceeded: number;
  tasksFailed: number;
  totalItemsProcessed: number;
  totalItemsSucceeded: number;
  totalItemsFailed: number;
  taskResults: DailyTaskResult[];
}

/**
 * Employee NGTeco cleanup tracking
 */
export interface EmployeeNgtecoCleanupDetails {
  processedAt: string; // ISO timestamp
  devicesRemoved: number;
  hrDeleted: boolean;
}
