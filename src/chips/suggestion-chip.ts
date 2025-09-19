import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

/**
 * Suggestion chip component - provides contextual recommendations to users
 *
 * IMPORTANT: Suggestion chips do NOT have a selected state. They are designed to
 * provide suggestions and recommendations that trigger actions when clicked.
 * Unlike filter chips, they cannot be toggled on/off.
 *
 * Pure Schmancy implementation with Tailwind CSS and RxJS state management
 */
@customElement('schmancy-suggestion-chip')
export class SchmancySuggestionChip extends TailwindElement(css`
	:host {
		display: inline-block;
		outline: none;
		min-width:fit-content
	}

	:host([disabled]) {
		pointer-events: none;
	}

	.ripple {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: rgba(0, 0, 0, 0.08);
		pointer-events: none;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	/* State layer for M3 hover/focus/pressed states */
	.state-layer {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background-color: currentColor;
		opacity: 0;
		transition: opacity 200ms ease;
	}

	:host(:not([disabled])) button:hover .state-layer {
		opacity: 0.08;
	}

	:host(:not([disabled])) button:focus-visible .state-layer {
		opacity: 0.1;
	}

	:host(:not([disabled])) button:active .state-layer {
		opacity: 0.1;
	}
`) {
	/** Value identifier for the chip */
	@property({ reflect: true }) value = ''

	/** Optional icon name (Material Symbols) */
	@property({ reflect: true }) icon = ''

	/** Optional href for navigation */
	@property({ reflect: true }) href = ''

	/** Target for navigation (e.g., '_blank') */
	@property({ reflect: true }) target = ''

	/** Disable the chip */
	@property({ type: Boolean, reflect: true }) disabled = false

	/** Elevated style variant - flat by default per M3 spec */
	@property({ type: Boolean, reflect: true }) elevated = false

	// RxJS state streams
	private hover$ = new BehaviorSubject<boolean>(false)
	private pressed$ = new BehaviorSubject<boolean>(false)
	private focused$ = new BehaviorSubject<boolean>(false)

	// UI state - only ripples needed for rendering
	@state() private ripples: Array<{ x: number; y: number; id: number }> = []

	protected static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

	private nextRippleId = 0

	connectedCallback() {
		super.connectedCallback()

		// Stream management for future extensions
		// Currently, states are handled directly in event handlers
		// This pipeline can be extended for more complex state interactions
		combineLatest([
			this.hover$,
			this.pressed$,
			this.focused$
		]).pipe(
			// States are managed through event handlers directly
			// This pipeline is kept for potential future state combinations
			takeUntil(this.disconnecting)
		).subscribe()
	}

	private handleClick = (e: MouseEvent) => {
		if (this.disabled) return

		// Add ripple effect
		const button = this.shadowRoot?.querySelector('button')
		if (button) {
			const rect = button.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			const id = this.nextRippleId++

			this.ripples = [...this.ripples, { x, y, id }]

			// Remove ripple after animation
			setTimeout(() => {
				this.ripples = this.ripples.filter(r => r.id !== id)
			}, 600)
		}

		// Navigate if href is provided
		if (this.href) {
			if (this.target === '_blank') {
				window.open(this.href, '_blank')
			} else {
				window.location.href = this.href
			}
		}

		// Dispatch action event
		this.dispatchEvent(new CustomEvent('action', {
			detail: { value: this.value },
			bubbles: true,
			composed: true
		}))
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (this.disabled) return

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this.pressed$.next(true)

			// Simulate click
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				clientX: 0,
				clientY: 0
			})
			this.handleClick(clickEvent)

			setTimeout(() => this.pressed$.next(false), 100)
		}
	}

	private handleFocus = () => {
		this.focused$.next(true)
	}

	private handleBlur = () => {
		this.focused$.next(false)
	}

	protected render(): unknown {
		const hasIcon = !!this.icon;

		const classes = {
			'relative': true,
			'inline-flex': true,
			'items-center': true,
			'gap-2': true,
			'h-8': true, // M3: 32px height
			'min-h-[32px]': true,
			'rounded-full': true,
			'cursor-pointer': !this.disabled,
			'transition-all': true,
			'duration-200': true,
			'select-none': true,
			'overflow-hidden': true,
			'border': true,

			// M3 Padding: 8px with icon, 16px without (leading), 16px trailing
			'pl-2': hasIcon, // 8px with icon
			'pl-4': !hasIcon, // 16px without icon
			'pr-4': true, // 16px trailing

			// M3 Colors for suggestion chips
			'bg-surface-containerLow': true,
			'text-surface-onVariant': true,
			'border-outline': true,

			// Suggestion chips are flat by default (no elevation per M3)

			// Focus state
			'focus-visible:outline': !this.disabled,
			'focus-visible:outline-2': !this.disabled,
			'focus-visible:outline-primary': !this.disabled,
			'focus-visible:outline-offset-2': !this.disabled,

			// Disabled
			'opacity-38': this.disabled, // M3 disabled opacity
			'cursor-not-allowed': this.disabled
		}

		return html`
			<button
				type="button"
				class=${classMap(classes)}
				?disabled=${this.disabled}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@mouseenter=${() => this.hover$.next(true)}
				@mouseleave=${() => this.hover$.next(false)}
				@mousedown=${() => this.pressed$.next(true)}
				@mouseup=${() => this.pressed$.next(false)}
				@focus=${this.handleFocus}
				@blur=${this.handleBlur}
				tabindex=${this.disabled ? '-1' : '0'}
				role="button"
				aria-disabled=${this.disabled}
				aria-label=${this.value}
			>
				${this.icon ? html`
					<schmancy-icon class="text-[18px] shrink-0">${this.icon}</schmancy-icon>
				` : ''}
				<span class="text-sm font-medium leading-5">
					<slot></slot>
				</span>

				<!-- Ripple effects -->
				${this.ripples.map(ripple => html`
					<span
						class="ripple"
						style="left: ${ripple.x}px; top: ${ripple.y}px;"
					></span>
				`)}

				<!-- State layer for M3 hover/focus/pressed states -->
				<div class="state-layer"></div>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-suggestion-chip': SchmancySuggestionChip
	}
}

export type SuggestionChipActionEvent = { value: string }