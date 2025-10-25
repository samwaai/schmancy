import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import '@schmancy/progress'
import style from './notification.scss?inline'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

/**
 * @fires close - When notification is closed
 */
@customElement('sch-notification')
export default class SchmancyNotification extends $LitElement(style) {
	@property({ type: String }) title = ''
	@property({ type: String }) message = ''
	@property({ type: String }) type: NotificationType = 'info'
	@property({ type: Boolean }) closable = true
	@property({ type: Number }) duration = 5000 // 0 means no auto-close
	@property({ type: String }) id = `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`
	@property({ type: Boolean }) playSound = true
	@property({ type: Boolean }) showProgress = false // Show indeterminate progress bar

	@state() private _visible = true
	@state() private _progress = 100
	@state() private _hovered = false
	@state() private _closing = false
	@state() private _autoCloseTimer?: number
	@state() private _progressTimer?: number

	connectedCallback() {
		super.connectedCallback()

		if (this.duration > 0) {
			this._startAutoCloseTimer()
		}

		if (this.playSound) {
			this._playSound()
		}
	}

	disconnectedCallback() {
		this._clearTimers()
		super.disconnectedCallback()
	}

	updated(changedProps: PropertyValues) {
		super.updated(changedProps)

		if (changedProps.has('duration') && this.duration > 0) {
			this._clearTimers()
			this._startAutoCloseTimer()
		}
	}

	private _startAutoCloseTimer() {
		if (this.duration <= 0) return

		const startTime = Date.now()
		const endTime = startTime + this.duration

		// Setup the auto-close timer
		this._autoCloseTimer = window.setTimeout(() => {
			this.close()
		}, this.duration)

		// Setup the progress timer to update every 16ms (60fps)
		this._progressTimer = window.setInterval(() => {
			if (this._hovered) return

			const now = Date.now()
			const remaining = Math.max(0, endTime - now)
			this._progress = (remaining / this.duration) * 100

			if (remaining <= 0) {
				this._clearTimers()
			}
		}, 16)
	}

	private _clearTimers() {
		if (this._autoCloseTimer) {
			clearTimeout(this._autoCloseTimer)
			this._autoCloseTimer = undefined
		}

		if (this._progressTimer) {
			clearInterval(this._progressTimer)
			this._progressTimer = undefined
		}
	}

	private _pauseTimers() {
		this._clearTimers()
	}

	private _resumeTimers() {
		if (this.duration > 0) {
			// Calculate remaining time based on progress
			const remainingTime = (this._progress / 100) * this.duration

			if (remainingTime > 0) {
				this._autoCloseTimer = window.setTimeout(() => {
					this.close()
				}, remainingTime)

				const startTime = Date.now()
				const endTime = startTime + remainingTime

				this._progressTimer = window.setInterval(() => {
					if (this._hovered) return

					const now = Date.now()
					const remaining = Math.max(0, endTime - now)
					this._progress = (remaining / remainingTime) * 100

					if (remaining <= 0) {
						this._clearTimers()
					}
				}, 16)
			}
		}
	}

	private _playSound() {
		// Dispatch event to play sound through audio service
		this.dispatchEvent(
			new CustomEvent('playsound', {
				detail: { type: this.type },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private _handleMouseEnter() {
		this._hovered = true
		this._pauseTimers()
	}

	private _handleMouseLeave() {
		this._hovered = false
		this._resumeTimers()
	}

	public close() {
		if (this._closing) return

		this._closing = true
		this._clearTimers()

		// Add closing animation
		this._visible = false

		// Dispatch close event
		setTimeout(() => {
			this.dispatchEvent(
				new CustomEvent('close', {
					detail: { id: this.id },
					bubbles: true,
					composed: true,
				}),
			)
		}, 300) // Match animation duration
	}

	render() {
		if (!this._visible && this._closing) return html``

		const typeStyles = this._getTypeStyles()

		// Calculate elevation based on hover state
		const elevationLevel = this._hovered ? '3' : '2'

		return html`
			<div
				class=${classMap({
					notification: true,
					closing: this._closing,
					[this.type]: true,
				})}
				role="alert"
				style=${styleMap({
					transform: this._closing ? 'translateX(120%)' : 'translateX(0)',
					opacity: this._closing ? '0' : '1',
					boxShadow: `var(--schmancy-sys-elevation-${elevationLevel})`,
					transition:
						'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease',
				})}
				@mouseenter=${this._handleMouseEnter}
				@mouseleave=${this._handleMouseLeave}
			>
				<div class="notification-content">
					<div
						class="icon-container"
						${color({
							color: typeStyles.iconColor,
							bgColor: `color-mix(in srgb, ${typeStyles.iconColor} 10%, transparent)`,
						})}
					>
						${typeStyles.icon}
					</div>

					<div class="content">
						${this.title
							? html`
									<div
										class="title"
										style=${styleMap({
											color:
												this.type === 'info'
													? `color-mix(in srgb, ${SchmancyTheme.sys.color.primary.default} 90%, ${SchmancyTheme.sys.color.surface.on} 10%)`
													: this.type === 'success'
														? `color-mix(in srgb, ${SchmancyTheme.sys.color.success.default} 90%, ${SchmancyTheme.sys.color.surface.on} 10%)`
														: this.type === 'warning'
															? `color-mix(in srgb, ${SchmancyTheme.sys.color.tertiary.default} 90%, ${SchmancyTheme.sys.color.surface.on} 10%)`
															: `color-mix(in srgb, ${SchmancyTheme.sys.color.error.default} 90%, ${SchmancyTheme.sys.color.surface.on} 10%)`,
										})}
									>
										${this.title}
									</div>
								`
							: ''}

						<div class="message">${this.message}</div>
					</div>

					${this.closable
						? html`
								<button
									class="close-button"
									aria-label="Close notification"
									@click=${this.close}
									style=${styleMap({
										color:
											this.type === 'info'
												? SchmancyTheme.sys.color.surface.onVariant
												: `color-mix(in srgb, ${typeStyles.iconColor} 80%, ${SchmancyTheme.sys.color.surface.onVariant} 20%)`,
									})}
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</svg>
								</button>
							`
						: ''}
				</div>

				${this.showProgress || this.duration > 0
					? html`
							<schmancy-progress
								style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%;"
								size="sm"
								.color=${this.type === 'error' ? 'error' : this.type === 'success' ? 'success' : 'primary'}
								?indeterminate=${this.showProgress}
								.value=${this.showProgress ? 0 : this._progress}
								.max=${100}
							></schmancy-progress>
						`
					: ''}
			</div>
		`
	}

	private _getTypeStyles() {
		switch (this.type) {
			case 'success':
				return {
					icon: html`
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
					`,
					iconColor: SchmancyTheme.sys.color.success.default,
					progressColor: `color-mix(in srgb, ${SchmancyTheme.sys.color.success.default} 95%, ${SchmancyTheme.sys.color.success.container} 5%)`,
				}
			case 'warning':
				return {
					icon: html`
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
							<line x1="12" y1="9" x2="12" y2="13"></line>
							<line x1="12" y1="17" x2="12.01" y2="17"></line>
						</svg>
					`,
					iconColor: SchmancyTheme.sys.color.tertiary.default,
					progressColor: `color-mix(in srgb, ${SchmancyTheme.sys.color.tertiary.default} 90%, ${SchmancyTheme.sys.color.tertiary.container} 10%)`,
				}
			case 'error':
				return {
					icon: html`
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="15" y1="9" x2="9" y2="15"></line>
							<line x1="9" y1="9" x2="15" y2="15"></line>
						</svg>
					`,
					iconColor: SchmancyTheme.sys.color.error.default,
					progressColor: `color-mix(in srgb, ${SchmancyTheme.sys.color.error.default} 92%, ${SchmancyTheme.sys.color.error.container} 8%)`,
				}
			case 'info':
			default:
				return {
					icon: html`
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="16" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12.01" y2="8"></line>
						</svg>
					`,
					iconColor: SchmancyTheme.sys.color.primary.default,
					progressColor: `color-mix(in srgb, ${SchmancyTheme.sys.color.primary.default} 94%, ${SchmancyTheme.sys.color.primary.container} 6%)`,
				}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-notification': SchmancyNotification
	}
}
