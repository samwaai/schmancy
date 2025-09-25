import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { BehaviorSubject, takeUntil } from 'rxjs'
import { tap } from 'rxjs/operators'

@customElement('schmancy-details')
export default class SchmancyDetails extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
	}

	/* Hide browser default marker */
	summary::-webkit-details-marker {
		display: none;
	}

	summary {
		list-style: none;
	}

	/* Container border-radius following M3 spec */
	details {
		border-radius: 12px; /* M3 medium component radius */
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1); /* M3 standard easing */
	}

	/* Variant-specific styles */
	:host([variant='outlined']) details {
		border: 1px solid var(--schmancy-sys-color-outline-variant);
		background-color: var(--schmancy-sys-color-surface-default);
	}

	:host([variant='filled']) details {
		background-color: var(--schmancy-sys-color-surface-container);
	}

	:host([variant='elevated']) details {
		background-color: var(--schmancy-sys-color-surface-low);
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	:host([variant='elevated']) details[open] {
		box-shadow: var(--schmancy-sys-elevation-2);
		background-color: var(--schmancy-sys-color-surface-container);
	}

	/* Content animation */
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.content-wrapper[data-open='true'] {
		animation: slideDown 250ms cubic-bezier(0.2, 0, 0, 1);
	}

	/* Ripple effect */
	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	/* Focus ring following M3 spec */
	summary:focus-visible {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
		border-radius: 12px;
	}

	/* Icon rotation transition */
	.icon-wrapper {
		transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
	}

	.icon-wrapper[data-open='true'] {
		transform: rotate(90deg);
	}
`) {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open' as const,
		delegatesFocus: true,
	}

	@property() summary = ''
	@property({ type: Boolean, reflect: true })
	get open() {
		return this._open$.value
	}
	set open(value: boolean) {
		if (this._open$.value !== value) {
			this._open$.next(value)
		}
	}
	@property({ reflect: true }) variant: 'default' | 'outlined' | 'filled' | 'elevated' = 'default'

	// Internal state for ripple effects
	@state() private ripples: Array<{ x: number; y: number; id: number }> = []
	@state() private pressed = false
	@state() private _isOpen = false

	private nextRippleId = 0
	private _open$ = new BehaviorSubject<boolean>(false)

	connectedCallback() {
		super.connectedCallback()

		// Subscribe to open state changes
		this._open$.pipe(
			tap(isOpen => {
				this._isOpen = isOpen
				this.requestUpdate()
			}),
			takeUntil(this.disconnecting)
		).subscribe()
	}

	render() {
		// Define state layer opacity based on variant and state
		const getStateLayerOpacity = () => {
			if (this.pressed) return 'opacity-[0.12]' // M3 pressed state
			if (this.variant === 'default') {
				return 'opacity-0 hover:opacity-[0.08]' // M3 hover state
			}
			return 'opacity-0 hover:opacity-[0.04]' // Reduced for filled/elevated variants
		}

		// Summary classes following M3 specs
		const summaryClasses = this.classMap({
			'cursor-pointer': true,
			'select-none': true,
			'relative': true,
			'flex': true,
			'items-center': true,
			'gap-3': true,
			'min-h-[48px]': true, // M3 minimum touch target
			'sm:min-h-[56px]': true, // Desktop size
			'px-4': true, // M3 standard padding
			'sm:px-6': true,
			'py-3': true,
			'sm:py-4': true,
			'rounded-xl': true, // Match container radius
			'transition-colors': true,
			'duration-200': true,
			'text-surface-on': true,
			'group': true, // For hover states on icon
		})

		// State layer for interactive feedback
		const stateLayerClasses = this.classMap({
			'absolute': true,
			'inset-0': true,
			'rounded-xl': true,
			'pointer-events-none': true,
			'transition-opacity': true,
			'duration-200': true,
			'bg-surface-on': true,
			[getStateLayerOpacity()]: true,
		})

		// Content wrapper classes
		const contentClasses = this.classMap({
			'px-4': true,
			'sm:px-6': true,
			'pb-3': true,
			'sm:pb-4': true,
			'text-surface-onVariant': true,
			'text-sm': true,
			'sm:text-base': true,
		})

		// Icon classes with group hover
		const iconClasses = this.classMap({
			'flex': true,
			'items-center': true,
			'justify-center': true,
			'w-6': true,
			'h-6': true,
			'rounded-full': true,
			'flex-shrink-0': true,
			'text-surface-onVariant': true,
			'group-hover:text-surface-on': true,
			'transition-all': true,
			'duration-200': true,
		})

		return html`
			<details
				?open=${this._isOpen}
				@toggle=${this._handleToggle}
				class="w-full overflow-hidden"
			>
				<summary
					class=${summaryClasses}
					@click=${this._handleClick}
					@mousedown=${this._handleMouseDown}
					@mouseup=${this._handleMouseUp}
					@mouseleave=${this._handleMouseLeave}
					@keydown=${this._handleKeyDown}
					@keyup=${this._handleKeyUp}
					tabindex="0"
				>
					<!-- State layer for hover/focus/pressed states -->
					<div class=${stateLayerClasses}></div>

					<!-- Ripple container -->
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

					<!-- Summary content -->
					<span class="relative flex-1 font-medium text-base sm:text-lg z-10">
						<slot name="summary">${this.summary}</slot>
					</span>

					<!-- Expand/collapse icon -->
					<span
						class=${iconClasses}
						data-open=${this._isOpen}
						style="transform: rotate(${this._isOpen ? '90deg' : '0deg'})"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5 sm:w-6 sm:h-6"
						>
							<path
								d="M9 6L15 12L9 18"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</summary>

				<!-- Content area -->
				<div
					class=${contentClasses}
					data-open=${this._isOpen}
					style="${this._isOpen ? '' : 'display: none;'}"
				>
					${when(
						this._isOpen,
						() => html`
							<div class="content-wrapper" data-open=${this._isOpen}>
								<slot></slot>
							</div>
						`
					)}
				</div>
			</details>
		`
	}

	private _handleToggle(e: Event) {
		const details = e.target as HTMLDetailsElement
		// Sync the internal state with the actual details element state
		this._open$.next(details.open)

		// Dispatch custom event
		this.dispatchEvent(
			new CustomEvent('toggle', {
				detail: { open: details.open },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private _handleClick(e: MouseEvent) {
		// Prevent default to control the toggle manually
		e.preventDefault()

		// Add ripple effect at click position
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const id = this.nextRippleId++

		this.ripples = [...this.ripples, { x, y, id }]

		// Remove ripple after animation
		setTimeout(() => {
			this.ripples = this.ripples.filter(r => r.id !== id)
		}, 600)

		// Toggle the open state through the BehaviorSubject
		this._open$.next(!this._open$.value)

		// Dispatch the toggle event
		this.dispatchEvent(
			new CustomEvent('toggle', {
				detail: { open: this._open$.value },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private _handleMouseDown() {
		this.pressed = true
	}

	private _handleMouseUp() {
		this.pressed = false
	}

	private _handleMouseLeave() {
		this.pressed = false
	}

	private _handleKeyDown(e: KeyboardEvent) {
		// Handle keyboard activation
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this.pressed = true

			// Add ripple effect from center
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
			const x = rect.width / 2
			const y = rect.height / 2
			const id = this.nextRippleId++

			this.ripples = [...this.ripples, { x, y, id }]

			setTimeout(() => {
				this.ripples = this.ripples.filter(r => r.id !== id)
			}, 600)

			// Toggle the open state through the BehaviorSubject
			this._open$.next(!this._open$.value)

			// Dispatch the toggle event
			this.dispatchEvent(
				new CustomEvent('toggle', {
					detail: { open: this._open$.value },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	private _handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			this.pressed = false
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-details': SchmancyDetails
	}
}
