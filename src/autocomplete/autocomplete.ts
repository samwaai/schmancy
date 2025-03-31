import { $LitElement } from '@mixins/index'
import { InputSize } from '@schmancy/input'
import SchmancyInputV2 from '@schmancy/input/input-v2'
import SchmancyOption from '@schmancy/option/option'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import style from './autocomplete.scss?inline'

/**
 * @fires change - When selection changes
 */
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
	value: string | string[]
}>

/**
 * SchmancyAutocomplete provides an accessible autocomplete/combobox component
 * with keyboard navigation and single or multi-select capabilities.
 *
 * @element schmancy-autocomplete
 * @slot - Default slot for option elements
 * @slot trigger - Optional slot to override the default input element
 */
@customElement('schmancy-autocomplete')
export default class SchmancyAutocomplete extends $LitElement(style) {
	// Public API properties
	@property({ type: Boolean }) required = false
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true }) label = ''
	@property({ type: String }) maxHeight = '300px'
	@property({ type: Boolean }) multi = false
	@property({ type: String }) description = ''
	@property({ type: String, reflect: true }) size: InputSize = 'md'
	@property({ type: String }) autocomplete = 'off'
	@property({ type: Number }) debounceMs = 200 // Debounce delay in milliseconds

	// Value property with getter/setter
	@property({ type: String, reflect: true })
	get value() {
		if (this.multi) {
			return this._selectedValues.join(',')
		}
		return this._selectedValue
	}
	set value(val: string) {
		if (this.multi) {
			this._selectedValues = val
				? val
						.split(',')
						.map(v => v.trim())
						.filter(Boolean)
				: []
		} else {
			this._selectedValue = val
		}
		this._syncOptionsSelection()
		this._updateInputDisplay()

		// Dispatch change event when value is set programmatically
		if (this.isConnected) {
			this._fireChangeEvent()
		}
	}

	// Internal state
	@state() private _open = false
	@state() private _inputValue = ''
	@state() private _selectedValue = ''
	@state() private _selectedValues: string[] = []
	@state() private _suppressFocusOpen = false // Flag to prevent dropdown from opening on focus after selection

	// Debounce timer reference
	private _debounceTimer: number | null = null

	// DOM references
	@query('#options') _listbox!: HTMLUListElement
	@query('sch-input') _input!: SchmancyInputV2
	@queryAssignedElements({ flatten: true }) private _options!: SchmancyOption[]
	private _inputElementRef = createRef<HTMLInputElement>()

	// Click outside handler reference for cleanup
	private _documentClickHandler = this._onDocumentClick.bind(this)

	// Lifecycle methods
	connectedCallback() {
		super.connectedCallback()
		// Ensure component has ID for ARIA relationships
		if (!this.id) {
			this.id = `sch-autocomplete-${Math.random().toString(36).slice(2, 9)}`
		}
	}

	disconnectedCallback() {
		// Clean up global event listeners
		document.removeEventListener('click', this._documentClickHandler)

		// Clear any pending debounce timer
		if (this._debounceTimer !== null) {
			window.clearTimeout(this._debounceTimer)
		}

		super.disconnectedCallback()
	}

	firstUpdated() {
		// Set up initial state and accessibility
		this._syncOptionsSelection()
		this._setupOptionsAccessibility()
		this._updateInputDisplay()
	}

	updated(changedProps: Map<string, unknown>) {
		super.updated(changedProps)

		// Update document click handler when dropdown state changes
		if (changedProps.has('_open')) {
			if (!this._open) {
				document.removeEventListener('click', this._documentClickHandler)
			}
		}
	}

	/**
	 * Handle document clicks to close dropdown when clicking outside
	 */
	private _onDocumentClick(e: MouseEvent) {
		// Don't close if clicking on component or its children
		if (e.composedPath().includes(this)) {
			return
		}

		// Don't close if clicking on one of the options (which may be in light DOM)
		for (const option of this._options) {
			if (e.composedPath().includes(option)) {
				return
			}
		}

		// Otherwise close the dropdown
		if (this._open) {
			this._open = false
			this._updateInputDisplay()
		}
	}

	/**
	 * Set up initial option accessibility attributes
	 */
	private _setupOptionsAccessibility() {
		this._options.forEach((option, index) => {
			// Set common attributes for all options
			option.setAttribute('role', 'option')
			option.tabIndex = -1

			// Ensure each option has an ID
			if (!option.id) {
				option.id = `${this.id}-option-${index}`
			}

			// Add click handler to options
			if (!option.hasAttribute('data-event-bound')) {
				option.addEventListener('click', e => {
					e.stopPropagation()
					this._selectOption(option)
				})
				option.setAttribute('data-event-bound', 'true')
			}
		})
	}

	/**
	 * Update options' selection state based on component value
	 */
	private _syncOptionsSelection() {
		if (!this._options?.length) return

		this._options.forEach(option => {
			if (this.multi) {
				option.selected = this._selectedValues.includes(option.value)
			} else {
				option.selected = option.value === this._selectedValue
			}

			// Update aria-selected attribute
			option.setAttribute('aria-selected', String(option.selected))
		})
	}

	/**
	 * Show all options without filtering
	 */
	private _showAllOptions() {
		this._options.forEach(option => {
			option.hidden = false
		})

		// Update "No results" visibility - always hidden when showing all
		const emptyMessage = this.shadowRoot?.querySelector('#empty')
		if (emptyMessage) {
			emptyMessage.toggleAttribute('hidden', true)
		}

		// Announce to screen readers
		const totalCount = this._options.length
		this._announceToScreenReader(`${totalCount} option${totalCount === 1 ? '' : 's'} available.`)
	}

	/**
	 * Filter options based on input text - this operation can be expensive
	 * with many options or complex filtering logic
	 */
	private _filterOptions() {
		console.time('filter-options')
		const searchTerm = this._inputValue.toLowerCase().trim()

		// If no search term, show all options instead of filtering
		if (!searchTerm) {
			this._showAllOptions()
			console.timeEnd('filter-options')
			return
		}

		// Track if we have any matches
		let hasMatches = false

		this._options.forEach(option => {
			// Simple substring matching
			const text = (option.label || option.textContent || '').toLowerCase()
			const isMatch = text.includes(searchTerm)
			option.hidden = !isMatch

			if (isMatch) {
				hasMatches = true
			}
		})

		// Update "No results" visibility
		const emptyMessage = this.shadowRoot?.querySelector('#empty')
		if (emptyMessage) {
			emptyMessage.toggleAttribute('hidden', hasMatches)
		}

		// Announce results to screen readers
		const visibleCount = this._getVisibleOptions().length
		this._announceToScreenReader(
			visibleCount > 0 ? `${visibleCount} option${visibleCount === 1 ? '' : 's'} available.` : 'No results found.',
		)
		console.timeEnd('filter-options')
	}

	/**
	 * Get all currently visible options
	 */
	private _getVisibleOptions(): SchmancyOption[] {
		return Array.from(this._options || []).filter(option => !option.hidden)
	}

	/**
	 * Get labels of selected options
	 */
	private _getSelectedLabels(): string[] {
		return Array.from(this._options || [])
			.filter(option =>
				this.multi ? this._selectedValues.includes(option.value) : option.value === this._selectedValue,
			)
			.map(option => option.label || option.textContent || '')
	}

	/**
	 * Update the input display based on selection state
	 */
	private _updateInputDisplay() {
		if (!this._inputElementRef.value) return

		// When dropdown is closed or in single select mode, show the selection
		if (!this._open || !this.multi) {
			if (this.multi) {
				// Show comma-separated labels for multi-select
				this._inputValue = this._getSelectedLabels().join(', ')
			} else {
				// Show selected option label for single-select
				const selectedOption = this._options?.find(o => o.value === this._selectedValue)
				this._inputValue = selectedOption ? selectedOption.label || selectedOption.textContent || '' : ''
			}
		}

		// Update the input value
		this._inputElementRef.value.value = this._inputValue
	}

	/**
	 * Handle input focus
	 */
	private _onInputFocus(e: FocusEvent) {
		e.stopPropagation()

		// If suppress flag is active, don't open dropdown
		if (this._suppressFocusOpen) {
			return
		}

		// If multi-select mode and input is focused, clear it for new input
		if (this.multi) {
			this._inputValue = ''
			if (this._inputElementRef.value) {
				this._inputElementRef.value.value = ''
			}
		}

		this._showDropdown()
	}

	/**
	 * Debounce a function call
	 * @param fn Function to debounce
	 */
	private _debounce(fn: () => void): void {
		// Clear any existing timer
		if (this._debounceTimer !== null) {
			window.clearTimeout(this._debounceTimer)
		}

		// Set new timer
		this._debounceTimer = window.setTimeout(() => {
			fn()
			this._debounceTimer = null
		}, this.debounceMs)
	}

	/**
	 * Handle input text changes with debouncing
	 */
	private _onInputChange(e: Event) {
		const target = e.target as HTMLInputElement
		this._inputValue = target.value

		// Immediate feedback - show dropdown
		if (!this._open) {
			this._showDropdown()
		}

		// Debounce the expensive filtering operation
		this._debounce(() => {
			this._filterOptions()
		})
	}

	/**
	 * Show the dropdown with all options visible initially
	 */
	private _showDropdown() {
		if (this._open) return

		this._open = true

		// Initially show all options instead of filtering
		this._showAllOptions()

		// Add document click handler after a brief delay
		// to avoid immediate closing on the same click event
		setTimeout(() => {
			document.addEventListener('click', this._documentClickHandler)
		}, 10)
	}

	/**
	 * Announce message to screen readers
	 */
	private _announceToScreenReader(message: string) {
		const liveRegion = this.shadowRoot?.querySelector('#live-status')
		if (liveRegion) {
			liveRegion.textContent = message
		}
	}

	/**
	 * Select an option (either via click or keyboard)
	 */
	private _selectOption(option: SchmancyOption) {
		if (this.multi) {
			// Toggle selection in multi-select mode
			const value = option.value
			const index = this._selectedValues.indexOf(value)

			if (index > -1) {
				// Remove if already selected
				this._selectedValues = [...this._selectedValues.slice(0, index), ...this._selectedValues.slice(index + 1)]
			} else {
				// Add if not selected
				this._selectedValues = [...this._selectedValues, value]
			}

			// Clear input for more typing in multi-select mode
			this._inputValue = ''
			if (this._inputElementRef.value) {
				this._inputElementRef.value.value = ''
			}

			// Update option selection state
			option.selected = !option.selected
			option.setAttribute('aria-selected', String(option.selected))

			// Keep dropdown open in multi-select
			// Show all options if input is empty
			if (this._inputValue.trim() === '') {
				this._showAllOptions()
			} else {
				this._filterOptions()
			}

			// Announce selection to screen readers
			const selectedLabels = this._getSelectedLabels()
			this._announceToScreenReader(
				selectedLabels.length > 0 ? `Selected: ${selectedLabels.join(', ')}` : 'No options selected',
			)
		} else {
			// Single-select mode - select and close
			this._selectedValue = option.value

			// Update selected state
			this._syncOptionsSelection()

			// Close dropdown
			this._open = false

			// Set flag to prevent reopening on focus
			this._suppressFocusOpen = true

			// Update input with selected label
			this._updateInputDisplay()

			// For mobile: blur input to dismiss keyboard
			if (this._inputElementRef.value) {
				this._inputElementRef.value.blur()
			}

			// Reset suppress flag after a delay
			setTimeout(() => {
				this._suppressFocusOpen = false
			}, 300)

			// Announce selection to screen readers
			this._announceToScreenReader(`Selected: ${option.label || option.textContent}`)
		}

		// Fire change event
		this._fireChangeEvent()
	}

	/**
	 * Handle keyboard navigation
	 */
	private _onKeyDown(e: KeyboardEvent) {
		// If dropdown is closed, open on arrow down or enter
		if (!this._open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
			e.preventDefault()
			this._showDropdown()

			// Focus first visible option
			setTimeout(() => {
				const visibleOptions = this._getVisibleOptions()
				if (visibleOptions.length > 0) {
					visibleOptions[0].focus()
				}
			}, 10)

			return
		}

		// Early return if dropdown is closed
		if (!this._open) return

		// Handle keyboard navigation
		switch (e.key) {
			case 'Escape':
				e.preventDefault()
				this._open = false
				this._updateInputDisplay()
				this._inputElementRef.value?.focus()
				break

			case 'Tab':
				// Natural tab behavior will move focus; just close dropdown
				this._open = false
				this._updateInputDisplay()
				break

			case 'ArrowDown':
				e.preventDefault()
				this._moveFocus(1)
				break

			case 'ArrowUp':
				e.preventDefault()
				this._moveFocus(-1)
				break

			case 'Home':
				e.preventDefault()
				this._focusFirstOption()
				break

			case 'End':
				e.preventDefault()
				this._focusLastOption()
				break

			case 'Enter':
			case ' ': // Space key
				// Select currently focused option
				const focusedOption = this._getFocusedOption()
				if (focusedOption) {
					e.preventDefault()
					this._selectOption(focusedOption)
				}
				break
		}
	}

	/**
	 * Get the currently focused option
	 */
	private _getFocusedOption(): SchmancyOption | null {
		const visibleOptions = this._getVisibleOptions()
		return visibleOptions.find(opt => opt === document.activeElement) || null
	}

	/**
	 * Move focus to next/previous option
	 */
	private _moveFocus(direction: number) {
		const visibleOptions = this._getVisibleOptions()
		if (!visibleOptions.length) return

		const currentOption = this._getFocusedOption()
		let index = currentOption ? visibleOptions.indexOf(currentOption) : -1

		// Calculate new index
		if (direction > 0) {
			// Move forward, wrap to start
			index = index < visibleOptions.length - 1 ? index + 1 : 0
		} else {
			// Move backward, wrap to end
			index = index > 0 ? index - 1 : visibleOptions.length - 1
		}

		// Focus the option
		visibleOptions[index].focus()
	}

	/**
	 * Focus the first visible option
	 */
	private _focusFirstOption() {
		const visibleOptions = this._getVisibleOptions()
		if (visibleOptions.length > 0) {
			visibleOptions[0].focus()
		}
	}

	/**
	 * Focus the last visible option
	 */
	private _focusLastOption() {
		const visibleOptions = this._getVisibleOptions()
		if (visibleOptions.length > 0) {
			visibleOptions[visibleOptions.length - 1].focus()
		}
	}

	/**
	 * Fire change event
	 */
	private _fireChangeEvent() {
		const detail = {
			value: this.multi ? this._selectedValues : this._selectedValue,
		}

		this.dispatchEvent(
			new CustomEvent<SchmancyAutocompleteChangeEvent['detail']>('change', {
				detail,
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Check validity for form integration
	 */
	public checkValidity(): boolean {
		if (!this.required) return true
		return this.multi ? this._selectedValues.length > 0 : Boolean(this._selectedValue)
	}

	/**
	 * Report validity for form integration
	 */
	public reportValidity(): boolean {
		if (this._inputElementRef.value) {
			return this._inputElementRef.value.reportValidity()
		}
		return this.checkValidity()
	}

	render() {
		const descriptionId = `${this.id}-desc`

		return html`
			<div class="schmancy-autocomplete relative z-10">
				<!-- Screen reader live region -->
				<div id="live-status" role="status" aria-live="polite" class="sr-only"></div>

				<!-- Description (for screen readers) -->
				${this.description ? html`<div id="${descriptionId}" class="sr-only">${this.description}</div>` : ''}

				<!-- Input / trigger slot -->
				<slot name="trigger">
					<sch-input
						.size=${this.size}
						${ref(this._inputElementRef)}
						id="autocomplete-input"
						class="w-full"
						.label=${this.label}
						.placeholder=${this.placeholder}
						.required=${this.required}
						.value=${this._inputValue}
						type="text"
						autocomplete=${this.autocomplete}
						clickable
						role="combobox"
						aria-autocomplete="list"
						aria-haspopup="listbox"
						aria-controls="options"
						aria-expanded=${this._open}
						aria-describedby=${this.description ? descriptionId : undefined}
						@input=${this._onInputChange}
						@focus=${this._onInputFocus}
						@click=${(e: MouseEvent) => {
							e.stopPropagation()
							this._onInputFocus(new FocusEvent('focus'))
						}}
						@keydown=${this._onKeyDown}
					>
					</sch-input>
				</slot>

				<!-- Options dropdown -->
				<ul
					id="options"
					class=${classMap({
						absolute: true,
						'z-[1000]': true,
						'mt-1': true,
						'w-full': true,
						'rounded-md': true,
						'shadow-sm': true,
						'overflow-auto': true,
						'min-w-full': true,
						'bg-surface-container': true,
					})}
					role="listbox"
					aria-multiselectable=${this.multi ? 'true' : 'false'}
					aria-label=${`${this.label || 'Options'} dropdown`}
					?hidden=${!this._open}
					style="
            max-height: ${this.maxHeight}; 
            display: ${this._open ? 'block' : 'none'};
          "
					@slotchange=${() => {
						this._setupOptionsAccessibility()
						this._syncOptionsSelection()
						// Show all options when slot content changes, don't filter yet
						this._showAllOptions()
					}}
				>
					<!-- Options slot -->
					<slot></slot>
				</ul>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-autocomplete': SchmancyAutocomplete
	}
}
