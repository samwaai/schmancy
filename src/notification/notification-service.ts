import { NotificationOptions } from './notification-container'

/**
 * Notification service for centralized notification management.
 * Provides a simple API for showing notifications.
 */
export class NotificationService {
	private static instance: NotificationService

	// Default notification options
	private static DEFAULT_OPTIONS: Partial<NotificationOptions> = {
		duration: 1000, // 1 seconds - long enough to be readable
		closable: true,
		playSound: true,
	}

	// Private constructor for singleton pattern
	private constructor() {}

	/**
	 * Get the singleton instance
	 */
	public static getInstance(): NotificationService {
		if (!NotificationService.instance) {
			NotificationService.instance = new NotificationService()
		}
		return NotificationService.instance
	}

	/**
	 * Show a notification
	 * @returns The ID of the created notification
	 */
	public notify(options: NotificationOptions): string {
		// Apply default options
		const completeOptions = {
			...NotificationService.DEFAULT_OPTIONS,
			...options,
			// Override with duraton from options if provided, otherwise use default
			duration: options.duration ?? NotificationService.DEFAULT_OPTIONS.duration,
		}

		const id = completeOptions.id || `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`

		// Create and dispatch event
		const event = new CustomEvent('schmancy-notification', {
			bubbles: true,
			composed: true,
			detail: {
				...completeOptions,
				id,
			},
		})

		window.dispatchEvent(event)
		return id
	}

	/**
	 * Show an info notification
	 */
	public info(message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message: message ?? '',
			type: 'info',
			duration: message ? options.duration : 1,
			...options,
		})
	}

	/**
	 * Show a success notification
	 */
	public success(message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message: message ?? '',
			type: 'success',
			duration: message ? options.duration : 1,
			...options,
		})
	}

	/**
	 * Show a warning notification
	 */
	public warning(message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message: message ?? '',
			type: 'warning',
			duration: message ? options.duration : 1,
			...options,
		})
	}

	/**
	 * Show an error notification
	 */
	public error(message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message: message ?? '',
			type: 'error',
			duration: message ? options.duration : 1,
			...options,
		})
	}

	/**
	 * Show a notification with a custom duration
	 */
	public customDuration(
		message: string,
		duration: number,
		options: Partial<Omit<NotificationOptions, 'message' | 'duration'>> = {},
	): string {
		return this.notify({
			message,
			duration,
			...options,
		})
	}

	/**
	 * Show a persistent notification (won't auto-dismiss)
	 */
	public persistent(message: string, options: Partial<Omit<NotificationOptions, 'message' | 'duration'>> = {}): string {
		return this.notify({
			message,
			duration: 0, // Zero duration means no auto-close
			...options,
		})
	}
}

/**
 * Global notification utility - provides a quick way to show notifications
 */
export const $notify = {
	/**
	 * Show a notification
	 */
	show: (options: NotificationOptions): string => {
		return NotificationService.getInstance().notify(options)
	},

	/**
	 * Show an info notification
	 */
	info: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().info(message, options)
	},

	/**
	 * Show a success notification
	 */
	success: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().success(message, options)
	},

	/**
	 * Show a warning notification
	 */
	warning: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().warning(message, options)
	},

	/**
	 * Show an error notification
	 */
	error: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().error(message, options)
	},

	/**
	 * Show a notification with a custom duration
	 * @param message The notification message
	 * @param duration Duration in milliseconds before auto-dismissing (0 for no auto-dismiss)
	 * @param options Additional notification options
	 */
	customDuration: (
		message: string,
		duration: number,
		options: Partial<Omit<NotificationOptions, 'message' | 'duration'>> = {},
	): string => {
		return NotificationService.getInstance().customDuration(message, duration, options)
	},

	/**
	 * Show a persistent notification that won't auto-dismiss
	 */
	persistent: (message: string, options: Partial<Omit<NotificationOptions, 'message' | 'duration'>> = {}): string => {
		return NotificationService.getInstance().persistent(message, options)
	},
}

export default NotificationService
