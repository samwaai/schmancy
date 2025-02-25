import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { fromEvent, race, timer } from 'rxjs'
import { SchmancyNotification } from './notification'

export type TNotification = 'success' | 'error' | 'warning' | 'info'
export type TNotificationConfig = {
	duration?: number
	referenceElement?: HTMLElement
}

// Example: play a sound for success
// function playSuccessSound() {
// 	// const audio = new Audio('/path/to/success-sound.mp3')
// 	audio.play()
// }

// Create & position the notification
async function createNotification(
	message: string,
	type: TNotification,
	config?: TNotificationConfig,
): Promise<SchmancyNotification> {
	const notification = document.createElement('schmancy-notification') as SchmancyNotification
	notification.type = type
	notification.innerHTML = message

	// If we have a reference element, use floating-ui with 'fixed' strategy
	if (config?.referenceElement) {
		const { x, y } = await computePosition(config.referenceElement, notification, {
			strategy: 'fixed', // IMPORTANT: positions relative to the viewport
			placement: 'top',
			middleware: [offset(8), flip(), shift()],
		})
		// Use fixed positioning so it ignores the parent's bounds/overflow
		notification.style.position = 'fixed'
		notification.style.left = `${x}px`
		notification.style.top = `${y}px`
	} else {
		// If no referenceElement, just pop up at a corner (or wherever you like)
		notification.style.position = 'fixed'
		notification.style.bottom = '1rem'
		notification.style.right = '1rem'
	}

	// Raise z-index so it sits above any content
	notification.style.zIndex = '9999'

	// Append directly to body
	document.body.appendChild(notification)
	return notification
}

export async function notify(type: TNotification, message: string, config?: TNotificationConfig) {
	const notification = await createNotification(message, type, config)

	// Play sound if needed
	if (type === 'success') {
		// playSuccessSound()
	}

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
