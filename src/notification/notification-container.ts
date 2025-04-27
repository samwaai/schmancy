import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { repeat } from 'lit/directives/repeat.js'
import { fromEvent, takeUntil } from 'rxjs'
import { NotificationType } from './notification'
import { NotificationAudioService } from './notification-audio'
import style from './notification-container.scss?inline'

export interface NotificationItem {
	id: string
	title: string
	message: string
	type: NotificationType
	duration: number
	closable: boolean
	playSound: boolean
}

export interface NotificationOptions {
	id?: string
	title?: string
	message: string
	type?: NotificationType
	duration?: number
	closable?: boolean
	playSound?: boolean
}

/**
 * Container component for displaying stacked notifications.
 *
 * @element sch-notification-container
 */
@customElement('sch-notification-container')
export default class SchmancyNotificationContainer extends $LitElement(style) {
	@property({ type: String }) position:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center' = 'top-right'
	@property({ type: Number }) maxVisibleNotifications = 2
	@property({ type: Boolean }) playSound = false
	@property({ type: Number }) audioVolume = 0.1

	@state() private _notifications: NotificationItem[] = []

	// Audio service
	private _audioService = new NotificationAudioService()

	connectedCallback() {
		super.connectedCallback()

		// Set audio volume
		this._audioService.setVolume(this.audioVolume)

		// Listen for notification events
		fromEvent<CustomEvent<NotificationOptions>>(window, 'schmancy-notification')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				this.addNotification(event.detail)
			})

		// Listen for play sound events from child notifications
		this.addEventListener('playsound', ((event: CustomEvent) => {
			if (this.playSound) {
				this._audioService.playSound(event.detail.type)
			}
		}) as EventListener)
	}

	// Public API to add notifications
	public addNotification(options: NotificationOptions): string {
		const id = options.id || `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`

		const notification: NotificationItem = {
			id,
			title: options.title || '',
			message: options.message,
			type: options.type || 'info',
			duration: options.duration !== undefined ? options.duration : 750,
			closable: options.closable !== undefined ? options.closable : true,
			playSound: options.playSound !== undefined ? options.playSound : this.playSound,
		}

		// Add new notification (top for top-* positions, bottom for bottom-* positions)
		if (this.position.startsWith('top')) {
			this._notifications = [...this._notifications, notification]
		} else {
			this._notifications = [notification, ...this._notifications]
		}

		// Enforce max visible notifications
		if (this._notifications.length > this.maxVisibleNotifications) {
			this._notifications = this._notifications.slice(-this.maxVisibleNotifications)
		}

		// Play sound if enabled
		if (notification.playSound) {
			this._audioService.playSound(notification.type)
		}

		return id
	}

	public removeNotification(id: string) {
		this._notifications = this._notifications.filter(n => n.id !== id)
	}

	private _handleClose(e: CustomEvent) {
		const id = e.detail.id
		this.removeNotification(id)
	}

	render() {
		return html`
			<div
				class=${classMap({
					'notification-container': true,
					[this.position]: true,
				})}
			>
				${repeat(
					this._notifications,
					notification => notification.id,
					notification => html`
            <sch-notification
              .id=${notification.id}
              .title=${notification.title}
              .message=${notification.message}
              .type=${notification.type}
              .duration=${notification.duration}
              ?closable=${notification.closable}
              ?playSound=${false} /* We already played the sound on add */
              @close=${this._handleClose}
            ></sch-notification>
          `,
				)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-notification-container': SchmancyNotificationContainer
	}
}
