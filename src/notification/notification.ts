import { SchmancyElement } from '@mixins/index'
import { html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { BehaviorSubject, timer, interval, NEVER } from 'rxjs'
import { switchMap, takeUntil, map, tap, distinctUntilChanged } from 'rxjs/operators'
import '../progress/progress'
import style from './notification.scss?inline'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

/**
 * @fires close - When notification is closed
 */
@customElement('sch-notification')
export default class SchmancyNotification extends SchmancyElement {
	static styles = [unsafeCSS(style)]

	@property({ type: String }) title = ''
	@property({ type: String }) message = ''
	@property({ type: String }) type: NotificationType = 'info'
	@property({ type: Boolean }) closable = true
	@property({ type: Number }) duration = 5000
	@property({ type: String }) id = `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`
	@property({ type: Boolean }) playSound = true
	@property({ type: Boolean }) showProgress = false
	// startPosition retained for API compatibility — not used in entrance animation
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

		this.style.position = 'fixed'
		this.style.top = '16px'
		this.style.right = '16px'
		this.style.zIndex = '10001'
		this.style.opacity = '0'

		this.updateComplete.then(() => {
			this.animateIn()
			return
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
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		await this.animate(
			reduced
				? [{ opacity: 0 }, { opacity: 1 }]
				: [
						{ transform: 'translateX(40px) scale(0.96)', opacity: 0 },
						{ transform: 'translateX(0) scale(1)', opacity: 1 },
					],
			{
				duration: reduced ? 200 : 360,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
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

		await this.animate(
			[
				{ transform: 'translateX(0) scale(1)', opacity: 1 },
				{ transform: 'translateX(20px) scale(0.98)', opacity: 0 },
			],
			{
				duration: 180,
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

	private _getTypeLabel(): string {
		switch (this.type) {
			case 'success':
				return 'SUCCESS'
			case 'warning':
				return 'WARNING'
			case 'error':
				return 'ERROR'
			default:
				return 'INFO'
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
				${this.showProgress || this.duration > 0
					? html`<schmancy-progress
							class="progress"
							size="xs"
							.value=${this._progress}
							?indeterminate=${this.showProgress && this.duration === 0}
						></schmancy-progress>`
					: ''}
				<div class="accent-rail"></div>
				<div class="content">
					<span class="type-tag">${this._getTypeLabel()}</span>
					${this.title ? html`<div class="title">${this.title}</div>` : ''}
					<div class="message">${this.message}</div>
				</div>
				${this.closable
					? html`
							<button class="close" aria-label="Close notification" @click=${this.close}>&#215;</button>
						`
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
