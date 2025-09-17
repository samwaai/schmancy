import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

/**
 * Filter chip component for content filtering.
 *
 * Filter chips are the ONLY chip type that maintains persistent selected state.
 * They are used for filtering content by toggling on/off different filter criteria.
 *
 * @fires change - Dispatched when selection state changes with {value, selected}
 * @fires remove - Dispatched when remove button is clicked (if removable)
 *
 * @example
 * ```html
 * <schmancy-filter-chip value="category-1" selected>
 *   Category 1
 * </schmancy-filter-chip>
 * ```
 */
export class SchmancyFilterChip extends TailwindElement(css`
	:host {
		display: inline-block;
		outline: none;
		min-width:'fit'
	}

	:host([disabled]) {
		pointer-events: none;
		opacity: 0.5;
	}

	button {
		font-family: inherit;
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
`) {
	/** Unique identifier for this filter chip */
	@property({ type: String, reflect: true })
	value: string = ''

	/** Whether the filter chip is selected (active filter) */
	private _selected: boolean = false

	@property({ type: Boolean, reflect: true })
	get selected(): boolean {
		return this._selected
	}
	set selected(value: boolean) {
		const oldValue = this._selected
		this._selected = value
		this.requestUpdate('selected', oldValue)
	}

	/** Optional icon to display (Material Symbols name) */
	@property({ type: String, reflect: true })
	icon: string = ''

	/** Whether to show a remove button */
	@property({ type: Boolean, reflect: true })
	removable: boolean = false

	/** Whether the chip is disabled */
	@property({ type: Boolean, reflect: true })
	disabled: boolean = false

	/** Whether to use elevated style with shadow */
	@property({ type: Boolean, reflect: true })
	elevated: boolean = false

	// Reactive state management with RxJS
	private hover$ = new BehaviorSubject<boolean>(false)
	private pressed$ = new BehaviorSubject<boolean>(false)
	private focused$ = new BehaviorSubject<boolean>(false)

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

		// RxJS streams are maintained for potential future use
		// Currently state is handled directly through event handlers
		combineLatest([
			this.hover$,
			this.pressed$,
			this.focused$,
		]).pipe(
			// States are managed through event handlers directly
			// This pipeline is kept for potential future state combinations
			takeUntil(this.disconnecting),
		).subscribe()
	}

	private handleClick = () => {
		if (this.disabled) return

		// Don't modify this.selected - let the parent container control it
		// Dispatch change event with the INTENDED state
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value: this.value, selected: !this._selected },
				bubbles: true,
				composed: true,
			}),
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
			}),
		)
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (this.disabled) return

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			// Dispatch event directly rather than calling handleClick to be explicit
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value: this.value, selected: !this._selected },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	private handleMouseEnter = () => {
		this.hover$.next(true)
	}

	private handleMouseLeave = () => {
		this.hover$.next(false)
		this.pressed$.next(false)
	}

	private handleMouseDown = () => {
		this.pressed$.next(true)
	}

	private handleMouseUp = () => {
		this.pressed$.next(false)
	}

	private handleFocus = () => {
		this.focused$.next(true)
	}

	private handleBlur = () => {
		this.focused$.next(false)
	}

	protected render(): unknown {
		const chipClasses = {
			'inline-flex': true,
			'items-center': true,
			'gap-2': true,
			'rounded-full': true,
			'px-4': true,
			'py-2': true,
			'cursor-pointer': !this.disabled,
			'transition-all': true,
			'duration-200': true,
			'select-none': true,
			'text-sm': true,
			'font-medium': true,
			'border': true,
			'relative': true,

			// Background and text colors based on selection state
			'bg-secondary-container': this._selected,
			'text-secondary-onContainer': this._selected,
			'border-secondary-container': this._selected,
			'bg-surface-container': !this._selected,
			'text-surface-on': !this._selected,
			'border-outline-variant': !this._selected,

			// Hover states
			'hover:brightness-95': this._selected && !this.disabled,
			'hover:bg-surface-containerHigh': !this._selected && !this.disabled,

			// Pressed state
			'active:scale-95': !this.disabled,

			// Focus-visible state for better UX
			'focus-visible:outline': !this.disabled,
			'focus-visible:outline-2': !this.disabled,
			'focus-visible:outline-offset-2': !this.disabled,
			'focus-visible:outline-primary-default': !this.disabled,

			// Elevated style
			'shadow-md': this.elevated && !this.disabled,
			'hover:shadow-lg': this.elevated && !this.disabled,

			// Disabled state
			'opacity-50': this.disabled,
			'cursor-not-allowed': this.disabled
		}

		return html`
			<button
				class=${classMap(chipClasses)}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				@mouseenter=${this.handleMouseEnter}
				@mouseleave=${this.handleMouseLeave}
				@mousedown=${this.handleMouseDown}
				@mouseup=${this.handleMouseUp}
				@focus=${this.handleFocus}
				@blur=${this.handleBlur}
				?disabled=${this.disabled}
				aria-pressed=${this._selected ? 'true' : 'false'}
				role="checkbox"
				tabindex="0"
			>
				<!-- Checkmark icon (only when selected) -->
				${this._selected ? html`
					<span class="material-symbols-outlined text-[18px]">
						check
					</span>
				` : ''}

				<!-- Optional custom icon -->
				${this.icon && !this._selected ? html`
					<span class="material-symbols-outlined text-[18px]">
						${this.icon}
					</span>
				` : ''}

				<!-- Chip content -->
				<slot></slot>

				<!-- Remove button (if removable) -->
				${this.removable ? html`
					<button
						class="ml-1 -mr-1 p-0.5 rounded-full hover:bg-surface-containerHighest transition-colors"
						@click=${this.handleRemove}
						aria-label="Remove filter"
						tabindex="-1"
					>
						<span class="material-symbols-outlined text-[16px]">
							close
						</span>
					</button>
				` : ''}
			</button>
		`
	}
}

// Register the element with both names for backward compatibility
// Check if not already registered to prevent duplicate registration errors
if (!customElements.get('schmancy-filter-chip')) {
	customElements.define('schmancy-filter-chip', SchmancyFilterChip)
}

// For backward compatibility, register 'schmancy-chip' with a subclass
// to avoid duplicate constructor registration error
if (!customElements.get('schmancy-chip')) {
	class SchmancyChipCompat extends SchmancyFilterChip {}
	customElements.define('schmancy-chip', SchmancyChipCompat)
}

// Export alias for backward compatibility
export { SchmancyFilterChip as SchmancyChip }

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chip': SchmancyFilterChip
		'schmancy-filter-chip': SchmancyFilterChip
	}
}

export type FilterChipChangeEvent = { value: string; selected: boolean }
export type FilterChipRemoveEvent = { value: string }
// Alias for backward compatibility
export type SchmancyChipChangeEvent = FilterChipChangeEvent