import { $LitElement } from '@mixins/index'
import { InputSize } from '@schmancy/input'
import SchmancyInputV2 from '@schmancy/input/input-v2'
import SchmancyOption from '@schmancy/option/option'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import {
    BehaviorSubject,
    combineLatest,
    EMPTY,
    fromEvent,
    merge,
    Observable,
    of,
    Subject,
    timer,
} from 'rxjs'
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    share,
    startWith,
    switchMap,
    take,
    takeUntil,
    tap,
    withLatestFrom,
} from 'rxjs/operators'
import style from './autocomplete.scss?inline'

// Import the similarity function (or include it inline)
import { similarity } from '../utils/search'

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
    @property({ type: String }) autocomplete = 'on'
    @property({ type: Number }) debounceMs = 200
    @property({ type: Number }) similarityThreshold = 0.3 // Minimum similarity score to show option

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
    @query('sch-input') _input!: SchmancyInputV2
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
    private _autofillDetected$ = new Subject<string>()
    private _checkAutofill$ = new Subject<void>()

    connectedCallback() {
        super.connectedCallback()
        
        if (!this.id) {
            this.id = `sch-autocomplete-${Math.random().toString(36).slice(2, 9)}`
        }

        this._setupAutocompleteLogic()
        this._setupDocumentClickHandler()
        this._setupAutofillDetection()
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
                        fromEvent(option, 'click').pipe(
                            tap(e => e.stopPropagation()),
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
            tap(([option, currentValue, currentValues]) => {
                if (this.multi) {
                    const index = currentValues.indexOf(option.value)
                    const newValues = index > -1
                        ? [...currentValues.slice(0, index), ...currentValues.slice(index + 1)]
                        : [...currentValues, option.value]
                    this._selectedValues$.next(newValues)
                    
                    this._inputValue$.next('')
                    this._inputValue = ''
                    
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

        // Display update pipeline
        combineLatest([
            this._open$,
            this._selectedValue$,
            this._selectedValues$,
            this._options$
        ]).pipe(
            filter(() => !this._open$.value),
            tap(([, selectedValue, selectedValues, options]) => {
                if (this.multi) {
                    const labels = options
                        .filter(opt => selectedValues.includes(opt.value))
                        .map(opt => opt.label || opt.textContent || '')
                    this._inputValue = labels.join(', ')
                } else {
                    const option = options.find(opt => opt.value === selectedValue)
                    this._inputValue = option ? option.label || option.textContent || '' : ''
                }
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
                        tap(() => document.addEventListener('click', e => this._documentClick$.next(e))),
                        switchMap(() => EMPTY)
                    )
                    : of(null).pipe(
                        tap(() => document.removeEventListener('click', e => this._documentClick$.next(e)))
                    )
            ),
            takeUntil(this.disconnecting)
        ).subscribe()
    }

    private _setupAutofillDetection() {
        // Enhanced autofill detection with fuzzy matching
        merge(
            timer(100, 500).pipe(take(10)),
            this._checkAutofill$,
            timer(100).pipe(
                switchMap(() => 
                    fromEvent(window, 'load').pipe(startWith(null))
                )
            )
        ).pipe(
            map(() => {
                const schInput = this._inputElementRef.value
                if (!schInput) return null
                return schInput.shadowRoot?.querySelector('input') || 
                       schInput.querySelector('input') ||
                       (schInput as any)._inputRef?.value
            }),
            filter(input => !!input),
            map(input => (input as HTMLInputElement).value),
            filter(value => !!value && value.trim().length > 0),
            distinctUntilChanged(),
            withLatestFrom(this._options$),
            tap(([autofilledValue, options]) => {
                console.log('Autofill detected:', autofilledValue)
                
                // Use fuzzy matching to find best matching option
                let bestMatch: SchmancyOption | null = null
                let bestScore = 0
                
                options.forEach(option => {
                    const optionLabel = option.label || option.textContent || ''
                    const optionValue = option.value
                    
                    // Calculate similarity scores
                    const labelScore = similarity(autofilledValue, optionLabel)
                    const valueScore = similarity(autofilledValue, optionValue)
                    
                    // Use the higher score
                    const score = Math.max(labelScore, valueScore)
                    
                    // Keep track of best match
                    if (score > bestScore && score >= this.similarityThreshold) {
                        bestScore = score
                        bestMatch = option
                    }
                })

                if (bestMatch) {
                    console.log('Found matching option:', bestMatch.value, 'with score:', bestScore)
                    
                    // Select the option
                    if (this.multi) {
                        this._selectedValues$.next([bestMatch.value])
                    } else {
                        this._selectedValue$.next(bestMatch.value)
                    }
                    
                    // Update input to show the label
                    const displayValue = bestMatch.label || bestMatch.textContent || ''
                    this._inputValue = displayValue
                    this._inputValue$.next(displayValue)
                    
                    // Update the actual input element
                    const input = this._inputElementRef.value
                    if (input) {
                        input.value = displayValue
                    }
                    
                    // Close dropdown if open
                    this._open$.next(false)
                    
                    // Fire change event
                    this._fireChangeEvent()
                    
                    // Announce to screen reader
                    this._announceToScreenReader(`Autofilled: ${displayValue}`)
                }
            }),
            takeUntil(this.disconnecting)
        ).subscribe()

        // Chrome autofill animation detection
        timer(100).pipe(
            map(() => {
                const schInput = this._inputElementRef.value
                if (!schInput) return null
                return schInput.shadowRoot?.querySelector('input') || 
                       schInput.querySelector('input') ||
                       (schInput as any)._inputRef?.value
            }),
            filter(input => !!input),
            switchMap(input => {
                return fromEvent<AnimationEvent>(input!, 'animationstart').pipe(
                    filter(e => e.animationName === 'onAutoFillStart'),
                    tap(() => {
                        console.log('Chrome autofill animation detected')
                        timer(100).pipe(
                            tap(() => this._checkAutofill$.next()),
                            take(1)
                        ).subscribe()
                    })
                )
            }),
            takeUntil(this.disconnecting)
        ).subscribe()
    }

    private _updateInputDisplay() {
        of(null).pipe(
            withLatestFrom(
                this._selectedValue$,
                this._selectedValues$,
                this._options$,
                this._open$
            ),
            tap(([, selectedValue, selectedValues, options, isOpen]) => {
                if (!this._inputElementRef.value) return

                if (!isOpen || !this.multi) {
                    if (this.multi) {
                        const labels = options
                            .filter(opt => selectedValues.includes(opt.value))
                            .map(opt => opt.label || opt.textContent || '')
                        this._inputValue = labels.join(', ')
                    } else {
                        const option = options.find(opt => opt.value === selectedValue)
                        this._inputValue = option ? option.label || option.textContent || '' : ''
                    }
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
        timer(200).pipe(
            tap(() => this._checkAutofill$.next()),
            take(1)
        ).subscribe()
        
        this._options$.pipe(
            filter(options => options.length > 0),
            tap(() => this._checkAutofill$.next()),
            takeUntil(this.disconnecting)
        ).subscribe()
    }

    render() {
        const descriptionId = `${this.id}-desc`

        return html`
            <div class="relative">
                <!-- Screen reader live region -->
                <div id="live-status" role="status" aria-live="polite" class="sr-only"></div>

                <!-- Description -->
                ${this.description ? html`<div id="${descriptionId}" class="sr-only">${this.description}</div>` : ''}

                <!-- Input -->
                <slot name="trigger">
                    <sch-input
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
                            
                            const hasSelection = this.multi 
                                ? this._selectedValues$.value.length > 0
                                : !!this._selectedValue$.value
                            
                            if (this.multi && !hasSelection) {
                                this._inputValue = ''
                                this._inputValue$.next('')
                                if (this._inputElementRef.value) {
                                    this._inputElementRef.value.value = ''
                                }
                            }
                            
                            this._open$.next(true)
                        }}
                        @click=${(e: MouseEvent) => {
                            e.stopPropagation()
                            this._open$.next(true)
                        }}
                        @keydown=${(e: KeyboardEvent) => {
                            this._handleKeyDown(e)
                        }}
                    >
                    </sch-input>
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
                        timer(100).pipe(
                            tap(() => this._checkAutofill$.next()),
                            take(1)
                        ).subscribe()
                    }}
                >
                    <slot></slot>
                    ${!this._hasResults ? html`
                        <li class="px-3 py-2 text-sm text-muted">No results found</li>
                    ` : ''}
                </ul>
            </div>

            <style>
                :host {
                    display: block;
                }

                @keyframes onAutoFillStart {
                    from {/**/}
                    to {/**/}
                }

                sch-input::part(input):-webkit-autofill,
                sch-input input:-webkit-autofill {
                    animation-name: onAutoFillStart;
                    animation-duration: 1ms;
                }
            </style>
        `
    }

    private _handleKeyDown(e: KeyboardEvent) {
        fromEvent<KeyboardEvent>(document, 'keydown').pipe(
            take(1),
            withLatestFrom(this._open$, this._options$),
            tap(([event, isOpen, options]) => {
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