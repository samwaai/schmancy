import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
		border-radius: var(--schmancy-sys-shape-corner-medium);
		transition: box-shadow var(--schmancy-sys-motion-duration-short4) var(--schmancy-sys-motion-easing-standard);
		outline: none;
	}

	/* Type variants */
	:host([type='elevated']) {
		background-color: var(--schmancy-sys-color-surface-low);
		box-shadow: var(--schmancy-sys-elevation-1);
	}
	:host([type='filled']) {
		background-color: var(--schmancy-sys-color-surface-highest);
		box-shadow: var(--schmancy-sys-elevation-0);
	}
	:host([type='outlined']) {
		background-color: var(--schmancy-sys-color-surface-default);
		border: 1px solid var(--schmancy-sys-color-outlineVariant);
		box-shadow: var(--schmancy-sys-elevation-0);
	}

	/* Interactive states */
	:host([interactive]) {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	:host([interactive]:focus-visible:not([disabled])) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
	}
	:host([disabled]) {
		pointer-events: none;
		opacity: var(--schmancy-sys-state-disabled-opacity);
	}

	/* Hover elevations */
	:host([type='elevated'][interactive]:hover:not([disabled])) {
		box-shadow: var(--schmancy-sys-elevation-2);
	}
	:host([type='filled'][interactive]:hover:not([disabled])),
	:host([type='outlined'][interactive]:hover:not([disabled])) {
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	/* Dragged state */
	:host([dragged]) {
		box-shadow: var(--schmancy-sys-elevation-3);
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
`) {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open',
		delegatesFocus: true,
	}

	/**
	 * The visual style of the card.
	 * @default 'elevated'
	 */
	@property({ reflect: true })
	type: 'elevated' | 'filled' | 'outlined' = 'elevated'

	/**
	 * Makes the card interactive (clickable).
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	interactive = false

	/**
	 * Disables the card.
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false

	/**
	 * Indicates the card is being dragged.
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	dragged = false

	/**
	 * URL to navigate to when card is clicked (makes it act like a link).
	 */
	@property()
	href?: string

	/**
	 * Target for the link navigation.
	 */
	@property()
	target?: string

	/**
	 * ARIA role for accessibility.
	 */
	@property({ attribute: 'role' })
	override role = 'article'

	/**
	 * ARIA label for accessibility.
	 */
	@property({ attribute: 'aria-label' })
	override ariaLabel: string = ''

	// Internal state for interaction feedback
	@state() pressed = false
	@state() private ripples: Array<{ x: number; y: number; id: number }> = []

	private nextRippleId = 0

	connectedCallback() {
		super.connectedCallback()
		this._updateAriaAttributes()
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)
		if (changedProperties.has('interactive') || changedProperties.has('disabled')) {
			this._updateAriaAttributes()
		}
	}

	// Consolidate ARIA attribute updates
	private _updateAriaAttributes() {
		const isInteractive = this.interactive && !this.disabled

		if (isInteractive) {
			this.setAttribute('tabindex', '0')
			if (!this.role || this.role === 'article') {
				this.role = this.href ? 'link' : 'button'
			}
		} else {
			this.removeAttribute('tabindex')
			if (this.role === 'button' || this.role === 'link') {
				this.role = 'article'
			}
		}
	}

	// Shared ripple creation logic
	private _addRipple(x: number, y: number) {
		const id = this.nextRippleId++
		this.ripples = [...this.ripples, { x, y, id }]

		// Remove ripple after animation completes
		setTimeout(() => {
			this.ripples = this.ripples.filter(r => r.id !== id)
		}, 600) // M3 medium duration
	}

	// Shared navigation logic
	private _navigate() {
		if (!this.href) return

		if (this.target === '_blank') {
			window.open(this.href, '_blank')
		} else {
			window.location.href = this.href
		}
	}

	// Combined action trigger (ripple + navigate + event)
	private _triggerAction(x: number, y: number) {
		this._addRipple(x, y)
		this._navigate()

		this.dispatchEvent(
			new CustomEvent('schmancy-click', {
				detail: { value: this.type },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private handleClick = (e: MouseEvent) => {
		if (this.disabled || !this.interactive) return

		const rect = this.getBoundingClientRect()
		this._triggerAction(e.clientX - rect.left, e.clientY - rect.top)
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (this.disabled || !this.interactive) return

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this._setPressed(true)

			// Simulate click at center
			const rect = this.getBoundingClientRect()
			this._triggerAction(rect.width / 2, rect.height / 2)
		}
	}

	private handleKeyUp = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			this._setPressed(false)
		}
	}

	// Consolidate pressed state management
	private _setPressed(pressed: boolean) {
		this.pressed = pressed
		if (pressed) {
			this.setAttribute('pressed', '')
		} else {
			this.removeAttribute('pressed')
		}
	}

	private handleMouseDown = () => {
		if (this.disabled || !this.interactive) return
		this._setPressed(true)
	}

	private handleMouseUp = () => this._setPressed(false)
	private handleMouseLeave = () => this._setPressed(false)

	protected render() {
		const isInteractive = this.interactive && !this.disabled

		return html`
			<div
				class="relative w-full h-full rounded-xl ${isInteractive ? 'cursor-pointer' : ''}"
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@keyup=${this.handleKeyUp}
				@mousedown=${this.handleMouseDown}
				@mouseup=${this.handleMouseUp}
				@mouseleave=${this.handleMouseLeave}
				aria-label=${ifDefined(this.ariaLabel)}
				aria-disabled=${this.disabled ? 'true' : 'false'}
			>
				<!-- State layer -->
				<div
					class="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 bg-surface-on ${!isInteractive
						? 'opacity-0'
						: this.pressed
							? 'opacity-[var(--schmancy-sys-state-pressed-opacity)]'
							: 'opacity-0 hover:opacity-[var(--schmancy-sys-state-hover-opacity)] focus-visible:opacity-[var(--schmancy-sys-state-focus-opacity)]'}"
				></div>

				<!-- Ripples -->
				${this.interactive && this.ripples.length
					? html`
							<div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
								${this.ripples.map(
									r => html`
										<span
											class="absolute rounded-full scale-0 animate-[ripple_600ms_linear] bg-surface-on opacity-[0.12] w-5 h-5 -ml-2.5 -mt-2.5"
											style="left: ${r.x}px; top: ${r.y}px"
										></span>
									`,
								)}
							</div>
						`
					: ''}

				<!-- Content -->
				<div class="relative h-full w-full rounded-xl">
					<slot></slot>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card': SchmancyCard
	}
}
