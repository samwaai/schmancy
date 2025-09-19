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
		transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
		outline: none;
	}

	/* Type-specific base styles */
	:host([type='elevated']) {
		background-color: var(--schmancy-sys-color-surface-low);
		box-shadow: var(--shadow-1);
	}

	:host([type='filled']) {
		background-color: var(--schmancy-sys-color-surface-highest);
		box-shadow: var(--shadow-0);
	}

	:host([type='outlined']) {
		background-color: var(--schmancy-sys-color-surface-default);
		border: 1px solid var(--schmancy-sys-color-outlineVariant);
		box-shadow: var(--shadow-0);
	}

	/* Interactive state */
	:host([interactive]) {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	/* Elevated interactive states */
	:host([type='elevated'][interactive]:hover:not([disabled])) {
		box-shadow: var(--shadow-2);
	}

	:host([type='elevated'][dragged]) {
		box-shadow: var(--shadow-3);
	}

	/* Filled interactive states */
	:host([type='filled'][interactive]:hover:not([disabled])) {
		box-shadow: var(--shadow-1);
	}

	:host([type='filled'][dragged]) {
		box-shadow: var(--shadow-3);
	}

	/* Outlined interactive states */
	:host([type='outlined'][interactive]:hover:not([disabled])) {
		box-shadow: var(--shadow-1);
	}

	:host([type='outlined'][dragged]) {
		box-shadow: var(--shadow-3);
	}

	/* Disabled state */
	:host([disabled]) {
		pointer-events: none;
		opacity: 0.38;
	}

	/* Focus ring */
	:host([interactive]:focus-visible:not([disabled])) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
	}

	/* Ripple effect animation */
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
			}),
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
				}),
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

	// Get the classes for state layer based on current state
	private getStateLayerOpacity(): string {
		if (!this.interactive || this.disabled) return 'opacity-0'
		if (this.pressed) return 'opacity-[0.1]' // M3 pressed: 0.1
		return 'opacity-0 hover:opacity-[0.08] focus-visible:opacity-[0.1]' // M3 hover: 0.08, focus: 0.1
	}

	protected render() {
		const containerClasses = classMap({
			'relative w-full h-full rounded-xl': true,
			'cursor-pointer': this.interactive && !this.disabled,
		})

		const stateLayerClasses = classMap({
			'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 bg-surface-on': true,
			[this.getStateLayerOpacity()]: true,
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
				<div class=${stateLayerClasses}></div>

				<!-- Ripple container for click effects -->
				${this.interactive
					? html`
							<div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
								${this.ripples.map(
									ripple => html`
										<span
											class="absolute rounded-full scale-0 animate-[ripple_600ms_linear] bg-surface-on opacity-[0.12] pointer-events-none"
											style="
												left: ${ripple.x}px;
												top: ${ripple.y}px;
												width: 20px;
												height: 20px;
												margin-left: -10px;
												margin-top: -10px;
											"
										></span>
									`,
								)}
							</div>
						`
					: ''}

				<!-- Card content -->
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
