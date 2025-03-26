import { NotificationOptions } from './notification-container'

/**
 * Notification service for centralized notification management.
 * Provides a simple API for showing notifications.
 */
export class NotificationService {
	private static instance: NotificationService

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
		const id = options.id || `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`

		// Create and dispatch event
		const event = new CustomEvent('schmancy-notification', {
			bubbles: true,
			composed: true,
			detail: {
				...options,
				id,
			},
		})

		window.dispatchEvent(event)
		return id
	}

	/**
	 * Show an info notification
	 */
	public info(message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message,
			type: 'info',
			...options,
		})
	}

	/**
	 * Show a success notification
	 */
	public success(message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message,
			type: 'success',
			...options,
		})
	}

	/**
	 * Show a warning notification
	 */
	public warning(message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message,
			type: 'warning',
			...options,
		})
	}

	/**
	 * Show an error notification
	 */
	public error(message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message,
			type: 'error',
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
	info: (message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().info(message, options)
	},

	/**
	 * Show a success notification
	 */
	success: (message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().success(message, options)
	},

	/**
	 * Show a warning notification
	 */
	warning: (message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().warning(message, options)
	},

	/**
	 * Show an error notification
	 */
	error: (message: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string => {
		return NotificationService.getInstance().error(message, options)
	},
}

export default NotificationService
