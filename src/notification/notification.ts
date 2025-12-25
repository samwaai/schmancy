import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { BehaviorSubject, timer, interval, NEVER } from 'rxjs'
import { switchMap, takeUntil, map, tap, distinctUntilChanged } from 'rxjs/operators'
import style from './notification.scss?inline'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

/**
 * Calculate a point on an arc between two points
 */
function calculateArcPoint(
	start: { x: number; y: number },
	end: { x: number; y: number },
	arcDirection: 'up' | 'down' = 'up',
	intensity: number = 0.3,
): { x: number; y: number } {
	const midX = (start.x + end.x) / 2
	const midY = (start.y + end.y) / 2
	const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
	const arcHeight = Math.min(distance * intensity, 150)
	return {
		x: midX,
		y: arcDirection === 'up' ? midY - arcHeight : midY + arcHeight,
	}
}

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
	@property({ type: Object }) startPosition: { x: number; y: number } = { x: 0, y: 0 }

	@state() private _visible = true
	@state() private _progress = 100
	@state() private _hovered = false
	@state() private _closing = false

	private paused$ = new BehaviorSubject<boolean>(false)
	private startTime = 0
	private pausedAt = 0
	private elapsedBeforePause = 0

	connectedCallback() {
		super.connectedCallback()

		// Set fixed positioning for blackbird animation
		this.style.position = 'fixed'
		this.style.top = '16px'
		this.style.right = '16px'
		this.style.zIndex = '10001'
		this.style.opacity = '0'

		// Animate in after first render
		this.updateComplete.then(() => {
			this.animateIn()
		})

		if (this.duration > 0) {
			this.setupAutoClose()
			this.setupProgressUpdates()
		}

		if (this.playSound) {
			this._playSound()
		}
	}

	private async animateIn() {
		// Get the notification element's final position
		const rect = this.getBoundingClientRect()
		const targetX = rect.left + rect.width / 2
		const targetY = rect.top + rect.height / 2

		// Calculate arc point for upward arc
		const arcPoint = calculateArcPoint(this.startPosition, { x: targetX, y: targetY }, 'up', 0.3)

		// Animate from click position to final position with arc
		await this.animate(
			[
				{
					transform: `translate(${this.startPosition.x - targetX}px, ${this.startPosition.y - targetY}px) scale(0.1)`,
					opacity: 0,
				},
				{
					transform: `translate(${arcPoint.x - targetX}px, ${arcPoint.y - targetY}px) scale(0.6)`,
					opacity: 0.9,
					offset: 0.5,
				},
				{
					transform: 'translate(0, 0) scale(1)',
					opacity: 1,
				},
			],
			{
				duration: 400,
				easing: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
				fill: 'forwards',
			},
		).finished
	}

	private setupAutoClose() {
		if (this.duration <= 0) return

		this.startTime = Date.now()
		this.elapsedBeforePause = 0

		this.paused$
			.pipe(
				switchMap(paused => {
					if (paused) {
						this.pausedAt = Date.now()
						this.elapsedBeforePause += this.pausedAt - this.startTime
						return NEVER
					} else {
						this.startTime = Date.now()
						const remaining = this.duration - this.elapsedBeforePause
						if (remaining <= 0) {
							this.close()
							return NEVER
						}
						return timer(remaining)
					}
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => this.close())
	}

	private setupProgressUpdates() {
		if (this.duration <= 0) return

		interval(16)
			.pipe(
				switchMap(() =>
					this.paused$.pipe(
						map(paused => {
							if (paused) return this._progress
							const elapsed = this.elapsedBeforePause + (Date.now() - this.startTime)
							const remaining = Math.max(0, this.duration - elapsed)
							return (remaining / this.duration) * 100
						}),
					),
				),
				distinctUntilChanged(),
				tap(progress => {
					this._progress = progress
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	private _playSound() {
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
		this.paused$.next(true)
	}

	private _handleMouseLeave() {
		this._hovered = false
		this.paused$.next(false)
	}

	public async close() {
		if (this._closing) return
		this._closing = true
		this._visible = false

		// Animate out before dispatching close event
		await this.animate(
			[
				{ transform: 'translate(0, 0) scale(1)', opacity: 1 },
				{ transform: 'translate(0, -20px) scale(0.8)', opacity: 0 },
			],
			{
				duration: 200,
				easing: 'cubic-bezier(0.4, 0, 1, 1)',
				fill: 'forwards',
			},
		).finished

		this.dispatchEvent(
			new CustomEvent('close', {
				detail: { id: this.id },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private _getEmoji(): string {
		switch (this.type) {
			case 'success':
				return '\u2705'
			case 'warning':
				return '\u26A0\uFE0F'
			case 'error':
				return '\u274C'
			default:
				return '\u{1F4A1}'
		}
	}

	render() {
		if (!this._visible && this._closing) return html``

		return html`
			<div
				class="notification ${this.type} ${this._closing ? 'closing' : ''} ${this._hovered ? 'hovered' : ''}"
				role="alert"
				@mouseenter=${this._handleMouseEnter}
				@mouseleave=${this._handleMouseLeave}
			>
				<span class="emoji">${this._getEmoji()}</span>
				<div class="content">
					${this.title ? html`<div class="title">${this.title}</div>` : ''}
					<div class="message">${this.message}</div>
				</div>
				${this.closable
					? html`
							<button class="close" aria-label="Close notification" @click=${this.close}>x</button>
						`
					: ''}
				${this.showProgress || this.duration > 0
					? html`<div class="progress" style="width: ${this._progress}%"></div>`
					: ''}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-notification': SchmancyNotification
	}
}
