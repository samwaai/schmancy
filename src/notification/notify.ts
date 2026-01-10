import { Observable, tap, finalize, catchError } from 'rxjs'
import { $notify, NotificationOptions } from './notification-service'

export interface NotifyOptions {
	/**
	 * Message to show while the operation is in progress
	 */
	loadingMessage?: string
	/**
	 * Message to show when the operation completes successfully
	 */
	successMessage?: string
	/**
	 * Message to show when the operation fails (can be a function to format error)
	 */
	errorMessage?: string | ((error: Error | unknown) => string)
	/**
	 * Type of notification for loading state
	 */
	loadingType?: NotificationOptions['type']
	/**
	 * Type of notification for success state
	 */
	successType?: NotificationOptions['type']
	/**
	 * Type of notification for error state
	 */
	errorType?: NotificationOptions['type']
	/**
	 * Whether to auto-dismiss the loading notification on complete/error
	 */
	autoDismissLoading?: boolean
	/**
	 * Duration for success notification (ms). Use 0 for persistent
	 */
	successDuration?: number
	/**
	 * Duration for error notification (ms). Use 0 for persistent
	 */
	errorDuration?: number
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
export function notify<T>(options: NotifyOptions) {
	return (source: Observable<T>): Observable<T> => {
		let loadingNotificationId: string | undefined

		// Show loading notification if message provided
		if (options.loadingMessage) {
			loadingNotificationId = $notify.show({
				message: options.loadingMessage,
				type: options.loadingType || 'info',
				duration: 0, // Persistent until dismissed
				showProgress: true, // Show indeterminate progress by default
			})
		}

		return source.pipe(
			tap((value) => {
				// Check if the emitted value contains progress information
				// Common patterns: { progress: number }, { loaded: number, total: number }, etc.
				if (loadingNotificationId && typeof value === 'object' && value !== null) {
					let progress: number | undefined

					// Type guard helpers for progress patterns
					const valueRecord = value as Record<string, unknown>

					// Check for different progress patterns
					if ('progress' in valueRecord && typeof valueRecord.progress === 'number') {
						progress = valueRecord.progress
					} else if ('loaded' in valueRecord && 'total' in valueRecord) {
						const loaded = valueRecord.loaded
						const total = valueRecord.total
						if (typeof loaded === 'number' && typeof total === 'number' && total > 0) {
							progress = (loaded / total) * 100
						}
					}
					
					// Update notification with progress if available
					if (progress !== undefined) {
						// We need to update the progress of the notification
						// For now, we'll update the message to show progress percentage
						$notify.update?.(loadingNotificationId, {
							message: `${options.loadingMessage} (${Math.round(progress)}%)`,
						})
					}
				}
				
				// Check if this is the final success emission (not a progress update)
				// Typically file uploads emit progress events then a final result
				const isProgressUpdate = typeof value === 'object' && value !== null && 
					('progress' in value || ('loaded' in value && 'total' in value))
				
				if (!isProgressUpdate) {
					// On successful final emission, dismiss loading and show success
					if (loadingNotificationId && options.autoDismissLoading !== false) {
						$notify.dismiss(loadingNotificationId)
						loadingNotificationId = undefined
					}

					if (options.successMessage) {
						$notify.show({
							message: options.successMessage,
							type: options.successType || 'success',
							duration: options.successDuration ?? 2000,
						})
					}
				}
			}),
			catchError((error) => {
				// On error, dismiss loading and show error
				if (loadingNotificationId && options.autoDismissLoading !== false) {
					$notify.dismiss(loadingNotificationId)
					loadingNotificationId = undefined
				}

				if (options.errorMessage) {
					const message = typeof options.errorMessage === 'function' 
						? options.errorMessage(error)
						: options.errorMessage
					
					$notify.show({
						message,
						type: options.errorType || 'error',
						duration: options.errorDuration ?? 3000,
					})
				}

				// Re-throw the error to maintain the error flow
				throw error
			}),
			finalize(() => {
				// Clean up any remaining loading notification
				if (loadingNotificationId && options.autoDismissLoading !== false) {
					$notify.dismiss(loadingNotificationId)
				}
			})
		)
	}
}

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
export function notifyProgress<T>(
	loadingMessage: string,
	successMessage?: string,
	errorMessage?: string
) {
	return notify<T>({
		loadingMessage,
		successMessage: successMessage || undefined,
		errorMessage: errorMessage || undefined,
		autoDismissLoading: true,
	})
}