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
    combineLatest,
    EMPTY,
    fromEvent,
    of,
    Subject,
    timer
} from 'rxjs'
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    switchMap,
    take,
    takeUntil,
    tap,
    withLatestFrom
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
        if (this.multi) {
            this._selectedValues$.next(
                val ? val.split(',').map(v => v.trim()).filter(Boolean) : []
            )
        } else {
            this._selectedValue$.next(val)
        }
    }

    // State
    @state() private _open = false
    @state() private _inputValue = ''
    @state() private _visibleOptionsCount = 0
    @state() private _hasResults = true

    // DOM references
    @query('#options') _listbox!: HTMLUListElement
    @query('sch-input') _input!: SchmancyInput
    @queryAssignedElements({ flatten: true }) private _options!: SchmancyOption[]
    private _inputElementRef = createRef<HTMLInputElement>()

    // RxJS Subjects
    private _selectedValue$ = new BehaviorSubject<string>('')
    private _selectedValues$ = new BehaviorSubject<string[]>([])
    private _inputValue$ = new BehaviorSubject<string>('')
    private _open$ = new BehaviorSubject<boolean>(false)
    private _options$ = new BehaviorSubject<SchmancyOption[]>([])
    private _optionSelect$ = new Subject<SchmancyOption>()
    private _documentClick$ = new Subject<MouseEvent>()

    connectedCallback() {
        super.connectedCallback()
        
        if (!this.id) {
            this.id = `sch-autocomplete-${Math.random().toString(36).slice(2, 9)}`
        }

        this._setupAutocompleteLogic()
        this._setupDocumentClickHandler()
        // Complex autofill detection disabled - using simple auto-select on blur instead
        // this._setupAutofillDetection()
    }

    private _setupAutocompleteLogic() {
        // Options management pipeline
        this._options$.pipe(
            tap(options => {
                options.forEach((option, index) => {
                    option.setAttribute('role', 'option')
                    option.tabIndex = -1
                    if (!option.id) {
                        option.id = `${this.id}-option-${index}`
                    }
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
        ).subscribe()

        // Selection sync pipeline
        combineLatest([
            this._selectedValue$,
            this._selectedValues$,
            this._options$
        ]).pipe(
            tap(([selectedValue, selectedValues, options]) => {
                options.forEach(option => {
                    option.selected = this.multi 
                        ? selectedValues.includes(option.value)
                        : option.value === selectedValue
                    option.setAttribute('aria-selected', String(option.selected))
                })
            }),
            takeUntil(this.disconnecting)
        ).subscribe()

        // Enhanced fuzzy filtering pipeline
        this._inputValue$.pipe(
            distinctUntilChanged(),
            debounceTime(this.debounceMs),
            withLatestFrom(this._options$, this._open$),
            tap(([searchTerm, options, isOpen]) => {
                if (!isOpen) return

                const term = searchTerm.trim()
                
                if (!term) {
                    // Show all options if no search term
                    options.forEach(option => {
                        option.hidden = false
                        option.style.order = '0' // Reset order
                    })
                    this._visibleOptionsCount = options.length
                    this._hasResults = true
                } else {
                    // Calculate similarity scores for all options
                    const scoredOptions: FilteredOption[] = options.map(option => {
                        // Get text to search in (prioritize label, then textContent, then value)
                        const optionLabel = option.label || option.textContent || ''
                        const optionValue = option.value
                        
                        // Calculate similarity scores for both label and value
                        const labelScore = similarity(term, optionLabel)
                        const valueScore = similarity(term, optionValue)
                        
                        // Use the higher score (prioritizing label matches)
                        const score = Math.max(labelScore * 1.1, valueScore) // Slight boost for label matches
                        
                        return { option, score }
                    })
                    
                    // Sort by score (highest first)
                    scoredOptions.sort((a, b) => b.score - a.score)
                    
                    // Apply visibility and ordering
                    let visibleCount = 0
                    scoredOptions.forEach((item, index) => {
                        const { option, score } = item
                        
                        // Hide options below threshold
                        if (score < this.similarityThreshold) {
                            option.hidden = true
                        } else {
                            option.hidden = false
                            visibleCount++
                            // Use CSS order to sort visible options by relevance
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
            }),
            takeUntil(this.disconnecting)
        ).subscribe()

        // Option selection pipeline
        this._optionSelect$.pipe(
            withLatestFrom(this._selectedValue$, this._selectedValues$),
            tap(([option, _, currentValues]) => {
                if (this.multi) {
                    const index = currentValues.indexOf(option.value)
                    const newValues = index > -1
                        ? [...currentValues.slice(0, index), ...currentValues.slice(index + 1)]
                        : [...currentValues, option.value]
                    this._selectedValues$.next(newValues)

                    // Keep search input persistent - don't reset
                    // this._inputValue$.next('')
                    // this._inputValue = ''
                    
                    const labels = this._getSelectedLabels()
                    this._announceToScreenReader(
                        labels.length > 0 
                            ? `Selected: ${labels.join(', ')}`
                            : 'No options selected'
                    )
                } else {
                    this._selectedValue$.next(option.value)
                    this._open$.next(false)
                    this._open = false
                    
                    this._inputValue = option.label || option.textContent || ''
                    this._inputValue$.next(this._inputValue)
                    
                    timer(100).pipe(
                        tap(() => this._inputElementRef.value?.blur()),
                        take(1)
                    ).subscribe()
                    
                    this._announceToScreenReader(`Selected: ${option.label || option.textContent}`)
                }
            }),
            tap(() => this._fireChangeEvent()),
            takeUntil(this.disconnecting)
        ).subscribe()

        // Display update pipeline - only for single select
        combineLatest([
            this._open$,
            this._selectedValue$,
            this._options$
        ]).pipe(
            filter(() => !this._open$.value && !this.multi),
            tap(([, selectedValue, options]) => {
                const option = options.find(opt => opt.value === selectedValue)
                this._inputValue = option ? option.label || option.textContent || '' : ''
                this._inputValue$.next(this._inputValue)
            }),
            takeUntil(this.disconnecting)
        ).subscribe()

        // Open state sync
        this._open$.pipe(
            tap(open => this._open = open),
            takeUntil(this.disconnecting)
        ).subscribe()
    }

    private _setupDocumentClickHandler() {
        this._documentClick$.pipe(
            filter(e => !e.composedPath().includes(this)),
            filter(e => !this._options.some(opt => e.composedPath().includes(opt))),
            filter(() => this._open),
            tap(() => {
                this._open$.next(false)
                this._updateInputDisplay()
            }),
            takeUntil(this.disconnecting)
        ).subscribe()

        this._open$.pipe(
            distinctUntilChanged(),
            switchMap(open =>
                open
                    ? timer(10).pipe(
                        switchMap(() => fromEvent<MouseEvent>(document, 'click').pipe(
                            tap(e => this._documentClick$.next(e)),
                            takeUntil(this._open$.pipe(filter(isOpen => !isOpen)))
                        ))
                    )
                    : EMPTY
            ),
            takeUntil(this.disconnecting)
        ).subscribe()
    }


    private _updateInputDisplay() {
        // For multi-select, we don't update input display since chips show the selections
        if (this.multi) {
            return
        }

        of(null).pipe(
            withLatestFrom(
                this._selectedValue$,
                this._options$,
                this._open$
            ),
            tap(([, selectedValue, options, isOpen]) => {
                if (!this._inputElementRef.value) return

                if (!isOpen) {
                    const option = options.find(opt => opt.value === selectedValue)
                    this._inputValue = option ? option.label || option.textContent || '' : ''
                    this._inputValue$.next(this._inputValue)
                    this._inputElementRef.value.value = this._inputValue
                }
            }),
            take(1)
        ).subscribe()
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
        // Auto-selection now happens on blur, no need for autofill detection
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
                                        .name=${this.name || this.label?.toLowerCase().replace(/\s+/g, '-')}
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
                                            this._open$.next(true)
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
                                .name=${this.name || this.label?.toLowerCase().replace(/\s+/g, '-')}
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
                                    this._open$.next(true)
                                }}
                                @click=${(e: MouseEvent) => {
                                    e.stopPropagation()
                                    this._open$.next(true)
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
                        this._options$.next(this._options)
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
            // Select the option using the existing pipeline
            this._optionSelect$.next(bestMatch)
            
            // Close the dropdown
            this._open$.next(false)
            this._open = false
            
        }
    }

    private _handleKeyDown(_e: KeyboardEvent) {
        fromEvent<KeyboardEvent>(document, 'keydown').pipe(
            take(1),
            withLatestFrom(this._open$, this._options$, this._selectedValues$),
            tap(([event, isOpen, options, selectedValues]) => {
                // Handle backspace to remove last chip in multi-select when input is empty
                if (this.multi && event.key === 'Backspace' && !this._inputValue && selectedValues.length > 0 && !isOpen) {
                    event.preventDefault()
                    const lastValue = selectedValues[selectedValues.length - 1]
                    this.handleChipRemove(lastValue)
                    return
                }
                if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
                    event.preventDefault()
                    this._open$.next(true)
                    
                    timer(10).pipe(
                        tap(() => {
                            const firstVisible = options.find(opt => !opt.hidden)
                            firstVisible?.focus()
                        }),
                        take(1)
                    ).subscribe()
                    return
                }

                if (!isOpen) return

                const visibleOptions = options.filter(opt => !opt.hidden)
                    .sort((a, b) => parseInt(a.style.order || '0') - parseInt(b.style.order || '0'))
                
                const focusedOption = visibleOptions.find(opt => opt === document.activeElement)
                const currentIndex = focusedOption ? visibleOptions.indexOf(focusedOption) : -1

                switch (event.key) {
                    case 'Escape':
                        event.preventDefault()
                        this._open$.next(false)
                        this._updateInputDisplay()
                        this._inputElementRef.value?.focus()
                        break

                    case 'Tab':
                        this._open$.next(false)
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
                            this._optionSelect$.next(focusedOption)
                        }
                        break
                }
            })
        ).subscribe()
    }
}



declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete
    }
}