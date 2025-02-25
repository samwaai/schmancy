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

	// Determine reference element
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
			toJSON: () => ({}), // Required for some Floating UI implementations
		}),
	}

	// Compute position using Floating UI
	const { x, y } = await computePosition(referenceElement, notification, {
		strategy: 'fixed',
		placement: config?.referenceElement ? 'top' : 'right-start',
		middleware: [
			offset(8), // 8px gap from reference
			flip(), // Auto-flip directions if needed
			shift({ padding: 5 }), // Prevent screen edges overflow
		],
	})

	// Apply positioning
	notification.style.position = 'fixed'
	notification.style.left = `${x}px`
	notification.style.top = `${y}px`
	notification.style.zIndex = '9999'

	document.body.appendChild(notification)
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
