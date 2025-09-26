import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import SchmancyInput from '@schmancy/input/input'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html, PropertyValues, TemplateResult } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { BehaviorSubject, combineLatest, fromEvent, Subject, takeUntil } from 'rxjs'
import { tap, withLatestFrom } from 'rxjs/operators'

export type SchmancySelectChangeEvent = CustomEvent<{
	value: string | string[]
}>

@customElement('schmancy-select')
export class SchmancySelect extends $LitElement(css`
	:host {
		display: block;
		position: relative;
	}

	[role='listbox'] {
		overflow-y: auto;
		outline: none;
	}
`) {
	// Form association setup
	static formAssociated = true
	private internals?: ElementInternals

	// API
	@property({ type: String }) name: string | undefined
	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true })
	get value() {
		return this.multi
			? this._selectedValues$.value.join(',')
			: this._selectedValue$.value
	}
	set value(val: string | string[]) {
		if (this.multi) {
			const values = Array.isArray(val)
				? val
				: val ? String(val).split(',').map(v => v.trim()).filter(Boolean) : []
			this._selectedValues$.next(values)
		} else {
			this._selectedValue$.next(String(val || ''))
		}
	}

	// Values property for multi-select mode
	@property({ type: Array })
	get values() {
		return [...this._selectedValues$.value]
	}
	set values(vals: string[]) {
		this._selectedValues$.next(Array.isArray(vals) ? [...vals] : [])
	}

	@property({ type: Boolean }) multi = false
	@property({ type: String }) label = ''
	@property({ type: String }) hint = ''
	@property({ type: String }) validateOn: 'always' | 'touched' | 'dirty' | 'submitted' = 'touched'
	@property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md'

	// Internal states
	@state() private isOpen = false
	@state() private valueLabel = ''
	@state() private isValid = true
	@property({ type: String }) validationMessage = ''

	// Store the initial/default value for reset behavior
	@state() private defaultValue: string | string[] = ''

	@query('ul') private ul!: HTMLUListElement
	@query('sch-input') private inputRef!: SchmancyInput
	@queryAssignedElements({ flatten: true }) private options!: SchmancyOption[]
	private cleanupPositioner?: () => void

	// Reactive state management
	private _options$ = new BehaviorSubject<SchmancyOption[]>([])
	private _selectedValue$ = new BehaviorSubject<string>('')
	private _selectedValues$ = new BehaviorSubject<string[]>([])
	private _optionSelect$ = new Subject<SchmancyOption>()
	@state() _userInteracted = false
	@state() private _touched = false
	@state() private _dirty = false
	@state() private _submitted = false

	// Reference to current focused option (for keyboard navigation)
	@state() private _focusedOptionId = ''

	// Form event handlers
	private formSubmitHandler = () => {
		this._submitted = true
		this.checkValidity()
	}

	private formResetHandler = () => {
		this.reset()
	}

	constructor() {
		super()
		// Initialize ElementInternals for form association
		try {
			this.internals = this.attachInternals()
		} catch (e) {
			console.warn('FormAssociated elements not supported in this browser', e)
		}
	}

	get form() {
		return this.internals?.form
	}

	connectedCallback() {
		super.connectedCallback()
		if (!this.id) {
			this.id = `schmancy-select-${Math.random().toString(36).substring(2, 9)}`
		}

		// Store initial value for reset
		this.defaultValue = this.value

		// Add keyboard handling to host element
		fromEvent<KeyboardEvent>(this, 'keydown').pipe(takeUntil(this.disconnecting)).subscribe(this.handleKeyDown)

		// Setup reactive pipelines
		this._setupReactivePipelines()

		// Listen for form submission events to mark field as submitted
		if (this.internals?.form) {
			fromEvent(this.internals.form, 'submit')
				.pipe(takeUntil(this.disconnecting))
				.subscribe(this.formSubmitHandler)

			// Listen for form reset
			fromEvent(this.internals.form, 'reset')
				.pipe(takeUntil(this.disconnecting))
				.subscribe(this.formResetHandler)
		}

		// Initially hide any validation errors until user interacts
		if (this.inputRef) {
			this.inputRef.error = false
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.cleanupPositioner?.()
		// Form event listeners are automatically cleaned up via takeUntil(this.disconnecting)
	}

	firstUpdated() {
		this.syncSelection()
		this.setupOptionsAccessibility()
	}

	updated(changedProps: PropertyValues) {
		super.updated(changedProps)

		if (changedProps.has('value')) {
			// Update form value when component value changes
			const formValue = Array.isArray(this.value) ? this.value.join(',') : this.value
			this.internals?.setFormValue(formValue)

			// Mark as dirty if value changes from initial value
			if (this.hasUpdated) {
				this._dirty = true
			}

			// Check validity based on validation strategy
			if (this.hasUpdated) {
				this.checkValidity()
			}
		}

		// When open state changes, setup or cleanup the dropdown positioner
		if (changedProps.has('isOpen')) {
			if (this.isOpen) {
				this.positionDropdown()
			} else {
				this.cleanupPositioner?.()
			}
		}
	}

	/**
	 * Determines if validation errors should be shown based on current state
	 * and validation strategy
	 */
	private shouldShowValidation(forceValidation = false): boolean {
		if (forceValidation) return true

		switch (this.validateOn) {
			case 'always':
				return true
			case 'touched':
				return this._touched
			case 'dirty':
				return this._dirty
			case 'submitted':
				return this._submitted
			default:
				return this._touched
		}
	}

	private syncSelection() {
		if (this.multi) {
			// Read directly from the BehaviorSubject to avoid string conversion issues
			const selectedValues = this._selectedValues$.value
			this.options?.forEach(o => (o.selected = selectedValues.includes(o.value))) // Update option selected state
			this.valueLabel =
				selectedValues.length > 0
					? this.options
							?.filter(o => selectedValues.includes(o.value))
							.map(o => o.label || o.textContent || '')
							.join(', ') || this.placeholder
					: this.placeholder
		} else {
			// Single select - read from BehaviorSubject
			const currentValue = this._selectedValue$.value
			this.options?.forEach(o => {
				// Set selected property on each option based on matching value
				o.selected = o.value === currentValue
			})
			const selectedOption = this.options?.find(o => o.value === currentValue)
			this.valueLabel = selectedOption ? (selectedOption.label || selectedOption.textContent || '') : this.placeholder
		}
	}

	private setupOptionsAccessibility() {
		this.options?.forEach((option, index) => {
			option.setAttribute('role', 'option')
			if (!option.id) {
				option.id = `${this.id}-option-${index}`
			}

			// Set tabindex to -1 so they're focusable programmatically but not in the tab order
			option.tabIndex = -1
			const selectedValues = Array.isArray(this.value) ? this.value : this.value ? this.value.split(',') : []

			option.setAttribute(
				'aria-selected',
				String(this.multi ? selectedValues.includes(option.value) : option.value === this.value),
			)
		})
	}

	private async positionDropdown() {
		const reference = this.renderRoot.querySelector('.trigger') as HTMLElement
		if (!reference || !this.ul) return

		this.cleanupPositioner = autoUpdate(reference, this.ul, async () => {
			// Get viewport dimensions
			const viewportHeight = window.innerHeight
			const triggerRect = reference.getBoundingClientRect()

			// Calculate available space below and above
			const spaceBelow = viewportHeight - triggerRect.bottom
			const spaceAbove = triggerRect.top

			// Calculate max height - use 75% of the largest available space, but at least 150px
			const maxHeight = Math.max(Math.max(spaceBelow, spaceAbove) * 0.75, 150)

			// Determine if we should flip
			const shouldFlip = spaceBelow < 200 && spaceAbove > spaceBelow

			// Apply max height
			this.ul.style.maxHeight = `${maxHeight}px`

			const { x, y } = await computePosition(reference, this.ul, {
				placement: shouldFlip ? 'top-start' : 'bottom-start',
				middleware: [offset(5), flip(), shift({ padding: 5 })],
			})

			Object.assign(this.ul.style, {
				left: `${x}px`,
				top: `${y}px`,
				position: 'absolute',
				width: `${reference.offsetWidth}px`, // Match the width of the trigger
			})
		})
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		// Don't handle keyboard events when disabled
		if (this.disabled) {
			return
		}

		if (!this.isOpen) {
			if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
				e.preventDefault()
				this.openDropdown(false)
			}
			return
		}

		// Find current focused option
		const options = Array.from(this.options || [])
		const current = options.findIndex(o => o.id === this._focusedOptionId) ?? -1

		switch (e.key) {
			case 'Escape':
				e.preventDefault()
				this.closeDropdown()
				break
			case 'ArrowDown':
				e.preventDefault()
				this.focusOption(options, Math.min(current + 1, options.length - 1))
				break
			case 'ArrowUp':
				e.preventDefault()
				this.focusOption(options, Math.max(current - 1, 0))
				break
			case 'Home':
				e.preventDefault()
				this.focusOption(options, 0)
				break
			case 'End':
				e.preventDefault()
				this.focusOption(options, options.length - 1)
				break
			case 'Enter':
			case ' ':
				e.preventDefault()
				if (this._focusedOptionId) {
					const focusedOption = options.find(opt => opt.id === this._focusedOptionId)
					if (focusedOption) {
						this.handleOptionSelect(focusedOption.value)
					}
				}
				break
			case 'Tab':
				this.closeDropdown()
				break
		}
	}

	private focusOption(options: SchmancyOption[], index: number) {
		const option = options[index]
		if (option) {
			option.focus()
			this._focusedOptionId = option.id

			// Update aria-activedescendant on the combobox
			const combobox = this.renderRoot.querySelector('.trigger')
			if (combobox) {
				combobox.setAttribute('aria-activedescendant', option.id)
			}

			// Ensure option is visible in the scrollable area
			if (this.ul && option.offsetTop !== undefined) {
				// Get position info
				const optionTop = option.offsetTop
				const optionHeight = option.offsetHeight
				const scrollTop = this.ul.scrollTop
				const ulHeight = this.ul.clientHeight

				// Scroll into view if needed
				if (optionTop < scrollTop) {
					this.ul.scrollTop = optionTop
				} else if (optionTop + optionHeight > scrollTop + ulHeight) {
					this.ul.scrollTop = optionTop + optionHeight - ulHeight
				}
			}
		}
	}

	private async openDropdown(report = false) {
		// Don't open if disabled
		if (this.disabled) {
			return
		}

		// Don't mark as touched on opening - we'll do that on closing
		// so errors only show after interaction is complete

		this.isOpen = true
		await this.updateComplete

		// Focus first or selected option
		const options = Array.from(this.options || [])
		const selectedIndex = this.multi ? 0 : options.findIndex(o => o.value === String(this.value))

		this.focusOption(options, Math.max(selectedIndex, 0))

		// Don't automatically validate when opening
		// Only validate if explicitly requested (like from a form submission)
		if (report) this.reportValidity()
	}

	private closeDropdown() {
		// Only mark as touched if the user actually interacted with the component
		// and made a selection or explicitly closed it without selecting
		if (this._userInteracted) {
			this._touched = true
		}

		this.isOpen = false
		this._focusedOptionId = ''

		// Update combobox to remove aria-activedescendant
		const combobox = this.renderRoot.querySelector<HTMLElement>('.trigger')
		if (combobox) {
			combobox.removeAttribute('aria-activedescendant')
			combobox?.focus()
		}

		// Only check validity when closing if the user has actually interacted
		// with the component and validation should be shown
		if (this._userInteracted && this.shouldShowValidation()) {
			this.checkValidity()
		}
	}

	private _setupReactivePipelines() {
		// Listen for option-select events from child options
		fromEvent<CustomEvent>(this, 'option-select')
			.pipe(
				tap((e) => {
					e.stopPropagation() // Prevent event from bubbling further
					const option = this.options.find(o => o.value === e.detail.value)
					if (option) {
						this._optionSelect$.next(option)
					}
				}),
				takeUntil(this.disconnecting)
			)
			.subscribe()

		// Handle option selection through reactive pipeline
		this._optionSelect$
			.pipe(
				withLatestFrom(this._selectedValue$, this._selectedValues$),
				tap(([option, _, currentValues]) => {
					this._userInteracted = true
					this._touched = true
					this._dirty = true

					if (this.multi) {
						const index = currentValues.indexOf(option.value)
						const newValues = index > -1
							? [...currentValues.slice(0, index), ...currentValues.slice(index + 1)]
							: [...currentValues, option.value]
						this._selectedValues$.next(newValues)

						// Update display label
						this.valueLabel = newValues.length > 0
							? this.options
									.filter(o => newValues.includes(o.value))
									.map(o => o.label || o.textContent || '')
									.join(', ')
							: this.placeholder
					} else {
						// Single select
						this._selectedValue$.next(option.value)
						this.valueLabel = option.label || option.textContent || this.placeholder
						this.closeDropdown()
					}

					// Update the option's accessibility state
					this.setupOptionsAccessibility()

					// Dispatch change event
					this._fireChangeEvent()
				}),
				takeUntil(this.disconnecting)
			)
			.subscribe()

		// Options management pipeline - bind pointerdown events exactly like autocomplete
		this._options$
			.pipe(
				tap((options) => {
					options.forEach((option, index) => {
						option.setAttribute('role', 'option')
						option.tabIndex = -1
						if (!option.id) {
							option.id = `${this.id}-option-${index}`
						}
						// Use data-event-bound to prevent duplicate bindings
						if (!option.hasAttribute('data-event-bound')) {
							fromEvent(option, 'pointerdown').pipe(
								tap(e => {
									e.preventDefault() // Prevent blur from firing
									e.stopPropagation()
								}),
								takeUntil(this.disconnecting)
							).subscribe(() => this._optionSelect$.next(option))
							option.setAttribute('data-event-bound', 'true')
						}
					})
				}),
				takeUntil(this.disconnecting)
			)
			.subscribe()

		// Selection sync pipeline - sync selected states with value changes
		combineLatest([this._selectedValue$, this._selectedValues$, this._options$])
			.pipe(
				tap(([singleValue, multiValues, options]) => {
					if (options.length === 0) return

					if (this.multi) {
						options.forEach(option => {
							option.selected = multiValues.includes(option.value)
						})
					} else {
						options.forEach(option => {
							option.selected = option.value === singleValue
						})
					}
				}),
				takeUntil(this.disconnecting)
			)
			.subscribe()
	}

	private handleOptionSelect(value: string) {
		// This method is now called from keyboard navigation only
		const option = this.options.find(o => o.value === value)
		if (option) {
			this._optionSelect$.next(option)
		}
	}

	private _fireChangeEvent() {
		// Get the current value based on multi/single mode
		const value = this.multi ? this._selectedValues$.value : this._selectedValue$.value

		// Dispatch only one change event with the value in detail
		this.dispatchEvent(
			new CustomEvent<SchmancySelectChangeEvent['detail']>('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		)

		// Then check validity (only show error if validation should be shown)
		this.checkValidity()
	}

	public checkValidity(): boolean {
		// Disabled fields are always valid
		if (this.disabled) {
			return true
		}

		// Determine if the select is empty based on whether it's multi-select or single-select
		const isEmpty = this.multi ? (Array.isArray(this.value) ? this.value.length === 0 : !this.value) : !this.value

		// Check if the value is valid (not empty when required)
		const isValid = !(this.required && isEmpty)

		// Set the validity state
		this.isValid = isValid

		if (!this.isValid) {
			this.validationMessage = 'Please select an option.'
			this.internals?.setValidity({ valueMissing: true }, 'Please select an option.', this.inputRef)
		} else {
			// Clear validation message
			this.validationMessage = ''
			this.internals?.setValidity({})
		}

		// Update the input component to reflect our validation state
		if (this.inputRef && this.hasUpdated) {
			const showError = !this.isValid && this.shouldShowValidation()
			this.inputRef.error = showError
			this.inputRef.hint = showError ? this.validationMessage : this.hint
		}

		return this.isValid
	}

	public reportValidity(): boolean {
		// Force validation display regardless of validation strategy
		const valid = this.checkValidity()

		// Force the input to show validation errors
		if (this.inputRef) {
			// Set the input's error state
			this.inputRef.error = !valid
			this.inputRef.hint = !valid ? this.validationMessage : this.hint

			// If invalid and not already open, automatically open the dropdown to show options
			if (!valid && !this.isOpen) {
				// Open the dropdown but don't mark as user interaction yet
				// This helps users immediately see available options when validation fails
				this.openDropdown(false)
			}

			// Only call reportValidity on the input if invalid to show the native popup
			if (!valid) {
				this.inputRef.reportValidity()
			}
		}

		return valid
	}

	public setCustomValidity(message: string) {
		this.validationMessage = message
		if (message) {
			this.isValid = false
			this.internals?.setValidity({ customError: true }, message, this.inputRef)
		} else {
			this.isValid = true
			this.internals?.setValidity({})
		}

		// Update input if needed
		if (this.inputRef && this.shouldShowValidation()) {
			this.inputRef.error = !this.isValid
			this.inputRef.hint = !this.isValid ? this.validationMessage : this.hint
		}
	}

	public reset() {
		// Reset to initial value
		this.value = this.defaultValue
		this.valueLabel = this.placeholder
		this.isValid = true
		this.validationMessage = ''
		this._touched = false
		this._dirty = false
		this._submitted = false
		this._userInteracted = false
		this.internals?.setValidity({})

		if (this.inputRef) {
			this.inputRef.error = false
			this.inputRef.hint = this.hint
		}
	}

	render(): TemplateResult {
		// Determine if we should show errors based on the validation strategy and interaction
		// Never show errors on initial render or if the dropdown is open
		const showErrors = !this.isValid && this.shouldShowValidation() && !this.isOpen

		// Add caret icon based on open state
		const caretIcon = this.isOpen
			? html`<span class="absolute right-3 top-1/2 transform -translate-y-1/2">▲</span>`
			: html`<span class="absolute right-3 top-1/2 transform -translate-y-1/2">▼</span>`

		return html`
			<div class="relative ${this.disabled ? 'opacity-60 cursor-not-allowed' : ''}">
				<sch-input
					.name=${this.name}
					tabIndex=${this.disabled ? '-1' : '0'}
					class="trigger"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded=${this.isOpen}
					aria-controls="options"
					aria-autocomplete="none"
					aria-required=${this.required}
					aria-activedescendant=${this._focusedOptionId || undefined}
					aria-disabled=${this.disabled}
					.label=${this.label}
					.placeholder=${this.placeholder}
					.value=${this.valueLabel}
					.required=${this.required}
					.disabled=${this.disabled}
					.hint=${showErrors ? this.validationMessage : this.hint}
					.error=${showErrors}
					.validateOn=${this.validateOn}
					.size=${this.size}
					readonly
					clickable
					@click=${(e: MouseEvent) => {
						// Don't process clicks if disabled
						if (this.disabled) {
							e.preventDefault()
							e.stopPropagation()
							return
						}

						// On first click, don't count this as user interaction yet
						if (!this.isOpen) {
							// Open without triggering validation - we'll validate when they close
							this.openDropdown(false)
						} else {
							// Mark as interacted when they close the dropdown
							this._userInteracted = true
							this.closeDropdown()
						}
					}}
				>
					${caretIcon}
				</sch-input>

				<!-- Overlay for capturing clicks outside when dropdown is open -->
				${this.isOpen
					? html` <div class="fixed inset-0 z-10" @click=${this.closeDropdown} tabindex="-1" aria-hidden="true"></div> `
					: ''}

				<ul
					id="options"
					role="listbox"
					aria-multiselectable=${this.multi}
					class=${classMap({
						'absolute min-w-full w-full z-20 mt-1 rounded-md shadow-lg': true,
						hidden: !this.isOpen,
					})}
					${color({
						bgColor: SchmancyTheme.sys.color.surface.low,
						color: SchmancyTheme.sys.color.surface.on,
					})}
				>
					<slot
						@slotchange=${() => {
							this._options$.next(this.options)
							// Sync selection state when options re-render
							this.syncSelection()
						}}
					></slot>
				</ul>
			</div>
		`
	}
}

// Don't export 'select' here as it conflicts with the store's select decorator
// export const select = SchmancySelect

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-select': SchmancySelect
	}
}
