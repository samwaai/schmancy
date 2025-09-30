import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { BehaviorSubject } from 'rxjs'

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
		/* M3 medium shape for expandable components */
		border-radius: var(--schmancy-sys-shape-corner-medium);
		transition: all var(--schmancy-sys-motion-duration-short4) var(--schmancy-sys-motion-easing-standard);
	}

	/* Variant-specific styles */
	:host([variant='outlined']) details {
		border: 1px solid var(--schmancy-sys-color-outline-variant);
		background-color: var(--schmancy-sys-color-surface-default);
	}

	:host([variant='filled']) details {
		/* M3: container surface */
		background-color: var(--schmancy-sys-color-surface-container);
	}

	:host([variant='elevated']) details {
		/* M3: containerLow when closed */
		background-color: var(--schmancy-sys-color-surface-containerLow);
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	:host([variant='elevated']) details[open] {
		/* M3: elevated state increases elevation and changes surface */
		box-shadow: var(--schmancy-sys-elevation-2);
		background-color: var(--schmancy-sys-color-surface-container);
	}

	/* Animation keyframes */
	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes ripple {
		to { transform: scale(4); opacity: 0; }
	}

	.content-wrapper[data-open='true'] {
		animation: slideDown var(--schmancy-sys-motion-duration-medium1) var(--schmancy-sys-motion-easing-emphasized-decelerate);
	}

	/* Focus ring following M3 spec */
	summary:focus-visible {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
		border-radius: var(--schmancy-sys-shape-corner-medium);
	}

	/* Icon rotation transition with M3 motion */
	.icon-rotate {
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

	private nextRippleId = 0
	private _open$ = new BehaviorSubject<boolean>(false)

	render() {
		const isOpen = this._open$.value

		// Dynamic state layer opacity - using M3 standard values
		const stateLayerOpacity = this.pressed
			? 'opacity-12'  // M3 pressed state: 12%
			: this.variant === 'default'
				? 'opacity-0 hover:opacity-8'  // M3 hover state: 8%
				: 'opacity-0 hover:opacity-8'

		// Dynamic icon rotation class
		const iconClasses = this.classMap({
			'flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0': true,
			'text-surface-onVariant group-hover:text-surface-on': true,
			'transition-all duration-200': true,
			'icon-rotate': isOpen
		})

		return html`
			<details
				?open=${isOpen}
				@toggle=${this._handleToggle}
				class="w-full overflow-hidden"
			>
				<summary
					class="cursor-pointer select-none relative flex items-center gap-3 min-h-[48px] sm:min-h-[56px] px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-surface-on group"
					@click=${this._handleClick}
					@mousedown=${this._handleMouseDown}
					@mouseup=${this._handleMouseUp}
					@mouseleave=${this._handleMouseLeave}
					@keydown=${this._handleKeyDown}
					@keyup=${this._handleKeyUp}
					tabindex="0"
				>
					<!-- State layer for hover/focus/pressed states -->
					<div class="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 bg-surface-on ${stateLayerOpacity}"></div>

					<!-- Ripple container -->
					<div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
						${this.ripples.map(
							ripple => html`
								<span
									class="absolute rounded-full scale-0 animate-[ripple_600ms_linear] bg-surface-on opacity-12 pointer-events-none"
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
					<span class=${iconClasses}>
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
				${isOpen ? html`
					<div class="px-4 sm:px-6 pb-3 sm:pb-4 text-surface-onVariant text-sm sm:text-base">
						<div class="content-wrapper" data-open="true">
							<slot></slot>
						</div>
					</div>
				` : ''}
			</details>
		`
	}

	private _handleToggle(e: Event) {
		const details = e.target as HTMLDetailsElement
		this._open$.next(details.open)
		this._dispatchToggleEvent(details.open)
	}

	private _toggleOpen(x: number, y: number) {
		// Add ripple effect
		const id = this.nextRippleId++
		this.ripples = [...this.ripples, { x, y, id }]

		// Remove ripple after animation
		setTimeout(() => {
			this.ripples = this.ripples.filter(r => r.id !== id)
		}, 600)

		// Toggle state
		const newState = !this._open$.value
		this._open$.next(newState)
		this._dispatchToggleEvent(newState)
	}

	private _dispatchToggleEvent(open: boolean) {
		this.dispatchEvent(
			new CustomEvent('toggle', {
				detail: { open },
				bubbles: true,
				composed: true,
			})
		)
	}

	private _handleClick(e: MouseEvent) {
		e.preventDefault()
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
		this._toggleOpen(e.clientX - rect.left, e.clientY - rect.top)
	}

	private _handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this.pressed = true
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
			this._toggleOpen(rect.width / 2, rect.height / 2)
		}
	}

	private _handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			this.pressed = false
		}
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
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-details': SchmancyDetails
	}
}
