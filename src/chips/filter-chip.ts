import { SchmancyElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { magnetic } from '../directives/magnetic'

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
export class SchmancyFilterChip extends SchmancyElement {
	static styles = [css`
	:host {
		display: inline-flex;
		outline: none;
		border-radius: 0.5rem;
		transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	:host(:active:not([disabled])) {
		transform: scale(0.95);
		transition-duration: 100ms;
	}

	:host([disabled]) {
		pointer-events: none;
		opacity: var(--schmancy-sys-state-disabled-opacity);
	}

	@media (prefers-reduced-motion: reduce) {
		:host { transition: none; }
		:host(:active:not([disabled])) { transform: none; }
	}

	button {
		font-family: inherit;
	}
`];
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

	/** Whether to show a remove button */
	@property({ type: Boolean, reflect: true })
	removable: boolean = false

	/** Whether the chip is disabled */
	@property({ type: Boolean, reflect: true })
	disabled: boolean = false

	/** Whether to use elevated style with shadow */
	@property({ type: Boolean, reflect: true })
	elevated: boolean = false


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
	}

	protected updated(changed: Map<string, unknown>) {
		super.updated?.(changed)
		if (changed.has('value') || changed.has('selected')) {
			this.internals?.setFormValue(this._selected ? (this.value || 'on') : null)
		}
	}

	formResetCallback(): void {
		this._selected = this.hasAttribute('selected')
	}

	formDisabledCallback(disabled: boolean): void {
		this.disabled = disabled
	}

	private handleClick = () => {
		if (this.disabled) return

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
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value: this.value, selected: !this._selected },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}


	protected render(): unknown {
		const chipClasses = {
			'inline-flex': true,
			'items-center': true,
			'gap-2': true,
			'rounded-lg': true,
			'h-8 px-4': true,
			'cursor-pointer': !this.disabled,
			'transition-all': true,
			'duration-200': true,
			'select-none': true,
			'text-sm': true,
			'font-medium': true,
			'relative': true,
			'min-h-[32px]': true,

			// Background and text colors based on selection state
			'bg-secondary-container': this._selected,
			'text-secondary-onContainer': this._selected,
			'bg-surface-container': !this._selected,
			'text-surface-on': !this._selected,

			// Hover states
			'hover:brightness-95': this._selected && !this.disabled,
			'hover:bg-surface-containerHigh': !this._selected && !this.disabled,

			// Pressed state
			'active:brightness-90': !this.disabled,

			// Focus-visible state
			'focus-visible:outline': !this.disabled,
			'focus-visible:outline-2': !this.disabled,
			'focus-visible:outline-offset-2': !this.disabled,
			'focus-visible:outline-primary-default': !this.disabled,

			// Elevated style
			'shadow-md': this.elevated && !this.disabled,
			'hover:shadow-lg': this.elevated && !this.disabled,

			// Disabled state
			'opacity-[var(--schmancy-sys-state-disabled-opacity)]': this.disabled,
			'cursor-not-allowed': this.disabled,
		}

		return html`
			<button
				${magnetic({ strength: 2, radius: 40 })}
				class=${this.classMap(chipClasses)}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				?disabled=${this.disabled}
				aria-pressed=${this._selected ? 'true' : 'false'}
				role="checkbox"
				tabindex="0"
			>
				<slot></slot>

				${this.removable
					? html`
							<button
								class="ml-1 -mr-1 p-0.5 rounded-full hover:bg-surface-containerHighest transition-colors duration-200"
								@click=${this.handleRemove}
								aria-label="Remove filter"
								tabindex="-1"
							>
								<span class="material-symbols-outlined text-sm">close</span>
							</button>
						`
					: ''}
			</button>
		`
	}
}

if (!customElements.get('schmancy-filter-chip')) {
	customElements.define('schmancy-filter-chip', SchmancyFilterChip)
}

if (!customElements.get('schmancy-chip')) {
	class SchmancyChipCompat extends SchmancyFilterChip {}
	customElements.define('schmancy-chip', SchmancyChipCompat)
}

export { SchmancyFilterChip as SchmancyChip }

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chip': SchmancyFilterChip
		'schmancy-filter-chip': SchmancyFilterChip
	}
}

export type FilterChipChangeEvent = { value: string; selected: boolean }
export type FilterChipRemoveEvent = { value: string }
export type SchmancyChipChangeEvent = FilterChipChangeEvent
