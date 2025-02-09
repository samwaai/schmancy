import {
	computePosition,
	flip,
	offset,
	shift,
	size, // <-- NEW
} from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import SchmancyInput from '@schmancy/input/input'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { distance } from 'fastest-levenshtein'
import { html } from 'lit'
import { customElement, eventOptions, property, query, queryAssignedElements } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { from, fromEvent, Subject } from 'rxjs'
import { distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators'
import style from './autocomplete.scss?inline'

import type { SchmancyInputInputEvent } from '@schmancy/input/input'

export type SchmancyAutocompleteChangeEvent = CustomEvent<{
	value: string | string[]
}>

@customElement('schmancy-autocomplete')
export default class SchmancyAutocomplete extends $LitElement(style) {
	@property({ type: Boolean }) required = false
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true }) value = ''
	@property({ type: String, reflect: true }) label = ''

	/**
	 * ⚠️ If you still want an explicit fallback for maximum dropdown height,
	 * you can keep this, but the `size()` middleware will already set a
	 * dynamic max-height based on viewport space.
	 */
	@property({ type: String }) maxHeight = '25vh'

	@property({ type: Boolean }) multi = false

	/** Direct reference to the <input> inside <schmancy-input>. */
	inputRef = createRef<HTMLInputElement>()

	@query('#options') private optionsContainer!: HTMLUListElement
	@query('#empty') private empty!: HTMLLIElement
	@query('schmancy-input') private input!: SchmancyInput
	@queryAssignedElements({ flatten: true }) private options!: SchmancyOption[]

	private readonly searchTerm$ = new Subject<string>()

	// iOS scroll-blocking logic
	private startY = 0

	connectedCallback() {
		super.connectedCallback()

		// 1) Search filtering
		this.searchTerm$
			.pipe(
				takeUntil(this.disconnecting),
				distinctUntilChanged(),
				tap(term => {
					const searchTerm = term.trim().toLowerCase()

					// Filter options using Levenshtein distance
					const matches = this.options
						.map(option => {
							const optionText = option.label.toLowerCase()
							const levDistance = distance(searchTerm, optionText)
							return { option, levDistance }
						})
						.filter(({ option, levDistance }) => {
							// If very short searchTerm, be lenient
							if (searchTerm.length < 3) return true
							// Otherwise, filter by distance
							return levDistance <= option.label.toLowerCase().length - searchTerm.length
						})
						.sort((a, b) => a.levDistance - b.levDistance)

					// Show/hide
					this.options.forEach(o => (o.hidden = true))
					for (const { option } of matches) {
						option.hidden = false
					}

					// "No results found"
					this.empty.hidden = matches.length > 0

					this.requestUpdate()
				}),
			)
			.subscribe(() => {
				// Show dropdown on each new term
				this.showOptions()
			})

		// 2) Focus out animation
		fromEvent<FocusEvent>(this, 'focusout')
			.pipe(
				takeUntil(this.disconnecting),
				filter(e => (e.relatedTarget as SchmancyOption)?.tagName !== 'SCHMANCY-OPTION'),
				switchMap(() => {
					const animation = this.optionsContainer.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: 250,
						easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
					})

					return from(
						new Promise<void>(resolve => {
							animation.onfinish = () => {
								this.optionsContainer.style.display = 'none'
								this.optionsContainer.style.opacity = '1'
								resolve()
							}
						}),
					)
				}),
			)
			.subscribe({
				next: () => {
					// Resync the input after closing
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

	private handleSlotChange() {
		// If no visible options, show "empty"
		this.empty.hidden = this.options.some(option => !option.hidden)
		this.syncSelectionFromValue()
		this.updateInputValue()
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
	 * MAIN: Show the dropdown, using Floating UI to size it
	 * to the available space, and at least as wide as the input.
	 */
	private async showOptions() {
		this.optionsContainer.removeAttribute('hidden')
		this.optionsContainer.style.display = 'block'

		const { x, y } = await computePosition(this.input, this.optionsContainer, {
			placement: 'bottom-start',
			middleware: [
				offset(5),
				flip(),
				shift({ padding: 5 }),
				// NEW: Let the floating element fill available space,
				// but be at least as wide as the input.
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
			// The middleware is setting max-height, but if you want
			// a fallback you can still do:
			// maxHeight: this.maxHeight,
		})
	}

	private hideOptions() {
		this.optionsContainer?.setAttribute('hidden', 'true')
		if (this.optionsContainer) {
			this.optionsContainer.style.display = 'none'
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

	render() {
		const isOpen = !this.optionsContainer?.hasAttribute('hidden')

		return html`
			<div class="relative">
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
						aria-expanded=${isOpen}
						@focus=${() => this.showOptions()}
						@input=${this.handleInputChange}
					>
					</schmancy-input>
				</slot>

				<ul
					id="options"
					tabindex="-1"
					class="absolute z-30 mt-1 w-full overflow-auto rounded-md shadow-sm"
					role="listbox"
					hidden
					@click=${(e: Event) => {
						// Each <schmancy-option> dispatches CustomEvent('click', { detail: { value } })
						const detailVal = (e as CustomEvent).detail?.value
						if (detailVal) this.handleOptionClick(detailVal)
					}}
					@touchstart=${this.handleTouchStart}
					@touchmove=${this.preventScroll}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
				>
					<!-- "No results" option -->
					<li id="empty" tabindex="-1">
						<schmancy-typography type="label">No results found</schmancy-typography>
					</li>

					<!-- Slot for the <schmancy-option> elements -->
					<slot @slotchange=${this.handleSlotChange}> </slot>
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
