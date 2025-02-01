import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import SchmancyInput from '@schmancy/input/input'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { distance } from 'fastest-levenshtein'
import { html } from 'lit'
import { customElement, eventOptions, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { from, fromEvent, Subject } from 'rxjs'
import { distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators'
import type { SchmancyInputChangeEvent } from '..'
import style from './autocomplete.scss?inline'

export type SchmancyAutocompleteChangeEvent = CustomEvent<{
	value: string | string[]
}>

@customElement('schmancy-autocomplete')
export default class SchmancyAutocomplete extends $LitElement(style) {
	/**
	 * Whether input is required for form validity.
	 */
	@property({ type: Boolean }) required = false

	/**
	 * Placeholder text for the input.
	 */
	@property({ type: String }) placeholder = ''

	/**
	 * Programmatic value of the autocomplete. Setting this
	 * after the element is rendered will now update the display.
	 */
	@property({ type: String, reflect: true }) value = ''

	/**
	 * Label for the input (floating label or similar).
	 */
	@property({ type: String, reflect: true }) label = ''

	/**
	 * Max height of the dropdown options container.
	 */
	@property({ type: String }) maxHeight = '25vh'

	/**
	 * Whether multiple selections are allowed.
	 */
	@property({ type: Boolean }) multi = false

	/**
	 * A local property to store the *display* value (label text).
	 * This is separate from the raw `value`.
	 */
	@state() valueLabel = ''

	// Refs and queries
	inputRef = createRef<HTMLInputElement>()

	/**
	 * The main <ul> with id="options".
	 */
	@query('#options') optionsContainer!: HTMLUListElement

	/**
	 * The "no results found" <li> element.
	 */
	@query('#empty') empty!: HTMLLIElement

	/**
	 * The SchmancyInput element (your visible text input).
	 */
	@query('schmancy-input') input!: SchmancyInput

	/**
	 * All the <schmancy-option> children assigned via the default slot.
	 */
	@queryAssignedElements({ flatten: true })
	options!: SchmancyOption[]

	// Reactive search term stream
	private readonly searchTerm$ = new Subject<string>()

	connectedCallback() {
		super.connectedCallback()

		/**
		 * Whenever user types in the schmancy-input, we do
		 * fuzzy or distance-based filtering of the child <schmancy-option> elements.
		 */
		this.searchTerm$
			.pipe(
				takeUntil(this.disconnecting),
				distinctUntilChanged(),
				tap(term => {
					const searchTerm = term.trim().toLowerCase()

					// The "levenshtein-ish" filtering
					const matches = this.options
						.map(option => {
							const optionText = option.label.toLowerCase()
							const levDistance = distance(searchTerm, optionText)
							return { option, levDistance }
						})
						.filter(
							({ option, levDistance }) =>
								// if short searchTerm, be lenient
								searchTerm.length < 3 ||
								// otherwise, filter by distance
								levDistance <= option.label.toLowerCase().length - searchTerm.length,
						)
						// sort by ascending distance
						.sort((a, b) => a.levDistance - b.levDistance)

					// Show/hide appropriate options
					this.options.forEach(o => (o.hidden = true))
					for (const { option } of matches) {
						option.hidden = false
					}

					// Show/hide the "no results found" <li>
					this.empty.hidden = matches.length > 0

					this.requestUpdate()
				}),
			)
			.subscribe(() => {
				this.showOptions()
			})

		/**
		 * If the user focuses out of the entire component (and
		 * not just stepping from one <schmancy-option> to another),
		 * animate out the dropdown, then hide it.
		 */
		fromEvent<FocusEvent>(this, 'focusout')
			.pipe(
				takeUntil(this.disconnecting),
				// Make sure the newly focused element is *not* one of our <schmancy-option>s
				filter(e => (e.relatedTarget as SchmancyOption)?.tagName !== 'SCHMANCY-OPTION'),
				switchMap(() => {
					// Animate the <ul> out
					const animation = this.optionsContainer.animate(
						[
							{ opacity: 1 }, // from
							{ opacity: 0 }, // to
						],
						{
							duration: 250,
							easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
						},
					)

					// Convert onfinish to a Promise
					const animationPromise = new Promise<void>(resolve => {
						animation.onfinish = () => {
							this.optionsContainer.style.setProperty('display', 'none')
							this.optionsContainer.style.setProperty('opacity', '1')
							resolve()
						}
					})

					return from(animationPromise)
				}),
			)
			.subscribe({
				next: () => {
					// Once animation completes
					if (this.multi) {
						// Make sure the input displays the selected labels
						this.input.value = this.options
							.filter(o => o.selected)
							.map(o => o.label)
							.join(', ')
					} else {
						// Single
						this.input.value = this.options.find(o => o.value === this.value)?.label ?? ''
					}
				},
			})
	}

	/**
	 * firstUpdated (similar to componentDidMount in React).
	 * We can do an initial sync of the input's display text
	 * if a `value` was pre-set.
	 */
	firstUpdated() {
		this.updateInputValue()
	}

	/**
	 * This will be invoked *any time* a reactive property changes
	 * after the first render. We specifically check if `value` changed,
	 * so we can update the display text (and selected states) if needed.
	 */
	protected updated(changedProps: Map<string | number | symbol, unknown>) {
		super.updated(changedProps)

		if (changedProps.has('value')) {
			// If value changed, update the input display text + selected states
			this.syncSelectionFromValue()
			this.updateInputValue()
		}
	}

	/**
	 * If user assigned new <schmancy-option> children, or changed them,
	 * we also want to ensure the "no results" is correct and that
	 * our input text is still in sync.
	 */
	private handleSlotChange() {
		// Hide 'empty' if at least one option is visible
		this.empty.hidden = this.options.some(option => !option.hidden)
		// Also do a fresh fill of the input
		this.syncSelectionFromValue()
		this.updateInputValue()
	}

	/**
	 * For multi-select, ensure that any `value` strings
	 * are reflected in the child <schmancy-option>'s `selected` property.
	 * For single select, do similarly for the one matching option.
	 */
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

	/**
	 * Takes the current `value` (and child <schmancy-option>s) and updates
	 * the displayed text in the schmancy-input. Called whenever we need
	 * to re-sync the visible input text to the actual data.
	 */
	updateInputValue() {
		// We do this in a rAF to avoid any weird timing issues
		requestAnimationFrame(() => {
			if (this.multi) {
				const selectedOptions = this.options.filter(o => o.selected).map(o => o.label)
				this.input.value = selectedOptions.join(', ')
			} else {
				const found = this.options.find(o => o.value === this.value)?.label
				this.input.value = found ?? ''
			}
		})
	}

	/**
	 * Show the dropdown list, using Floating UI for positioning.
	 */
	async showOptions() {
		this.optionsContainer.removeAttribute('hidden')
		this.optionsContainer.style.setProperty('display', 'block')

		const { x, y } = await computePosition(this.input, this.optionsContainer, {
			placement: 'bottom-start',
			middleware: [offset(5), flip(), shift({ padding: 5 })],
		})

		Object.assign(this.optionsContainer.style, {
			left: `${x}px`,
			top: `${y}px`,
			position: 'absolute',
			zIndex: '9999',
			maxHeight: this.maxHeight,
			overflowY: 'auto',
		})
	}

	/**
	 * Hide the dropdown immediately (no animation).
	 */
	hideOptions() {
		this.optionsContainer?.setAttribute('hidden', 'true')
		this.optionsContainer?.style.setProperty('display', 'none')
	}

	/**
	 * Called whenever the user types in the schmancy-input.
	 */
	handleInputChange(event: SchmancyInputChangeEvent) {
		event.preventDefault()
		event.stopPropagation()
		const term = event.detail.value
		this.searchTerm$.next(term)
	}

	/**
	 * Called whenever user clicks or taps an <schmancy-option>.
	 */
	@eventOptions({ passive: true })
	handleOptionClick(value: string) {
		if (this.multi) {
			const option = this.options.find(o => o.value === value)
			if (option) {
				option.selected = !option.selected
			}
			// Rebuild the .value from the selected items
			const selectedValues = this.options.filter(o => o.selected).map(o => o.value)
			this.value = selectedValues.join(',')
			// Update display text, dispatch "change"
			this.updateInputValue()
			this.dispatchEvent(
				new CustomEvent<SchmancyAutocompleteChangeEvent['detail']>('change', {
					detail: { value: selectedValues },
					bubbles: true,
					composed: true,
				}),
			)
		} else {
			this.hideOptions()
			this.value = value
			this.updateInputValue()
			this.dispatchEvent(
				new CustomEvent<SchmancyAutocompleteChangeEvent['detail']>('change', {
					detail: { value },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	/**
	 * Check validity of the selected value(s) to satisfy forms.
	 */
	public checkValidity() {
		return this.multi ? this.options.some(o => o.selected) : !!this.value
	}

	/**
	 * Actually cause form validation checks if needed.
	 */
	public reportValidity() {
		return this.inputRef.value?.reportValidity()
	}

	/**
	 * Attempt to prevent iOS scrolling the background page
	 * while swiping within the options list.  (NB: This logic
	 * currently needs a bit more nuance to be robust.)
	 */
	private startY = 0

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

		// Current touch Y
		const currentY = event.touches?.[0]?.clientY ?? 0

		// If user is at top and swiping down, or at bottom and swiping up, block
		if ((scrollTop <= 0 && currentY > this.startY) || (scrollTop >= contentHeight && currentY < this.startY)) {
			event.preventDefault()
		}
	}

	render() {
		return html`
			<div class="relative">
				<!-- If there's no external trigger slot, fall back to a schmancy-input -->
				<slot name="trigger">
					<schmancy-input
						autocomplete="off"
						class="w-full"
						${ref(this.inputRef)}
						.required=${this.required}
						id="input"
						.label=${this.label}
						@focus=${this.showOptions}
						clickable
						type="search"
						inputmode="text"
						placeholder=${this.placeholder}
						@change=${this.handleInputChange}
					>
					</schmancy-input>
				</slot>

				<ul
					tabindex="-1"
					id="options"
					class="absolute z-30 mt-1 w-full overflow-auto rounded-md shadow-sm"
					style="max-height: ${this.maxHeight}"
					role="listbox"
					hidden
					@click=${(e: Event) => {
						// We rely on each <schmancy-option> dispatching a CustomEvent with detail.value
						// Or you can re-check e.target as <schmancy-option> and retrieve its value
						const detailVal = (e as CustomEvent).detail?.value
						if (detailVal) {
							this.handleOptionClick(detailVal)
						}
					}}
					@touchstart=${this.handleTouchStart}
					@touchmove=${this.preventScroll}
					${color({
						bgColor: SchmancyTheme.sys.color.surface.container,
					})}
				>
					<li id="empty" tabindex="-1">
						<schmancy-typography type="label">No results found</schmancy-typography>
					</li>

					<!-- Default slot with the <schmancy-option> elements -->
					<slot @slotchange=${this.handleSlotChange}></slot>
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
