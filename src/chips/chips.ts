import { $LitElement } from '@mixins/index'
import { css, html, PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import type { FilterChipChangeEvent as SchmancyChipChangeEvent } from './filter-chip'
import { SchmancyFilterChip as SchmancyChip } from './filter-chip'

@customElement('schmancy-chips')
export default class SchmancyChips extends $LitElement(

css`
:host{
	display:block;
	height:fit-content;
	width:fit-content;
}
	
`
) {
	// RxJS state streams - initialized with undefined to detect if properties were set
	private value$ = new BehaviorSubject<string>('')
	private values$ = new BehaviorSubject<string[]>([])

	// Track if properties were initialized from attributes/properties
	private _value: string = ''
	private _values: string[] = []
	private _multi: boolean = false

	// Track if properties have been explicitly set
	private _valueSet: boolean = false
	private _valuesSet: boolean = false

	/**
	 * @deprecated Use .values for multi-selection or .value for single-selection instead.
	 * The mode is now automatically determined based on which property is used.
	 */
	@property({
		type: Boolean,
		reflect: true,
	})
	get multi(): boolean {
		return this._multi
	}
	set multi(value: boolean) {
		this._multi = value
		// Note: We don't update any BehaviorSubject here as mode is now computed
	}

	/**
	 * Automatically determines the selection mode based on which properties are in use
	 */
	private get mode(): 'multi' | 'single' | 'none' {
		// Check if values array is being used (explicitly set)
		if (this._valuesSet) {
			return 'multi'
		}
		// Check if value string is being used (explicitly set)
		if (this._valueSet) {
			return 'single'
		}
		// Check if either property has been set via attributes
		if (this.hasAttribute('values')) {
			return 'multi'
		}
		if (this.hasAttribute('value')) {
			return 'single'
		}
		// Fallback to deprecated multi prop for backward compatibility
		if (this._multi === true) {
			return 'multi'
		}
		// Default to none (no selection management)
		return 'none'
	}

	@property({
		type: Array,
		reflect: true,
	})
	get values(): string[] {
		return this._values
	}
	set values(value: string[]) {
		this._values = value || []
		this._valuesSet = true // Mark that values has been explicitly set
		this.values$.next(this._values)
	}

	@property({
		type: String,
		reflect: true,
	})
	get value(): string {
		return this._value
	}
	set value(value: string) {
		this._value = value || ''
		this._valueSet = true // Mark that value has been explicitly set
		this.value$.next(this._value)
	}

	@queryAssignedElements({
		selector:
			'schmancy-chip, schmancy-filter-chip, schmancy-assist-chip, schmancy-input-chip, schmancy-suggestion-chip',
		flatten: true,
	})
	chips!: (SchmancyChip | HTMLElement)[]

	@property({
		type: Boolean,
		reflect: true,
	})
	wrap: boolean = false

	@property({
		type: Boolean,
		reflect: true,
	})
	required: boolean = false

	@property({
		type: String,
		reflect: true,
	})
	justify: 'start' | 'center' | 'end' = 'start'

	connectedCallback() {
		super.connectedCallback()

		// Initialize BehaviorSubjects with current property values
		// This ensures properties set before connectedCallback are respected
		this.value$.next(this._value)
		this.values$.next(this._values)

		// Set up reactive pipeline for state synchronization
		combineLatest([
			this.value$.pipe(distinctUntilChanged()),
			this.values$.pipe(
				distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((v, i) => v === curr[i])),
			),
		])
			.pipe(
				debounceTime(0), // Ensure DOM is ready
				takeUntil(this.disconnecting),
			)
			.subscribe(([value, values]) => {
				// Reactively update chip states based on container state and auto-detected mode
				this.updateChipStates(this.mode, value, values)
			})
	}

	private updateChipStates(mode: 'multi' | 'single' | 'none', value: string, values: string[]) {
		if (!this.chips) return

		// If mode is 'none', don't manage selection state
		if (mode === 'none') return

		this.chips.forEach(chip => {
			if ('value' in chip && 'selected' in chip) {
				const filterChip = chip as SchmancyChip
				if (mode === 'multi') {
					// In multi mode: only select if values array explicitly includes this chip's value
					filterChip.selected = values.length > 0 && values.includes(filterChip.value)
				} else if (mode === 'single') {
					// In single mode: only select if value is non-empty AND matches this chip's value
					// This prevents chips from being selected when value is empty string
					filterChip.selected = value !== '' && value === filterChip.value
				}
			}
		})
	}

	async change(e: CustomEvent<SchmancyChipChangeEvent>) {
		e.preventDefault()
		e.stopPropagation()

		// If mode is 'none', don't handle selection changes
		if (this.mode === 'none') return

		const { value, selected } = e.detail

		// Update the reactive streams and internal tracking, which will trigger state synchronization
		if (this.mode === 'multi') {
			if (selected) {
				// Add value if not already present
				if (!this._values.includes(value)) {
					this._values = [...this._values, value]
					this.values$.next(this._values)
				}
			} else {
				// Remove value
				this._values = this._values.filter(v => v !== value)
				this.values$.next(this._values)
			}
		} else if (this.mode === 'single') {
			if (selected) {
				this._value = value
			} else if (!this.required) {
				// Allow deselection if not required
				this._value = ''
			} else {
				// Required mode - ignore deselection
				return
			}
			this.value$.next(this._value)
		}

		// Request update to trigger re-render and property reflection
		this.requestUpdate()

		// Dispatch change event with appropriate detail based on mode
		this.dispatchEvent(
			new CustomEvent<SchmancyChipsChangeEvent>('change', {
				detail: this.mode === 'multi' ? this._values : this._value,
				bubbles: true,
			}),
		)
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties)
		// Initial state synchronization will happen through the reactive pipeline
		// Force an initial update to ensure chips are synchronized
		this.updateChipStates(this.mode, this._value, this._values)
	}

	protected render(): unknown {
		const classes= {
			"flex flex-nowrap justify-center gap-2 max-w-lvw":true,
			"flex-wrap": this.wrap,
			"justify-center": this.justify === 'center',

		}
		return html`
					<schmancy-scroll hide .direction=${this.wrap ?'vertical': 'horizontal'} class="${this.classMap(classes)}" @change=${this.change}>
					<slot
					@slotchange=${() => {
						// When slot changes, trigger state update through reactive pipeline
						this.updateChipStates(this.mode, this._value, this._values)
					}}
				></slot>
			</schmancy-scroll>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chips': SchmancyChips
	}
}
export type SchmancyChipsChangeEvent = string | Array<string>
