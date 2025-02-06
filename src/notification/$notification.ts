import { Subject, buffer, debounceTime, fromEvent, race, timer } from 'rxjs'
import { SchmancyNotification } from './notification'

export type TNotification = 'success' | 'error' | 'warning' | 'info'
export type TNotificationConfig = {
	action?: typeof Function
	duration?: number
}

// Create a notification component and assign it the proper type.
function createNotificationComponent(message: string, type: TNotification): SchmancyNotification {
	const notificationComponent = document.createElement('schmancy-notification') as SchmancyNotification
	notificationComponent.setAttribute('type', type)
	notificationComponent.innerHTML = message
	return notificationComponent
}

// Main notifications subject: each emission will schedule a notification.
const $notifications = new Subject<{
	component: SchmancyNotification
	config?: TNotificationConfig
}>()

// New subject to handle explicit dismiss calls.
const $dismissNotification = new Subject<SchmancyNotification>()

// Exported API for notifications
export const $notify = {
	success: (message: string, config?: TNotificationConfig) => {
		const component = createNotificationComponent(message, 'success')
		$notifications.next({ component, config })
		return component
	},
	error: (message: string, config?: TNotificationConfig) => {
		const component = createNotificationComponent(message, 'error')
		$notifications.next({ component, config })
		return component
	},
	warning: (message: string, config?: TNotificationConfig) => {
		const component = createNotificationComponent(message, 'warning')
		$notifications.next({ component, config })
		return component
	},
	info: (message: string, config?: TNotificationConfig) => {
		const component = createNotificationComponent(message, 'info')
		$notifications.next({ component, config })
		return component
	},
	// New dismiss method: call this with a notification component to dismiss it early.
	dismiss: (component: SchmancyNotification) => {
		$dismissNotification.next(component)
	},
}

// Optional: If you want to collapse multiple notifications into a single one,
// the same logic as before can be retained.
$notifications.pipe(buffer($notifications.pipe(debounceTime(1000)))).subscribe(notifications => {
	if (notifications.length > 1) {
		const notification = notifications[notifications.length - 1]
		// Re-emit the latest notification for display.
		$notifications.next({ component: notification.component, config: notification.config })
	}
})

// Whenever a notification is published, append it to the DOM and set up removal.
$notifications.subscribe(({ component, config }) => {
	document.body?.appendChild(component)

	// Create a race: wait for either the component’s own 'close' event (or an external dismiss)
	// or a timeout based on the config's duration (default: 3000ms).
	race(fromEvent(component, 'close'), timer(config?.duration ?? 3000)).subscribe(() => {
		component.remove()
	})
})

// Listen for explicit dismiss calls. When a notification is to be dismissed via $notify.dismiss(),
// dispatch a 'close' event on it. This will trigger the race above.
$dismissNotification.subscribe(component => {
	// You could also include any additional logic here if needed.
	component.dispatchEvent(new CustomEvent('close'))
})
