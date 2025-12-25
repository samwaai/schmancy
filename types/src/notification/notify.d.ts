import { Observable } from 'rxjs';
import { NotificationOptions } from './notification-service';
export interface NotifyOptions {
    /**
     * Message to show while the operation is in progress
     */
    loadingMessage?: string;
    /**
     * Message to show when the operation completes successfully
     */
    successMessage?: string;
    /**
     * Message to show when the operation fails (can be a function to format error)
     */
    errorMessage?: string | ((error: any) => string);
    /**
     * Type of notification for loading state
     */
    loadingType?: NotificationOptions['type'];
    /**
     * Type of notification for success state
     */
    successType?: NotificationOptions['type'];
    /**
     * Type of notification for error state
     */
    errorType?: NotificationOptions['type'];
    /**
     * Whether to auto-dismiss the loading notification on complete/error
     */
    autoDismissLoading?: boolean;
    /**
     * Duration for success notification (ms). Use 0 for persistent
     */
    successDuration?: number;
    /**
     * Duration for error notification (ms). Use 0 for persistent
     */
    errorDuration?: number;
}
/**
 * Wraps an Observable with notification lifecycle management.
 * Shows a loading notification with progress indicator, then auto-dismisses and shows success/error notification.
 *
 * @example
 * ```typescript
 * // Basic usage with progress indicator
 * someApiCall().pipe(
 *   notify({
 *     loadingMessage: 'Loading data...',
 *     successMessage: 'Data loaded successfully!',
 *     errorMessage: 'Failed to load data'
 *   })
 * ).subscribe()
 *
 * // With custom durations
 * saveData().pipe(
 *   notify({
 *     loadingMessage: 'Saving...',
 *     successMessage: 'Saved!',
 *     successDuration: 5000, // Success stays for 5 seconds
 *     errorMessage: (err) => `Save failed: ${err.message}`,
 *     errorDuration: 0 // Error is persistent until dismissed
 *   })
 * ).subscribe()
 *
 * // Full configuration example
 * uploadFile().pipe(
 *   notify({
 *     loadingMessage: 'Uploading file...',
 *     loadingType: 'info',
 *     successMessage: 'Upload complete!',
 *     successType: 'success',
 *     successDuration: 3000,
 *     errorMessage: (err) => `Upload failed: ${err.message}`,
 *     errorType: 'error',
 *     errorDuration: 10000,
 *     autoDismissLoading: true
 *   })
 * ).subscribe()
 * ```
 */
export declare function notify<T>(options: NotifyOptions): (source: Observable<T>) => Observable<T>;
/**
 * Simplified version for API calls that just need loading and auto-dismiss.
 * Perfect for fire-and-forget operations where you want to show progress.
 *
 * @example
 * ```typescript
 * downloadData().pipe(
 *   notifyProgress('Downloading...')
 * ).subscribe()
 *
 * // With custom messages
 * saveDocument().pipe(
 *   notifyProgress('Saving document...', 'Document saved!', 'Save failed')
 * ).subscribe()
 * ```
 */
export declare function notifyProgress<T>(loadingMessage: string, successMessage?: string, errorMessage?: string): (source: Observable<T>) => Observable<T>;
