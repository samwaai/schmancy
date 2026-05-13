import { fromEvent } from 'rxjs'
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

const typeDurations: Record<NotificationType, number> = {
	success: 1500,
	info: 2000,
	warning: 2500,
	error: 2500,
}

$sounds.setVolume(0.1)

// Track last mouse position via RxJS
let lastClickPosition = { x: window.innerWidth - 100, y: 50 }
if (typeof window !== 'undefined') {
	fromEvent<MouseEvent>(window, 'mousedown', { capture: true, passive: true } as AddEventListenerOptions).subscribe(
		e => {
			lastClickPosition = { x: e.clientX, y: e.clientY }
		},
	)
}

let currentNotification: SchmancyNotification | null = null
const notificationStack: string[] = []

function show(options: NotificationOptions): string {
	const id = options.id ?? `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`
	notificationStack.push(id)

	if (currentNotification) {
		currentNotification.remove()
		currentNotification = null
	}

	const notification = document.createElement('sch-notification') as SchmancyNotification
	notification.id = id
	notification.title = options.title ?? ''
	notification.message = options.message
	notification.type = options.type ?? 'info'
	notification.duration = options.duration ?? 1000
	notification.closable = options.closable !== false
	notification.playSound = false
	notification.showProgress = options.showProgress ?? false
	notification.startPosition = { ...lastClickPosition }

	if (options.playSound !== false) {
		$sounds.play(typeToFeeling[notification.type])
	}

	fromEvent(notification, 'close').subscribe(() => {
		const index = notificationStack.indexOf(id)
		if (index > -1) notificationStack.splice(index, 1)
		notification.remove()
		if (currentNotification === notification) currentNotification = null
	})

	document.body.appendChild(notification)
	currentNotification = notification
	return id
}

/**
 * Global notification (toast) utility. Fire-and-forget API for success,
 * error, info, and warning toasts, plus a low-level `show` for custom
 * notifications.
 *
 * @service
 * @summary Toast notifications — success, error, info, warning.
 * @method show(options: NotificationOptions) - Low-level; show any NotificationOptions.
 * @method success(message, options?) - Green success toast.
 * @method error(message, options?) - Red error toast.
 * @method info(message, options?) - Blue informational toast.
 * @method warning(message, options?) - Amber warning toast.
 */
export const $notify = {
	show,

	info: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string =>
		show({
			message: message ?? '',
			type: 'info',
			duration: message ? (options.duration ?? typeDurations.info) : 1,
			...options,
		}),

	success: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string =>
		show({
			message: message ?? '',
			type: 'success',
			duration: message ? (options.duration ?? typeDurations.success) : 1,
			...options,
		}),

	warning: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string =>
		show({
			message: message ?? '',
			type: 'warning',
			duration: message ? (options.duration ?? typeDurations.warning) : 1,
			...options,
		}),

	error: (message?: string, options: Partial<Omit<NotificationOptions, 'message' | 'type'>> = {}): string =>
		show({
			message: message ?? '',
			type: 'error',
			duration: message ? (options.duration ?? typeDurations.error) : 1,
			...options,
		}),

	customDuration: (
		message: string,
		duration: number,
		options: Partial<Omit<NotificationOptions, 'message' | 'duration'>> = {},
	): string => show({ message, duration, ...options }),

	persistent: (message: string, options: Partial<Omit<NotificationOptions, 'message' | 'duration'>> = {}): string =>
		show({ message, duration: 0, ...options }),

	dismiss: (id?: string): void => {
		const targetId = id ? (notificationStack.splice(notificationStack.indexOf(id), 1)[0]) : notificationStack.pop()
		if (targetId && currentNotification?.id === targetId) currentNotification.close()
	},

	update: (id: string, options: Partial<NotificationOptions>): void => {
		if (currentNotification?.id !== id) return
		if (options.title !== undefined) currentNotification.title = options.title
		if (options.message !== undefined) currentNotification.message = options.message
		if (options.type !== undefined) currentNotification.type = options.type
	},
}

