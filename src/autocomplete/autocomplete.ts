import { computePosition, offset, shift, size } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import SchmancyInput from '@schmancy/input/input'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement, eventOptions, property, query, queryAssignedElements } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { from, fromEvent, Subject } from 'rxjs'
import { distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators'
import style from './autocomplete.scss?inline'

import type { SchmancyInputInputEvent } from '@schmancy/input/input'
import { similarity } from '@schmancy/utils/search'

export type SchmancyAutocompleteChangeEvent = CustomEvent<{
	value: string | string[]
}>

/**
 * The SchmancyAutocomplete component provides an accessible autocomplete field with keyboard navigation.
 * @element schmancy-autocomplete
 * @fires change - Emitted when a selection is made
 * @slot - Default slot for schmancy-option elements
 * @slot trigger - Optional slot to override the default input
 */
@customElement('schmancy-autocomplete')
export default class SchmancyAutocomplete extends $LitElement(style) {
	// Public API properties
	@property({ type: Boolean }) required = false
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true }) value = ''
	@property({ type: String, reflect: true }) label = ''
	@property({ type: String }) maxHeight = '25vh'
	@property({ type: Boolean }) multi = false

	/**
	 * Optional description for the autocomplete to improve accessibility.
	 * Will be associated with the input via aria-describedby.
	 */
	@property({ type: String }) description = ''

	/** Direct reference to the <input> inside <schmancy-input> */
	inputRef = createRef<HTMLInputElement>()

	// Query selectors for elements in the shadow DOM
	@query('#options') private optionsContainer!: HTMLUListElement
	@query('#empty') private empty!: HTMLLIElement
	@query('schmancy-input') private input!: SchmancyInput
	@queryAssignedElements({ flatten: true }) private options!: SchmancyOption[]

	// Subject for search term changes
	private readonly searchTerm$ = new Subject<string>()

	// Flag to track dropdown state
	@property({ type: Boolean, reflect: true }) private isOpen = false

	// iOS scroll-blocking logic
	private startY = 0

	// Store status message for screen readers
	private statusMessage = ''

	connectedCallback() {
		super.connectedCallback()

		// Ensure the component has an ID (used for generating option IDs)
		if (!this.id) {
			this.id = `schmancy-autocomplete-${Math.random().toString(36).substr(2, 9)}`
		}

		// Listen for keydown events on the input to enable keyboard navigation
		fromEvent(this, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe({
				next: (e: KeyboardEvent) => {
					this.handleKeyDown(e)
				},
			})

		// Search filtering logic
		this.searchTerm$
			.pipe(
				distinctUntilChanged(),
				tap(term => {
					const searchTerm = term.trim().toLowerCase()

					// Filter options using Levenshtein distance
					const matches = this.options
						.map(option => {
							const optionText = (option.label || option.textContent || '').toLowerCase()
							const score = similarity(searchTerm, optionText)
							return { option, score }
						})
						.filter(({ score }) => {
							// For short search terms, be lenient
							return score > 0.8
						})
						.sort((a, b) => a.score - b.score)

					// Show/hide options based on filtering
					this.options.forEach(o => (o.hidden = true))
					for (const { option } of matches) {
						option.hidden = false
					}

					// "No results found"
					this.empty.hidden = matches.length > 0

					// Update status message for screen readers
					this.statusMessage =
						matches.length > 0
							? `${matches.length} option${matches.length === 1 ? '' : 's'} available.`
							: 'No results found.'

					// Update the live region to announce the results
					const liveRegion = this.shadowRoot?.querySelector('#live-status')
					if (liveRegion) {
						liveRegion.textContent = this.statusMessage
					}

					// Update accessibility attributes on options
					this.setupOptionsAccessibility()

					this.requestUpdate()
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				// Show dropdown on each new search term
				this.showOptions()
			})

		// Focus-out animation (fade out)
		fromEvent<FocusEvent>(this, 'focusout')
			.pipe(
				takeUntil(this.disconnecting),
				filter(e => {
					// Don't close if focus moved to an option
					const relatedTarget = e.relatedTarget as Element
					return !this.contains(relatedTarget) && relatedTarget?.tagName !== 'SCHMANCY-OPTION'
				}),
				switchMap(() => {
					// reset options to show all
					this.options.forEach(o => (o.hidden = false))
					const animation = this.optionsContainer.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: 150,
						easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
					})
					return from(
						new Promise<void>(resolve => {
							animation.onfinish = () => {
								this.optionsContainer.style.display = 'none'
								this.optionsContainer.style.opacity = '1'
								this.isOpen = false
								resolve()
							}
						}),
					)
				}),
			)
			.subscribe({
				next: () => {
					// After closing, resync the input's value
					if (this.multi) {
						const selected = this.options.filter(o => o.selected).map(o => o.label)
						this.input.value = selected.join(', ')
					} else {
						this.input.value = this.options.find(o => o.value === this.value)?.label ?? ''
					}
				},
			})
	}

	firstUpdated() {
		this.updateInputValue()
	}

	protected updated(changedProps: Map<string | number | symbol, unknown>) {
		super.updated(changedProps)
		if (changedProps.has('value')) {
			this.syncSelectionFromValue()
			this.updateInputValue()
		}
	}

	/**
	 * When the <slot> changes (i.e. options are added/removed), update the following:
	 * 1. Show or hide the "No results found" option.
	 * 2. Sync the selection state.
	 * 3. Setup accessibility attributes on the options.
	 */
	private handleSlotChange() {
		this.empty.hidden = this.options.some(option => !option.hidden)
		this.syncSelectionFromValue()
		this.updateInputValue()
		this.setupOptionsAccessibility()
	}

	/**
	 * Loops through assigned options and sets accessibility attributes:
	 * - role="option"
	 * - A unique ID (if not already set)
	 * - tabindex="-1"
	 * - aria-selected (based on whether the option is selected)
	 */
	private setupOptionsAccessibility() {
		this.options.forEach((option, index) => {
			option.setAttribute('role', 'option')
			if (!option.id) {
				option.id = `${this.id}-option-${index}`
			}
			option.tabIndex = -1
			option.setAttribute('aria-selected', String(this.multi ? option.selected : option.value === this.value))
		})
	}

	private syncSelectionFromValue() {
		if (this.multi) {
			const values = this.value
				.split(',')
				.map(v => v.trim())
				.filter(Boolean)
			this.options.forEach(o => {
				o.selected = values.includes(o.value)
			})
		} else {
			this.options.forEach(o => {
				o.selected = o.value === this.value
			})
		}
	}

	private updateInputValue() {
		requestAnimationFrame(() => {
			if (this.multi) {
				const selected = this.options.filter(o => o.selected).map(o => o.label)
				this.input.value = selected.join(', ')
			} else {
				const found = this.options.find(o => o.value === this.value)?.label
				this.input.value = found ?? ''
			}
		})
	}

	/**
	 * MAIN: Show the dropdown. Uses Floating UI to position and size the options container.
	 */
	private async showOptions() {
		if (!this.optionsContainer) return

		this.optionsContainer.removeAttribute('hidden')
		this.optionsContainer.style.display = 'block'
		this.isOpen = true

		const { x, y } = await computePosition(this.input, this.optionsContainer, {
			placement: 'bottom-start',
			middleware: [
				offset(5),
				shift({ padding: 5 }),
				size({
					apply({ availableWidth, availableHeight, elements, rects }) {
						// At least match input width
						const referenceWidth = rects.reference.width
						elements.floating.style.minWidth = `${referenceWidth}px`
						// Cap to available viewport space
						elements.floating.style.maxWidth = `${availableWidth}px`
						elements.floating.style.maxHeight = `${availableHeight}px`
					},
				}),
			],
		})

		Object.assign(this.optionsContainer.style, {
			left: `${x}px`,
			top: `${y}px`,
			position: 'absolute',
			zIndex: '9999',
			overflowY: 'auto',
		})
	}

	private hideOptions() {
		this.optionsContainer?.setAttribute('hidden', 'true')
		if (this.optionsContainer) {
			this.optionsContainer.style.display = 'none'
		}
		this.isOpen = false

		// Announce that the dropdown is closed to screen readers
		const liveRegion = this.shadowRoot?.querySelector('#live-status')
		if (liveRegion) {
			liveRegion.textContent = 'Dropdown closed.'
		}
	}

	private handleInputChange(event: SchmancyInputInputEvent) {
		event.preventDefault()
		event.stopPropagation()
		const term = event.detail.value
		this.searchTerm$.next(term)
	}

	@eventOptions({ passive: true })
	private handleOptionClick(value: string) {
		if (this.multi) {
			const option = this.options.find(o => o.value === value)
			if (option) option.selected = !option.selected
			const selectedValues = this.options.filter(o => o.selected).map(o => o.value)
			this.value = selectedValues.join(',')
			this.updateInputValue()

			// Announce selection to screen readers
			const selectedLabels = this.options.filter(o => o.selected).map(o => o.label)
			const announcement = selectedLabels.length > 0 ? `Selected: ${selectedLabels.join(', ')}` : 'No options selected'

			const liveRegion = this.shadowRoot?.querySelector('#live-status')
			if (liveRegion) {
				liveRegion.textContent = announcement
			}

			this.dispatchEvent(
				new CustomEvent<SchmancyAutocompleteChangeEvent['detail']>('change', {
					detail: { value: selectedValues },
					bubbles: true,
					composed: true,
				}),
			)
		} else {
			const selectedOption = this.options.find(o => o.value === value)
			const selectedLabel = selectedOption?.label || ''

			this.hideOptions()
			this.value = value
			this.updateInputValue()

			// Announce selection to screen readers
			const liveRegion = this.shadowRoot?.querySelector('#live-status')
			if (liveRegion) {
				liveRegion.textContent = `Selected: ${selectedLabel}`
			}

			this.dispatchEvent(
				new CustomEvent<SchmancyAutocompleteChangeEvent['detail']>('change', {
					detail: { value },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	public checkValidity() {
		return this.multi ? this.options.some(o => o.selected) : Boolean(this.value)
	}

	public reportValidity() {
		return this.inputRef.value?.reportValidity()
	}

	private handleTouchStart(event: TouchEvent) {
		this.startY = event.touches?.[0]?.clientY ?? 0
	}

	private preventScroll(event: TouchEvent) {
		const target = event.target as HTMLElement
		if (!this.optionsContainer.contains(target)) return

		const scrollTop = this.optionsContainer.scrollTop
		const scrollHeight = this.optionsContainer.scrollHeight
		const offsetHeight = this.optionsContainer.offsetHeight
		const contentHeight = scrollHeight - offsetHeight

		const currentY = event.touches?.[0]?.clientY ?? 0
		if ((scrollTop <= 0 && currentY > this.startY) || (scrollTop >= contentHeight && currentY < this.startY)) {
			event.preventDefault()
		}
	}

	/**
	 * Keyboard navigation for the autocomplete.
	 * – When the dropdown is closed, ArrowDown (or Enter/Space) opens it.
	 * – When open, ArrowDown/ArrowUp move focus between options (which must have role="option").
	 * – Enter or Space selects the active option.
	 * – Escape (or Tab) hides the dropdown.
	 * - Home/End to navigate to first/last option
	 */
	private handleKeyDown = (e: KeyboardEvent) => {
		// Get the visible options (i.e. those not hidden)
		const options = this.options.filter(o => !o.hidden)

		// If the dropdown is closed, open it on Enter, Space, or ArrowDown
		if (!this.isOpen) {
			if (['Enter', 'ArrowDown'].includes(e.key)) {
				// Removed ' ' (space) here
				e.preventDefault()
				this.showOptions().then(() => {
					if (options.length > 0) {
						this.focusOption(options, 0)
					}
				})
			}
			return
		}

		// Dropdown is open; determine the currently focused option
		let currentIndex = options.findIndex(o => o.matches(':focus'))
		if (currentIndex === -1) {
			// If no option is focused, default to the first
			currentIndex = 0
		}

		switch (e.key) {
			case 'Escape':
				e.preventDefault()
				this.hideOptions()
				this.input.focus()
				break
			case 'ArrowDown':
				e.preventDefault()
				this.focusOption(options, Math.min(currentIndex + 1, options.length - 1))
				break
			case 'ArrowUp':
				e.preventDefault()
				this.focusOption(options, Math.max(currentIndex - 1, 0))
				break
			case 'Home':
				e.preventDefault()
				this.focusOption(options, 0)
				break
			case 'End':
				e.preventDefault()
				this.focusOption(options, options.length - 1)
				break
			case 'Enter': // Removed ' ' (space) case here
				e.preventDefault()
				if (options[currentIndex]) {
					const value = options[currentIndex].getAttribute('data-value') || options[currentIndex].getAttribute('value')
					if (value) {
						this.handleOptionClick(value)
					}
				}
				break
			case 'Tab':
				// Close the dropdown on Tab
				this.hideOptions()
				break
			default:
				// For letter key presses, find and focus the first option that starts with that letter
				if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
					const searchKey = e.key.toLowerCase()
					const matchIndex = options.findIndex(option =>
						(option.label || option.textContent || '').toLowerCase().startsWith(searchKey),
					)

					if (matchIndex !== -1) {
						e.preventDefault()
						this.focusOption(options, matchIndex)
					}
				}
				break
		}
	}

	/**
	 * Helper to focus an option by index and update the combobox's aria-activedescendant.
	 */
	private focusOption(options: HTMLElement[], index: number) {
		if (!options.length) return

		const option = options[index]
		if (option) {
			option.focus()
			// Update the input's aria-activedescendant to match the newly focused option
			this.input.setAttribute('aria-activedescendant', option.id)

			// Ensure the focused option is visible in the dropdown (scroll if needed)
			if (option.scrollIntoView) {
				option.scrollIntoView({ block: 'nearest' })
			}
		}
	}

	render() {
		// Create a unique ID for the description
		const descriptionId = `${this.id}-desc`

		return html`
			<div class="relative">
				<!-- Live region for screen reader announcements -->
				<div id="live-status" role="status" aria-live="polite" class="sr-only"></div>

				<!-- Optional description for the autocomplete -->
				${this.description ? html`<div id="${descriptionId}" class="sr-only">${this.description}</div>` : ''}

				<!-- The trigger slot (if any) overrides the default SchmancyInput -->
				<slot name="trigger">
					<schmancy-input
						${ref(this.inputRef)}
						id="input"
						class="w-full"
						.label=${this.label}
						.placeholder=${this.placeholder}
						.required=${this.required}
						type="search"
						inputmode="text"
						autocomplete="off"
						clickable
						role="combobox"
						aria-autocomplete="list"
						aria-haspopup="listbox"
						aria-controls="options"
						aria-expanded=${this.isOpen}
						aria-describedby=${this.description ? descriptionId : undefined}
						@focus=${() => this.showOptions()}
						@change=${this.handleInputChange}
					>
					</schmancy-input>
				</slot>

				<ul
					id="options"
					tabindex="-1"
					class="absolute z-30 mt-1 w-full overflow-auto rounded-md shadow-sm"
					role="listbox"
					aria-multiselectable=${this.multi ? 'true' : 'false'}
					aria-label=${`${this.label || 'Options'} dropdown`}
					hidden
					@click=${(e: Event) => {
						// Each <schmancy-option> should dispatch a CustomEvent('click', { detail: { value } })
						const detailVal = (e as CustomEvent).detail?.value
						if (detailVal) this.handleOptionClick(detailVal)
					}}
					@touchstart=${this.handleTouchStart}
					@touchmove=${this.preventScroll}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
					@slotchange=${this.handleSlotChange}
				>
					<!-- "No results" option -->
					<li id="empty" tabindex="-1" role="option" aria-disabled="true" class="p-2 text-center">
						<schmancy-typography type="label">No results found</schmancy-typography>
					</li>
					<!-- Slot for the <schmancy-option> elements -->
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
