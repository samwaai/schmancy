import { $LitElement } from '@mixins/index'
import { InputSize, SchmancyInput } from '@schmancy/input'
import SchmancyOption from '@schmancy/option/option'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { when } from 'lit/directives/when.js'
import {
    BehaviorSubject,
    combineLatest
} from 'rxjs'
import {
    debounceTime,
    distinctUntilChanged,
    take,
    takeUntil,
    tap
} from 'rxjs/operators'
import style from './autocomplete.scss?inline'

// Import the similarity function (or include it inline)
import { similarity } from '../utils/search'
// Import chip component for multi-select display
import '../chips/input-chip'

export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[]
    values?: string[]
}>

interface FilteredOption {
    option: SchmancyOption
    score: number
}

@customElement('schmancy-autocomplete')
export default class SchmancyAutocomplete extends $LitElement(style) {
    // Track whether value/values have been explicitly set
     _valueSet: boolean = false
     _valuesSet: boolean = false

    // Public API properties
    @property({ type: Boolean }) required = false
    @property({ type: String }) placeholder = ''
    @property({ type: String, reflect: true }) label = ''
    @property({ type: String }) name = ''
    @property({ type: String }) maxHeight = '300px'
    @property({ type: Boolean }) multi = false
    @property({ type: String }) description = ''
    @property({ type: String, reflect: true }) size: InputSize = 'md'
    @property({ type: String }) autocomplete = 'off'
    @property({ type: Number }) debounceMs = 200
    @property({ type: Number }) similarityThreshold = 0.3 // Minimum similarity score to show option
    @property({ type: Boolean }) error = false
    @property({ type: String }) validationMessage = ''

    // Values property for multi-select mode
    @property({ type: Array })
    get values() {
        return [...this._selectedValues$.value]
    }
    set values(vals: string[]) {
        this._valuesSet = true
        this._selectedValues$.next(Array.isArray(vals) ? [...vals] : [])
    }

    // Value property
    @property({ type: String, reflect: true })
    get value() {
        return this.multi 
            ? this._selectedValues$.value.join(',')
            : this._selectedValue$.value
    }
    set value(val: string) {
        this._valueSet = true
        if (this.multi) {
            const newValues = val ? val.split(',').map(v => v.trim()).filter(Boolean) : []
            const currentValues = this._selectedValues$.value
            // Only update if values actually changed
            if (JSON.stringify(newValues) !== JSON.stringify(currentValues)) {
                this._selectedValues$.next(newValues)
            }
        } else {
            // Only update if value actually changed
            if (val !== this._selectedValue$.value) {
                this._selectedValue$.next(val)
                // Update the input display when value is set
                this._updateInputDisplay()
            }
        }
    }

    // State
    @state() private _open = false
    @state() private _inputValue = ''
    @state() private _visibleOptionsCount = 0
    @state() private _hasResults = true

    // Track if we're clicking on an option to prevent blur interference
    private _isSelectingOption = false

    // DOM references
    @query('#options') _listbox!: HTMLUListElement
    @query('sch-input') _input!: SchmancyInput
    @queryAssignedElements({ flatten: true }) private _options!: SchmancyOption[]
    private _inputElementRef = createRef<HTMLInputElement>()

    // RxJS Subjects - only what we actually need
    private _selectedValue$ = new BehaviorSubject<string>('')
    private _selectedValues$ = new BehaviorSubject<string[]>([])
    private _inputValue$ = new BehaviorSubject<string>('')

    connectedCallback() {
        super.connectedCallback()

        if (!this.id) {
            this.id = `sch-autocomplete-${Math.random().toString(36).slice(2, 9)}`
        }

        this._setupAutocompleteLogic()
        this._setupDocumentClickHandler()
    }

    private _setupAutocompleteLogic() {
        // Sync selection state
        combineLatest([
            this._selectedValue$,
            this._selectedValues$
        ]).pipe(
            tap(([selectedValue, selectedValues]) => {
                this._updateOptionSelection(selectedValue, selectedValues)
            }),
            takeUntil(this.disconnecting)
        ).subscribe()

        // Filter options based on input
        this._inputValue$.pipe(
            distinctUntilChanged(),
            debounceTime(this.debounceMs),
            tap(searchTerm => {
                if (this._open) {
                    this._filterOptions(searchTerm)
                }
            }),
            takeUntil(this.disconnecting)
        ).subscribe()
    }

    private _setupOptionHandlers() {
        this._options.forEach((option, index) => {
            option.setAttribute('role', 'option')
            option.tabIndex = -1
            if (!option.id) {
                option.id = `${this.id}-option-${index}`
            }
            // Prevent blur handler from interfering with option selection
            option.onmousedown = (e: MouseEvent) => {
                e.preventDefault() // Prevent focus loss
                this._isSelectingOption = true
            }

            // Handle the actual selection
            option.onclick = (e: MouseEvent) => {
                e.stopPropagation()
                this._selectOption(option)
                // Reset flag after a short delay
                setTimeout(() => {
                    this._isSelectingOption = false
                }, 50)
            }
        })
    }

    private _updateOptionSelection(selectedValue: string, selectedValues: string[]) {
        this._options.forEach(option => {
            option.selected = this.multi
                ? selectedValues.includes(option.value)
                : option.value === selectedValue
            option.setAttribute('aria-selected', String(option.selected))
        })
    }

    private _filterOptions(searchTerm: string) {
        const term = searchTerm.trim()

        if (!term) {
            // Show all options if no search term
            this._options.forEach(option => {
                option.hidden = false
                option.style.order = '0'
            })
            this._visibleOptionsCount = this._options.length
            this._hasResults = true
        } else {
            // Calculate similarity scores for all options
            const scoredOptions: FilteredOption[] = this._options.map(option => {
                const optionLabel = option.label || option.textContent || ''
                const optionValue = option.value

                const labelScore = similarity(term, optionLabel)
                const valueScore = similarity(term, optionValue)
                const score = Math.max(labelScore * 1.1, valueScore)

                return { option, score }
            })

            // Sort by score (highest first)
            scoredOptions.sort((a, b) => b.score - a.score)

            // Apply visibility and ordering
            let visibleCount = 0
            scoredOptions.forEach((item, index) => {
                const { option, score } = item

                if (score < this.similarityThreshold) {
                    option.hidden = true
                } else {
                    option.hidden = false
                    visibleCount++
                    option.style.order = String(index)
                }
            })

            this._visibleOptionsCount = visibleCount
            this._hasResults = visibleCount > 0
        }

        this._announceToScreenReader(
            this._visibleOptionsCount > 0
                ? `${this._visibleOptionsCount} option${this._visibleOptionsCount === 1 ? '' : 's'} available.`
                : 'No results found.'
        )
    }

    private _selectOption(option: SchmancyOption) {
        if (this.multi) {
            const currentValues = this._selectedValues$.value
            const index = currentValues.indexOf(option.value)
            const newValues = index > -1
                ? currentValues.filter(v => v !== option.value)
                : [...currentValues, option.value]

            this._selectedValues$.next(newValues)
            this._announceToScreenReader(
                newValues.length > 0
                    ? `Selected: ${this._getSelectedLabels().join(', ')}`
                    : 'No options selected'
            )
            this._fireChangeEvent()
        } else {
            // Fix the bug: Update value BEFORE firing event
            this._selectedValue$.next(option.value)

            // Now fire event with the NEW value
            this._fireChangeEvent()

            // Update UI
            this._open = false
            this._inputValue = option.label || option.textContent || ''
            this._inputValue$.next(this._inputValue)

            // Blur the input
            setTimeout(() => this._inputElementRef.value?.blur(), 100)

            this._announceToScreenReader(`Selected: ${option.label || option.textContent}`)
        }
    }

    private _setupDocumentClickHandler() {
        // Simple document click handler
        const handleDocumentClick = (e: MouseEvent) => {
            if (!this._open) return

            const path = e.composedPath()
            if (!path.includes(this) && !this._options.some(opt => path.includes(opt))) {
                this._open = false
                this._updateInputDisplay()
            }
        }

        document.addEventListener('click', handleDocumentClick)

        // Cleanup on disconnect
        this.disconnecting.pipe(take(1)).subscribe(() => {
            document.removeEventListener('click', handleDocumentClick)
        })
    }


    private _updateInputDisplay() {
        // For multi-select, we don't update input display since chips show the selections
        if (this.multi) return

        const selectedValue = this._selectedValue$.value
        const option = this._options.find(opt => opt.value === selectedValue)
        this._inputValue = option ? option.label || option.textContent || '' : ''
        this._inputValue$.next(this._inputValue)

        if (this._inputElementRef.value) {
            this._inputElementRef.value.value = this._inputValue
        }
    }

    private _getSelectedLabels(): string[] {
        return this._options
            .filter(option => 
                this.multi 
                    ? this._selectedValues$.value.includes(option.value)
                    : option.value === this._selectedValue$.value
            )
            .map(option => option.label || option.textContent || '')
    }

    private _announceToScreenReader(message: string) {
        const liveRegion = this.shadowRoot?.querySelector('#live-status')
        if (liveRegion) {
            liveRegion.textContent = message
        }
    }

    private _fireChangeEvent() {
        const detail: SchmancyAutocompleteChangeEvent['detail'] = {
            value: this.value,
        }

        if (this.multi) {
            detail.values = [...this._selectedValues$.value]
        }

        this.dispatchEvent(
            new CustomEvent<SchmancyAutocompleteChangeEvent['detail']>('change', {
                detail,
                bubbles: true,
                composed: true,
            })
        )
    }

    public checkValidity(): boolean {
        if (!this.required) return true
        return this.multi 
            ? this._selectedValues$.value.length > 0 
            : Boolean(this._selectedValue$.value)
    }

    public reportValidity(): boolean {
        if (this._inputElementRef.value) {
            return this._inputElementRef.value.reportValidity()
        }
        return this.checkValidity()
    }

    firstUpdated() {
        this._setupOptionHandlers()

        // Sync initial value with display after options are available
        this._updateInputDisplay()

        // Update options when slot changes
        const slot = this.shadowRoot?.querySelector('slot')
        slot?.addEventListener('slotchange', () => {
            this._setupOptionHandlers()
            this._updateOptionSelection(this._selectedValue$.value, this._selectedValues$.value)
        })
    }

    private handleChipRemove(value: string) {
        const currentValues = this._selectedValues$.value
        const newValues = currentValues.filter(v => v !== value)
        this._selectedValues$.next(newValues)
        this._fireChangeEvent()
        this._announceToScreenReader(`Removed: ${this._getChipLabel(value)}`)
    }

    private _getChipLabel(value: string): string {
        const option = this._options.find(opt => opt.value === value)
        return option ? option.label || option.textContent || value : value
    }

    private _focusTextInput() {
        if (this._inputElementRef.value) {
            this._inputElementRef.value.focus()
        }
    }

    render() {
        const descriptionId = `${this.id}-desc`

        // Get size-based styling to match Schmancy input
        const getSizeStyles = () => {
            switch (this.size) {
                case 'sm':
                    return {
                        height: 'min-h-[40px]',
                        padding: 'px-2',
                        fontSize: 'text-sm', // 14px
                        labelSize: 'text-sm'
                    }
                case 'lg':
                    return {
                        height: 'min-h-[60px]',
                        padding: 'px-5',
                        fontSize: 'text-lg', // 18px
                        labelSize: 'text-lg'
                    }
                case 'md':
                default:
                    return {
                        height: 'min-h-[50px]',
                        padding: 'px-4',
                        fontSize: 'text-base', // 16px
                        labelSize: 'text-base'
                    }
            }
        }

        const { height, padding, fontSize, labelSize } = getSizeStyles()

        return html`
            <div class="relative">
                <!-- Screen reader live region -->
                <div id="live-status" role="status" aria-live="polite" class="sr-only"></div>

                <!-- Description -->
                ${this.description ? html`<div id="${descriptionId}" class="sr-only">${this.description}</div>` : ''}

                <!-- Custom input wrapper for Gmail-style chip input -->
                <slot name="trigger">
                    ${when(this.multi,
                        () => html`
                            <!-- Custom multi-select input with inline chips -->
                            <div class="relative">
                                ${when(this.label, () => html`
                                    <label class="${classMap({
                                        'block mb-1 font-medium': true,
                                        'text-primary-default': !this.error,
                                        'text-error-default': this.error,
                                        [labelSize]: true
                                    })}">
                                        ${this.label}${this.required ? html`<span class="text-error-default ml-1">*</span>` : ''}
                                    </label>
                                `)}
                                <div
                                    class="${classMap({
                                        'flex flex-wrap items-center gap-1': true,
                                        [height]: true,
                                        [padding]: true,
                                        'block w-full min-w-0 rounded-[8px] border-0': true,
                                        'bg-surface-highest text-surface-on': true,
                                        'ring-0 ring-inset focus-within:ring-1 focus-within:ring-inset': true,
                                        'ring-secondary-default  focus-within:ring-secondary-default': !this.error,
                                        'ring-error-default focus-within:ring-error-default': this.error,
                                        'cursor-text transition-colors duration-200': true
                                    })}"
                                    @click=${() => this._focusTextInput()}
                                    role="combobox"
                                    aria-autocomplete="list"
                                    aria-haspopup="listbox"
                                    aria-controls="options"
                                    aria-expanded=${this._open}
                                >
                                    <!-- Render chips inline -->
                                    ${repeat(
                                        this._selectedValues$.value,
                                        value => value,
                                        value => html`
                                            <schmancy-input-chip
                                                .value=${value}
                                                @remove=${(e: CustomEvent) => this.handleChipRemove(e.detail.value)}
                                                class="flex-shrink-0 my-0.5"
                                            >
                                                ${this._getChipLabel(value)}
                                            </schmancy-input-chip>
                                        `
                                    )}

                                    <!-- Text input for typing -->
                                    <input
                                        ${ref(this._inputElementRef)}
                                        id="autocomplete-input"
                                        type="text"
                                        class="flex-1 min-w-[120px] py-1 bg-transparent border-none outline-none ${fontSize} font-medium text-surface-on placeholder:text-muted"
                                        name=${this.name || this.label?.toLowerCase().replace(/\s+/g, '-') || ''}
                                        .placeholder=${this._selectedValues$.value.length > 0 ? 'Add more...' : this.placeholder}
                                        .value=${this._inputValue}
                                        .autocomplete=${this.autocomplete}
                                        @input=${(e: Event) => {
                                            const value = (e.target as HTMLInputElement).value
                                            this._inputValue = value
                                            this._inputValue$.next(value)
                                        }}
                                        @focus=${(e: FocusEvent) => {
                                            e.stopPropagation()
                                            // Clear input on focus for new searches
                                            this._inputValue = ''
                                            this._inputValue$.next('')
                                            this._open = true
                                        }}
                                        @keydown=${(e: KeyboardEvent) => {
                                            this._handleKeyDown(e)
                                        }}
                                        @blur=${() => {
                                            this._handleAutoSelectOnBlur()
                                        }}
                                    />
                                </div>

                                <!-- Validation message -->
                                ${when(this.error && this.validationMessage, () => html`
                                    <div class="mt-1 text-sm text-error-default">
                                        ${this.validationMessage}
                                    </div>
                                `)}
                            </div>
                        `,
                        () => html`
                            <!-- Regular single-select input -->
                            <schmancy-input
                                .size=${this.size}
                                ${ref(this._inputElementRef)}
                                id="autocomplete-input"
                                class="w-full"
                                .name=${this.name || this.label?.toLowerCase().replace(/\s+/g, '-') || ''}
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
                                @input=${(e: Event) => {
                                    const value = (e.target as HTMLInputElement).value
                                    this._inputValue = value
                                    this._inputValue$.next(value)
                                }}
                                @focus=${(e: FocusEvent) => {
                                    e.stopPropagation()
                                    this._open = true
                                }}
                                @click=${(e: MouseEvent) => {
                                    e.stopPropagation()
                                    this._open = true
                                }}
                                @keydown=${(e: KeyboardEvent) => {
                                    this._handleKeyDown(e)
                                }}
                                @blur=${() => {
                                    this._handleAutoSelectOnBlur()
                                }}
                            >
                            </schmancy-input>
                        `
                    )}
                </slot>

                <!-- Options dropdown -->
                <ul
                    id="options"
                    class=${classMap({
                        'absolute': true,
                        'z-[1000]': true,
                        'mt-1': true,
                        'w-full': true,
                        'rounded-md': true,
                        'shadow-md': true,
                        'overflow-auto': true,
                        'min-w-full': true,
                        'bg-surface-low': true,
                        'flex': true,
                        'flex-col': true, // Enable flexbox for ordering
                    })}
                    role="listbox"
                    aria-multiselectable=${this.multi ? 'true' : 'false'}
                    aria-label=${`${this.label || 'Options'} dropdown`}
                    ?hidden=${!this._open}
                    style="max-height: ${this.maxHeight}; display: ${this._open ? 'flex' : 'none'};"
                    @slotchange=${() => {
                        this._setupOptionHandlers()
                    }}
                >
                    <slot></slot>
                    ${!this._hasResults ? html`
                        <li class="px-3 py-2 text-sm text-muted">No results found</li>
                    ` : ''}
                </ul>
            </div>
        `
    }

    private _handleAutoSelectOnBlur() {
        // Don't run if we're clicking on an option (prevents interference with click handler)
        if (this._isSelectingOption) {
            return
        }

        // Only auto-select in single-select mode and when dropdown is open with a search term
        if (this.multi || !this._open || !this._inputValue.trim()) {
            return
        }
        
        const searchTerm = this._inputValue.trim()
        
        // Find the best matching option using the same similarity logic as filtering
        let bestMatch: SchmancyOption | null = null
        let bestScore = 0
        
        this._options.forEach(option => {
            // Skip hidden options
            if (option.hidden) return
            
            // Get text to search in (prioritize label, then textContent, then value)
            const optionLabel = option.label || option.textContent || ''
            const optionValue = option.value
            
            // Calculate similarity scores for both label and value
            const labelScore = similarity(searchTerm, optionLabel)
            const valueScore = similarity(searchTerm, optionValue)
            
            // Use the higher score (prioritizing label matches)
            const score = Math.max(labelScore * 1.1, valueScore) // Slight boost for label matches
            
            // Keep track of best match that meets threshold
            if (score > bestScore && score >= this.similarityThreshold) {
                bestScore = score
                bestMatch = option
            }
        })
        
        // Auto-select the best match if found
        if (bestMatch) {
            // Select the option directly
            this._selectOption(bestMatch)

            // Close the dropdown
            this._open = false
        }
    }

    private _handleKeyDown(event: KeyboardEvent) {
        const isOpen = this._open
        const selectedValues = this._selectedValues$.value

        // Handle backspace to remove last chip in multi-select when input is empty
        if (this.multi && event.key === 'Backspace' && !this._inputValue && selectedValues.length > 0 && !isOpen) {
            event.preventDefault()
            const lastValue = selectedValues[selectedValues.length - 1]
            this.handleChipRemove(lastValue)
            return
        }

        if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
            event.preventDefault()
            this._open = true

            setTimeout(() => {
                const firstVisible = this._options.find(opt => !opt.hidden)
                firstVisible?.focus()
            }, 10)
            return
        }

        if (!isOpen) return

        const visibleOptions = this._options.filter(opt => !opt.hidden)
            .sort((a, b) => parseInt(a.style.order || '0') - parseInt(b.style.order || '0'))

        const focusedOption = visibleOptions.find(opt => opt === document.activeElement)
        const currentIndex = focusedOption ? visibleOptions.indexOf(focusedOption) : -1

        switch (event.key) {
            case 'Escape':
                event.preventDefault()
                this._open = false
                this._updateInputDisplay()
                this._inputElementRef.value?.focus()
                break

            case 'Tab':
                this._open = false
                this._updateInputDisplay()
                break

            case 'ArrowDown':
                event.preventDefault()
                const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0
                visibleOptions[nextIndex]?.focus()
                break

            case 'ArrowUp':
                event.preventDefault()
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1
                visibleOptions[prevIndex]?.focus()
                break

            case 'Home':
                event.preventDefault()
                visibleOptions[0]?.focus()
                break

            case 'End':
                event.preventDefault()
                visibleOptions[visibleOptions.length - 1]?.focus()
                break

            case 'Enter':
            case ' ':
                if (focusedOption) {
                    event.preventDefault()
                    this._selectOption(focusedOption)
                }
                break
        }
    }
}



declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete
    }
}