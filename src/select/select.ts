import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import SchmancyInput from '@schmancy/input/input'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html, PropertyValues, TemplateResult } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

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
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true }) value: string | string[] = '' // for single-select or multi-select
	@property({ type: Boolean }) multi = false
	@property({ type: String }) label = ''
	@property({ type: String }) hint = ''
	@property({ type: String }) validateOn: 'always' | 'touched' | 'dirty' | 'submitted' = 'touched'

	// Internal states
	@state() private isOpen = false
	@state() private valueLabel = ''
	@state() private isValid = true
	@property({ type: String }) validationMessage = ''

	@query('ul') private ul!: HTMLUListElement
	@query('sch-input') private inputRef!: SchmancyInput
	@queryAssignedElements({ flatten: true }) private options!: SchmancyOption[]
	private cleanupPositioner?: () => void
	@state() private _userInteracted = false
	@state() private _touched = false
	@state() private _dirty = false
	@state() private _submitted = false

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
			this.id = `schmancy-select-${Math.random().toString(36).substr(2, 9)}`
		}
		this.addEventListener('keydown', this.handleKeyDown)

		// Listen for form submission events to mark field as submitted
		if (this.internals?.form) {
			this.internals.form.addEventListener('submit', () => {
				this._submitted = true
				this.checkValidity()
			})

			// Listen for form reset
			this.internals.form.addEventListener('reset', () => {
				this.reset()
			})
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.removeEventListener('keydown', this.handleKeyDown)
		this.cleanupPositioner?.()

		// Remove form event listeners
		if (this.internals?.form) {
			this.internals.form.removeEventListener('submit', () => {
				this._submitted = true
			})

			this.internals.form.removeEventListener('reset', () => {
				this.reset()
			})
		}
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
			const selectedValues = Array.isArray(this.value) ? this.value : []
			this.options.forEach(o => (o.selected = selectedValues.includes(o.value))) // Update option selected state
			this.valueLabel =
				selectedValues.length > 0
					? this.options
							.filter(o => selectedValues.includes(o.value))
							.map(o => o.label)
							.join(', ')
					: this.placeholder
		} else {
			const selectedOption = this.options.find(o => o.value === this.value)
			this.valueLabel = selectedOption?.label || this.placeholder
		}
	}

	private setupOptionsAccessibility() {
		this.options.forEach((option, index) => {
			option.setAttribute('role', 'option')
			if (!option.id) {
				option.id = `${this.id}-option-${index}`
			}
			option.tabIndex = -1
			const selectedValues = Array.isArray(this.value) ? this.value : []

			option.setAttribute(
				'aria-selected',
				String(this.multi ? selectedValues.includes(option.value) : option.value === this.value),
			)
		})
	}

	private async positionDropdown() {
		const reference = this.renderRoot.querySelector('.trigger') as HTMLElement
		if (!reference || !this.ul) return

		// Get the available height
		const availableHeight = window.innerHeight - reference.getBoundingClientRect().bottom - 10 // 10px buffer
		this.ul.style.maxHeight = `${availableHeight}px` // Set max height

		this.cleanupPositioner = autoUpdate(reference, this.ul, async () => {
			const { x, y } = await computePosition(reference, this.ul, {
				placement: 'bottom-start',
				middleware: [offset(5), flip(), shift({ padding: 5 })],
			})

			Object.assign(this.ul.style, {
				left: `${x}px`,
				top: `${y}px`,
				position: 'absolute',
			})
		})
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (!this.isOpen) {
			if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
				e.preventDefault()
				this.openDropdown(false)
			}
			return
		}

		const current = this.options.findIndex(o => o.matches(':focus')) ?? -1

		switch (e.key) {
			case 'Escape':
				this.closeDropdown()
				break
			case 'ArrowDown':
				e.preventDefault()
				this.focusOption(this.options, Math.min(current + 1, this.options.length - 1))
				break
			case 'ArrowUp':
				e.preventDefault()
				this.focusOption(this.options, Math.max(current - 1, 0))
				break
			case 'Enter':
			case ' ':
				e.preventDefault()
				if (current >= 0) this.handleOptionSelect(this.options[current].value)
				break
			case 'Tab':
				this.closeDropdown()
				break
		}
	}

	private focusOption(options: HTMLElement[], index: number) {
		const option = options[index]
		if (option) {
			option.focus()
			const combobox = this.renderRoot.querySelector('.trigger')
			combobox?.setAttribute('aria-activedescendant', option.id)
		}
	}

	private async openDropdown(report = false) {
		this._touched = true // Mark as touched when dropdown is opened
		this.isOpen = true
		await this.updateComplete

		this.positionDropdown()
		this.setupOptionsAccessibility()

		const options = Array.from(this.ul.querySelectorAll('[role="option"]')) as HTMLElement[]
		const selectedIndex = this.multi ? 0 : options.findIndex(o => o.getAttribute('value') === this.value)
		this.focusOption(options, Math.max(selectedIndex, 0))

		if (report) this.reportValidity()
	}

	private closeDropdown() {
		this._touched = true // Mark as touched when dropdown is closed
		this.isOpen = false
		this.cleanupPositioner?.()
		const combobox = this.renderRoot.querySelector<HTMLElement>('.trigger')
		combobox?.removeAttribute('aria-activedescendant')
		combobox?.focus()

		// Check validity when closing, respecting validation strategy
		if (this.shouldShowValidation()) {
			this.checkValidity()
		}
	}

	private handleOptionSelect(value: string) {
		this._userInteracted = true
		this._touched = true
		this._dirty = true

		if (this.multi) {
			const option = this.options.find(o => o.value === value)
			if (!option) return

			option.selected = !option.selected
			let selectedValues = Array.isArray(this.value) ? [...this.value] : []

			if (option.selected) {
				selectedValues = [...selectedValues, value]
			} else {
				selectedValues = selectedValues.filter(v => v !== value)
			}

			this.value = selectedValues

			this.valueLabel =
				selectedValues.length > 0
					? this.options
							.filter(o => selectedValues.includes(o.value))
							.map(o => o.label)
							.join(', ')
					: this.placeholder

			this.dispatchChange(selectedValues)
		} else {
			this.options.forEach(o => (o.selected = o.value === value))
			this.value = value
			this.valueLabel = this.options.find(o => o.value === value)?.label || this.placeholder
			this.dispatchChange(value)
			this.closeDropdown()
		}

		this.setupOptionsAccessibility()

		// Check validity respecting validation strategy
		this.checkValidity()
	}

	private dispatchChange(value: string | string[]) {
		// Dispatch events first
		this.dispatchEvent(
			new CustomEvent<SchmancySelectChangeEvent['detail']>('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		)
		this.dispatchEvent(new Event('change', { bubbles: true }))

		// Then check validity (only show error if validation should be shown)
		this.checkValidity()
	}

	public checkValidity(): boolean {
		// Determine if the select is empty based on whether it's multi-select or single-select
		const isEmpty = this.multi ? !Array.isArray(this.value) || this.value.length === 0 : !this.value

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
		this.value = ''
		this.valueLabel = this.placeholder
		this.isValid = true
		this.validationMessage = ''
		this._touched = false
		this._dirty = false
		this._submitted = false
		this._userInteracted = false
		this.internals?.setValidity({})
		this.options.forEach(o => (o.selected = false))

		if (this.inputRef) {
			this.inputRef.error = false
			this.inputRef.hint = this.hint
		}
	}

	render(): TemplateResult {
		// Determine if we should show errors based on the validation strategy
		const showErrors = !this.isValid && this.shouldShowValidation()

		return html`
			<div class="relative">
				<sch-input
					.name=${this.name}
					tabIndex="0"
					class="trigger"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded=${this.isOpen}
					aria-controls="options"
					aria-autocomplete="none"
					aria-required=${this.required}
					.label=${this.label}
					.placeholder=${this.placeholder}
					.value=${this.valueLabel}
					.required=${this.required}
					.hint=${showErrors ? this.validationMessage : this.hint}
					.error=${showErrors}
					.validateOn=${this.validateOn}
					readonly
					@click=${() => (this.isOpen ? this.closeDropdown() : this.openDropdown(true))}
				></sch-input>

				<div
					id="overlay"
					class="fixed inset-0"
					?hidden=${!this.isOpen}
					@click=${this.closeDropdown}
					tabindex="-1"
					aria-hidden="true"
				></div>

				<ul
					id="options"
					role="listbox"
					aria-multiselectable=${this.multi}
					class=${classMap({
						'absolute z-[1000] mt-1 w-full rounded-md shadow-sm': true,
						hidden: !this.isOpen,
					})}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
					@click=${(e: Event) => {
						const customEvt = e as CustomEvent
						const detailVal = customEvt.detail?.value
						if (detailVal) {
							this.handleOptionSelect(detailVal)
						}
					}}
				>
					<slot
						@slotchange=${() => {
							this.syncSelection()
							this.setupOptionsAccessibility()
						}}
					></slot>
				</ul>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-select': SchmancySelect
	}
}
