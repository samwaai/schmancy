import { $sounds, type Feeling } from '../audio'
import SchmancyNotification, { NotificationType } from './notification'

export interface NotificationOptions {
	id?: string
	title?: string
	message: string
	type?: NotificationType
	duration?: number
	closable?: boolean
	playSound?: boolean
	showProgress?: boolean
}

const typeToFeeling: Record<NotificationType, Feeling> = {
	info: 'curious',
	success: 'content',
	warning: 'anxious',
	error: 'disappointed',
}

// Track last mouse position
let lastClickPosition = { x: window.innerWidth - 100, y: 50 }

// Global mousedown listener to track click position
if (typeof window !== 'undefined') {
	window.addEventListener(
		'mousedown',
		(e: MouseEvent) => {
			lastClickPosition = { x: e.clientX, y: e.clientY }
		},
		{ capture: true, passive: true },
	)
}

// Track current notification element
let currentNotification: SchmancyNotification | null = null

/**
 * Notification service for centralized notification management.
 * Provides a simple API for showing notifications.
 */
export class NotificationService {
	private static instance: NotificationService
	private notificationStack: string[] = []
	private audioVolume = 0.1

	// Default notification options
	private static DEFAULT_OPTIONS: Partial<NotificationOptions> = {
		duration: 1000, // 1 seconds - long enough to be readable
		closable: true,
		playSound: true,
	}

	// Type-specific default durations (in milliseconds)
	private static TYPE_DURATIONS: Record<NotificationType, number> = {
		success: 1500, // 1.5 seconds - quick confirmation
		info: 2000, // 2 seconds - informational
		warning: 2500, // 2.5 seconds - needs attention
		error: 2500, // 2.5 seconds - important
	}

	// Private constructor for singleton pattern
	private constructor() {
		$sounds.setVolume(this.audioVolume)
	}

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

		// Add to stack for tracking
		this.notificationStack.push(id)

		// Remove existing notification if any (only 1 at a time)
		if (currentNotification) {
			currentNotification.remove()
			currentNotification = null
		}

		// Create the notification element directly
		const notification = document.createElement('sch-notification') as SchmancyNotification
		notification.id = id
		notification.title = completeOptions.title || ''
		notification.message = completeOptions.message
		notification.type = completeOptions.type || 'info'
		notification.duration = completeOptions.duration || 1000
		notification.closable = completeOptions.closable !== false
		notification.playSound = false // We handle sound here
		notification.showProgress = completeOptions.showProgress || false
		notification.startPosition = { ...lastClickPosition }

		// Play sound if enabled
		if (completeOptions.playSound !== false) {
			$sounds.play(typeToFeeling[notification.type])
		}

		// Listen for close event
		notification.addEventListener('close', () => {
			const index = this.notificationStack.indexOf(id)
			if (index > -1) {
				this.notificationStack.splice(index, 1)
			}
			notification.remove()
			if (currentNotification === notification) {
				currentNotification = null
			}
		})

		// Append to body
		document.body.appendChild(notification)
		currentNotification = notification

		return id
	}

	/**
	 * Dismiss a notification
	 * @param id Optional notification ID. If not provided, dismisses the most recent notification
	 */
	public dismiss(id?: string): void {
		let targetId: string | undefined

		if (id) {
			// Remove specific notification from stack
			const index = this.notificationStack.indexOf(id)
			if (index > -1) {
				this.notificationStack.splice(index, 1)
				targetId = id
			}
		} else {
			// Remove most recent notification (last in stack)
			targetId = this.notificationStack.pop()
		}

		if (targetId && currentNotification && currentNotification.id === targetId) {
			currentNotification.close()
		}
	}

	/**
	 * Update a notification's content
	 */
	public update(id: string, options: Partial<NotificationOptions>): void {
		if (currentNotification && currentNotification.id === id) {
			if (options.title !== undefined) currentNotification.title = options.title
			if (options.message !== undefined) currentNotification.message = options.message
			if (options.type !== undefined) currentNotification.type = options.type
		}
	}

	/**
	 * Show an info notification
	 */
	public info(message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string {
		return this.notify({
			message: message ?? '',
			type: 'info',
			duration: message ? (options.duration ?? NotificationService.TYPE_DURATIONS.info) : 1,
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
			duration: message ? (options.duration ?? NotificationService.TYPE_DURATIONS.success) : 1,
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
			duration: message ? (options.duration ?? NotificationService.TYPE_DURATIONS.warning) : 1,
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
			duration: message ? (options.duration ?? NotificationService.TYPE_DURATIONS.error) : 1,
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

	/**
	 * Dismiss a notification
	 * @param id Optional notification ID. If not provided, dismisses the most recent notification (queue-like behavior)
	 */
	dismiss: (id?: string): void => {
		return NotificationService.getInstance().dismiss(id)
	},

	/**
	 * Update a notification's content
	 */
	update: (id: string, options: Partial<NotificationOptions>): void => {
		return NotificationService.getInstance().update(id, options)
	},
}

export default NotificationService
