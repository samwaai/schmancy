import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { map, takeUntil, tap } from 'rxjs/operators'

/**
 * Input chip component - represents user-provided information that can be removed.
 *
 * IMPORTANT: Per Material Design 3 specification, input chips do NOT have selected state.
 * They represent discrete pieces of user input (like entered tags, selections from lists, etc.)
 * that can only be removed, not toggled on/off.
 *
 * Use cases:
 * - Displaying selected recipients in an email
 * - Showing applied filters that can be removed
 * - Tags or keywords entered by the user
 * - Selected items from a multi-select dropdown
 *
 * @fires click - Optional click event on chip body (value)
 * @fires remove - Dispatched when remove button is clicked (value)
 *
 * @example
 * ```html
 * <schmancy-input-chip value="john@example.com" avatar="/avatars/john.jpg">
 *   John Doe
 * </schmancy-input-chip>
 * ```
 */
@customElement('schmancy-input-chip')
export class SchmancyInputChip extends TailwindElement(css`
	:host {
		display: inline-block;
		outline: none;
		min-width:fit-content

	}

	:host([disabled]) {
		pointer-events: none;
	}

	button {
		font-family: inherit;
	}

	.avatar-img {
		width: 20px;
		height: 20px;
		object-fit: cover;
	}

	/* Material Symbols font for icons */
	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined';
		font-weight: normal;
		font-style: normal;
		font-size: 18px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
		-moz-osx-font-smoothing: grayscale;
		font-feature-settings: 'liga';
		vertical-align: middle;
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

	:host(:not([disabled])) .chip-container:hover .state-layer {
		opacity: 0.08;
	}

	:host(:not([disabled])) .chip-container:focus-visible .state-layer {
		opacity: 0.1;
	}

	:host(:not([disabled])) .chip-container:active .state-layer {
		opacity: 0.1;
	}
`) {
	/** Value identifier for the chip */
	@property({ type: String, reflect: true })
	value: string = ''

	/** Optional icon name (Material Symbols) */
	@property({ type: String, reflect: true })
	icon: string = ''

	/** Optional avatar image URL */
	@property({ type: String, reflect: true })
	avatar: string = ''

	/** Whether to show remove button (default true for input chips) */
	@property({ type: Boolean, reflect: true })
	removable: boolean = true

	/** Disable the chip */
	@property({ type: Boolean, reflect: true })
	disabled: boolean = false

	/** Elevated style variant */
	@property({ type: Boolean, reflect: true })
	elevated: boolean = false

	// RxJS state streams
	private chipHover$ = new BehaviorSubject<boolean>(false)
	private removeHover$ = new BehaviorSubject<boolean>(false)
	private focused$ = new BehaviorSubject<boolean>(false)
	private pressed$ = new BehaviorSubject<boolean>(false)

	// UI state from combined streams
	@state() private uiState = {
		chipHover: false,
		removeHover: false,
		focused: false,
		pressed: false
	}

	// Ripple effects
	@state() private ripples: Array<{ x: number; y: number; id: number }> = []
	private nextRippleId = 0

	constructor() {
		super()
		try {
			this.internals = this.attachInternals()
		} catch {
			this.internals = undefined
		}
	}

	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}

	static formAssociated = true
	internals: ElementInternals | undefined
	get form() {
		return this.internals?.form
	}

	connectedCallback() {
		super.connectedCallback()

		// Combine all UI state streams
		combineLatest([
			this.chipHover$,
			this.removeHover$,
			this.focused$,
			this.pressed$
		]).pipe(
			map(([chipHover, removeHover, focused, pressed]) => ({
				chipHover,
				removeHover,
				focused,
				pressed
			})),
			tap(state => {
				this.uiState = state
			}),
			takeUntil(this.disconnecting)
		).subscribe()
	}

	private handleChipClick = (e: MouseEvent) => {
		if (this.disabled) return

		// Add ripple effect
		const chip = this.shadowRoot?.querySelector('.chip-container') as HTMLElement
		if (chip) {
			const rect = chip.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			const id = this.nextRippleId++

			this.ripples = [...this.ripples, { x, y, id }]

			// Remove ripple after animation
			setTimeout(() => {
				this.ripples = this.ripples.filter(r => r.id !== id)
			}, 600)
		}

		// Dispatch optional click event (for custom handling if needed)
		this.dispatchEvent(
			new CustomEvent('click', {
				detail: { value: this.value },
				bubbles: true,
				composed: true,
			})
		)
	}

	private handleRemove = (e: Event) => {
		if (this.disabled) return

		e.stopPropagation()

		// Dispatch remove event
		this.dispatchEvent(
			new CustomEvent('remove', {
				detail: { value: this.value },
				bubbles: true,
				composed: true,
			})
		)
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (this.disabled) return

		// Delete or Backspace removes the chip
		if ((e.key === 'Delete' || e.key === 'Backspace') && this.removable) {
			e.preventDefault()
			this.handleRemove(e)
		}
		// Enter can optionally trigger click
		else if (e.key === 'Enter') {
			e.preventDefault()
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				clientX: 0,
				clientY: 0
			})
			this.handleChipClick(clickEvent)
		}
	}

	private handleFocus = () => {
		this.focused$.next(true)
	}

	private handleBlur = () => {
		this.focused$.next(false)
	}

	protected render(): unknown {
		const hasLeadingIcon = this.avatar || this.icon;

		const chipClasses = {
			'chip-container': true,
			'inline-flex': true,
			'items-center': true,
			'gap-2': true,
			'h-8': true, // M3: 32px height
			'min-h-[32px]': true,
			'rounded-full': true,
			'cursor-default': true,
			'transition-all': true,
			'duration-200': true,
			'select-none': true,
			'text-sm': true, // M3: 14px Label Large
			'font-medium': true, // M3: 500 weight
			'relative': true,
			'overflow-hidden': true,
			'border': true,

			// M3 Padding: 8px with icon, 16px without (leading), 8px with trailing icon
			'pl-2': hasLeadingIcon, // 8px with avatar/icon
			'pl-4': !hasLeadingIcon, // 16px without
			'pr-2': this.removable, // 8px with remove button
			'pr-4': !this.removable, // 16px without

			// M3 Colors for input chips
			'bg-surface-containerLow': true,
			'text-surface-onVariant': true,
			'border-outline': true,

			// Input chips are flat (no elevation) per M3

			// Focus-visible state
			'focus-visible:outline': !this.disabled,
			'focus-visible:outline-2': !this.disabled,
			'focus-visible:outline-primary': !this.disabled,
			'focus-visible:outline-offset-2': !this.disabled,

			// Disabled state
			'opacity-38': this.disabled, // M3 disabled opacity
			'cursor-not-allowed': this.disabled
		}

		const removeButtonClasses = {
			'size-[18px]': true, // M3: 18px icon size
			'flex': true,
			'items-center': true,
			'justify-center': true,
			'rounded-full': true,
			'transition-all': true,
			'duration-200': true,
			'cursor-pointer': !this.disabled,
			'-mr-1': true, // Adjust for visual balance

			// Hover state for remove button
			'hover:bg-surface-containerHighest': !this.disabled,
			'opacity-50': this.disabled
		}

		return html`
			<div
				class=${classMap(chipClasses)}
				@click=${this.handleChipClick}
				@keydown=${this.handleKeyDown}
				@mouseenter=${() => this.chipHover$.next(true)}
				@mouseleave=${() => this.chipHover$.next(false)}
				@mousedown=${() => this.pressed$.next(true)}
				@mouseup=${() => this.pressed$.next(false)}
				@focus=${this.handleFocus}
				@blur=${this.handleBlur}
				role="button"
				tabindex=${this.disabled ? '-1' : '0'}
				aria-disabled=${this.disabled}
				aria-label=${this.value}
			>
				<!-- Avatar image (if provided) -->
				${this.avatar ? html`
					<img
						src=${this.avatar}
						alt=""
						class="avatar-img rounded-full size-5"
					/>
				` : ''}

				<!-- Icon (if provided and no avatar) -->
				${this.icon && !this.avatar ? html`
					<span class="material-symbols-outlined text-[18px] shrink-0">
						${this.icon}
					</span>
				` : ''}

				<!-- Chip content -->
				<span class="text-sm font-medium leading-5">
					<slot></slot>
				</span>

				<!-- Remove button (shown by default for input chips) -->
				${this.removable ? html`
					<button
						class=${classMap(removeButtonClasses)}
						@click=${this.handleRemove}
						@mouseenter=${() => this.removeHover$.next(true)}
						@mouseleave=${() => this.removeHover$.next(false)}
						aria-label="Remove"
						tabindex="-1"
						?disabled=${this.disabled}
					>
						<span class="material-symbols-outlined text-[18px]">
							close
						</span>
					</button>
				` : ''}

				<!-- Ripple effects -->
				${this.ripples.map(ripple => html`
					<span
						class="ripple"
						style="left: ${ripple.x}px; top: ${ripple.y}px;"
					></span>
				`)}

				<!-- State layer for M3 hover/focus/pressed states -->
				<div class="state-layer"></div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-input-chip': SchmancyInputChip
	}
}

export type InputChipClickEvent = { value: string }
export type InputChipRemoveEvent = { value: string }