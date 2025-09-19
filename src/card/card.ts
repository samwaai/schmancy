import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'

@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
		border-radius: 12px; /* M3 spec: 12px for cards */
		transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
	}

	/* Type-specific base styles */
	:host([type="elevated"]) {
		background-color: var(--schmancy-sys-color-surface-low);
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	:host([type="filled"]) {
		background-color: var(--schmancy-sys-color-surface-highest);
		box-shadow: var(--schmancy-sys-elevation-0);
	}

	:host([type="outlined"]) {
		background-color: var(--schmancy-sys-color-surface-default);
		border: 1px solid var(--schmancy-sys-color-outline-variant);
		box-shadow: var(--schmancy-sys-elevation-0);
	}

	/* Interactive state layers */
	:host([interactive]) {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	:host([interactive]:hover:not([disabled])) .state-layer {
		opacity: 0.08;
	}

	:host([interactive]:focus-visible:not([disabled])) .state-layer {
		opacity: 0.12;
	}

	:host([interactive][pressed]:not([disabled])) .state-layer {
		opacity: 0.12;
	}

	/* Elevated interactive states */
	:host([type="elevated"][interactive]:hover:not([disabled])) {
		box-shadow: var(--schmancy-sys-elevation-2);
	}

	:host([type="elevated"][dragged]) {
		box-shadow: var(--schmancy-sys-elevation-3);
	}

	/* Filled interactive states */
	:host([type="filled"][interactive]:hover:not([disabled])) {
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	:host([type="filled"][dragged]) {
		box-shadow: var(--schmancy-sys-elevation-3);
	}

	/* Outlined interactive states */
	:host([type="outlined"][interactive]:hover:not([disabled])) {
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	:host([type="outlined"][dragged]) {
		box-shadow: var(--schmancy-sys-elevation-3);
	}

	/* Disabled state */
	:host([disabled]) {
		pointer-events: none;
		opacity: 0.38;
	}

	/* State layer overlay */
	.state-layer {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background-color: var(--schmancy-sys-color-surface-on);
		opacity: 0;
		pointer-events: none;
		transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Focus ring */
	:host([interactive]:focus-visible:not([disabled])) {
		outline: 2px solid var(--schmancy-sys-color-primary);
		outline-offset: 2px;
	}

	/* Ripple effect container */
	.ripple-container {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;
		pointer-events: none;
	}

	.ripple {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: var(--schmancy-sys-color-surface-on);
		opacity: 0.12;
		pointer-events: none;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	/* Content container */
	.content {
		position: relative;
		height: 100%;
		width: 100%;
		border-radius: inherit;
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
	@state() private pressed = false
	@state() private ripples: Array<{ x: number; y: number; id: number }> = []

	private nextRippleId = 0

	connectedCallback() {
		super.connectedCallback()

		// Set appropriate ARIA attributes for interactive cards
		if (this.interactive && !this.disabled) {
			this.setAttribute('tabindex', '0')
			if (!this.role || this.role === 'article') {
				this.role = this.href ? 'link' : 'button'
			}
		}
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)

		// Update ARIA attributes when interactive or disabled state changes
		if (changedProperties.has('interactive') || changedProperties.has('disabled')) {
			if (this.interactive && !this.disabled) {
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
	}

	private handleClick = (e: MouseEvent) => {
		if (this.disabled || !this.interactive) return

		// Add ripple effect at click position
		const rect = this.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const id = this.nextRippleId++

		this.ripples = [...this.ripples, { x, y, id }]

		// Remove ripple after animation completes
		setTimeout(() => {
			this.ripples = this.ripples.filter(r => r.id !== id)
		}, 600)

		// Navigate if href is provided
		if (this.href) {
			if (this.target === '_blank') {
				window.open(this.href, '_blank')
			} else {
				window.location.href = this.href
			}
		}

		// Dispatch click event for parent components to handle
		this.dispatchEvent(
			new CustomEvent('schmancy-click', {
				detail: { value: this.type },
				bubbles: true,
				composed: true,
			})
		)
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (this.disabled || !this.interactive) return

		// Activate on Enter or Space for keyboard navigation
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this.pressed = true
			this.setAttribute('pressed', '')

			// Simulate click
			const rect = this.getBoundingClientRect()
			const x = rect.width / 2
			const y = rect.height / 2
			const id = this.nextRippleId++

			this.ripples = [...this.ripples, { x, y, id }]

			setTimeout(() => {
				this.ripples = this.ripples.filter(r => r.id !== id)
			}, 600)

			if (this.href) {
				if (this.target === '_blank') {
					window.open(this.href, '_blank')
				} else {
					window.location.href = this.href
				}
			}

			this.dispatchEvent(
				new CustomEvent('schmancy-click', {
					detail: { value: this.type },
					bubbles: true,
					composed: true,
				})
			)
		}
	}

	private handleKeyUp = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			this.pressed = false
			this.removeAttribute('pressed')
		}
	}

	private handleMouseDown = () => {
		if (this.disabled || !this.interactive) return
		this.pressed = true
		this.setAttribute('pressed', '')
	}

	private handleMouseUp = () => {
		this.pressed = false
		this.removeAttribute('pressed')
	}

	private handleMouseLeave = () => {
		this.pressed = false
		this.removeAttribute('pressed')
	}

	protected render() {
		const containerClasses = classMap({
			'card-container': true,
			'interactive': this.interactive && !this.disabled,
		})

		return html`
			<div
				class=${containerClasses}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@keyup=${this.handleKeyUp}
				@mousedown=${this.handleMouseDown}
				@mouseup=${this.handleMouseUp}
				@mouseleave=${this.handleMouseLeave}
				aria-label=${ifDefined(this.ariaLabel)}
				aria-disabled=${this.disabled ? 'true' : 'false'}
			>
				<!-- State layer for hover/focus/pressed states -->
				<div class="state-layer"></div>

				<!-- Ripple container for click effects -->
				${this.interactive
					? html`
							<div class="ripple-container">
								${this.ripples.map(
									ripple => html`
										<span
											class="ripple"
											style="
												left: ${ripple.x}px;
												top: ${ripple.y}px;
												width: 20px;
												height: 20px;
												margin-left: -10px;
												margin-top: -10px;
											"
										></span>
									`
								)}
							</div>
						`
					: ''}

				<!-- Card content -->
				<div class="content">
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
