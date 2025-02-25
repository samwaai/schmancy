import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { debounceTime, fromEvent, race, timer } from 'rxjs'
import { SchmancyNotification } from './notification'

export type TNotification = 'success' | 'error' | 'warning' | 'info'
export type TNotificationConfig = {
	duration?: number
	referenceElement?: HTMLElement
}

// Track cursor position globally
let lastMouseX = window.innerWidth / 2
let lastMouseY = window.innerHeight / 2

fromEvent(document, 'mousemove')
	.pipe(
		debounceTime(100), // Throttle to 10fps
	)
	.subscribe((e: MouseEvent) => {
		console.count()
		lastMouseX = e.clientX
		lastMouseY = e.clientY
	})

async function createNotification(
	message: string,
	type: TNotification,
	config?: TNotificationConfig,
): Promise<SchmancyNotification> {
	const notification = document.createElement('schmancy-notification') as SchmancyNotification
	notification.type = type
	notification.innerHTML = message

	// Temporarily hide the notification and add to DOM to calculate dimensions
	notification.style.visibility = 'hidden'
	document.body.appendChild(notification)

	// Determine reference element (same as before)
	const referenceElement = config?.referenceElement || {
		getBoundingClientRect: () => ({
			width: 0,
			height: 0,
			x: lastMouseX,
			y: lastMouseY,
			top: lastMouseY,
			right: lastMouseX,
			bottom: lastMouseY,
			left: lastMouseX,
			toJSON: () => ({}),
		}),
	}

	// Compute position with accurate dimensions
	const { x, y } = await computePosition(referenceElement, notification, {
		strategy: 'fixed',
		placement: config?.referenceElement ? 'top' : 'right-start',
		middleware: [offset(8), flip(), shift({ padding: 5 })],
	})

	// Apply positioning and make visible
	notification.style.position = 'fixed'
	notification.style.left = `${x}px`
	notification.style.top = `${y}px`
	notification.style.visibility = 'visible' // Make visible after positioning
	notification.style.zIndex = '9999'

	return notification
}

// Rest of your existing code remains the same...
export async function notify(type: TNotification, message: string, config?: TNotificationConfig) {
	const notification = await createNotification(message, type, config)

	// Remove after duration or close event
	race(fromEvent(notification, 'close'), timer(config?.duration ?? 1000)).subscribe(() => {
		notification.remove()
	})

	return notification
}

// Shorthand API
export const $notify = {
	success: (message: string, config?: TNotificationConfig) => notify('success', message, config),
	error: (message: string, config?: TNotificationConfig) => notify('error', message, config),
	warning: (message: string, config?: TNotificationConfig) => notify('warning', message, config),
	info: (message: string, config?: TNotificationConfig) => notify('info', message, config),
}
