import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { animate } from '@juliangarnierorg/anime-beta'
import { $LitElement } from '@mixins/lit'
import { color } from '@schmancy/directives'
import SchmancyInput from '@schmancy/input/input'
import SchmancyOption, { SchmancyOptionChangeEvent } from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { distance } from 'fastest-levenshtein'
import { html } from 'lit'
import { customElement, eventOptions, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { from, fromEvent, Subject } from 'rxjs'
import { distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators'
import { SchmancyInputChangeEvent } from '..'
import style from './autocomplete.scss?inline'

export type SchmancyAutocompleteChangeEvent = CustomEvent<{
	value: string | string[]
}>

@customElement('schmancy-autocomplete')
export default class SchmancyAutocomplete extends $LitElement(style) {
	@property({ type: Boolean }) required
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true }) value = ''
	@property({ type: String, reflect: true }) label = ''
	@property({ type: String }) maxHeight = '25vh'
	@property({ type: Boolean }) multi = false
	@state() valueLabel = ''
	inputRef = createRef<HTMLInputElement>()

	@query('ul') ul!: HTMLUListElement
	@query('#empty') empty!: HTMLLIElement
	@query('#options') optionsContainer!: HTMLUListElement
	@query('schmancy-input') input!: SchmancyInput
	searchTerm$ = new Subject<string>()
	searchTermSubscription: any

	@queryAssignedElements({ flatten: true }) options!: SchmancyOption[]

	firstUpdated() {
		this.searchTermSubscription = this.searchTerm$
			.pipe(
				takeUntil(this.disconnecting),
				// debounceTime(10),
				distinctUntilChanged(),
				tap(term => {
					const searchTerm = term.trim().toLowerCase()
					console.log(this.options)
					// Calculate Levenshtein distance for each option
					const matches = this.options
						.map(option => {
							const optionText = option.label.toLowerCase()
							const levDistance = distance(searchTerm, optionText.toLowerCase())
							return { option, levDistance }
						})
						// Filter out distant matches with a threshold (e.g., 3 or customizable)
						.filter(
							({ option, levDistance }) =>
								searchTerm.length < 3 || levDistance <= option.label.toLowerCase().length - searchTerm.length,
						)
						// Sort by closest match (smallest Levenshtein distance)
						.sort((a, b) => a.levDistance - b.levDistance)

					console.log('matches', matches)
					// Hide options that aren't close matches
					this.empty.hidden = matches
						.map(({ option }) => {
							option.hidden = false // Show matched options
							return option
						})
						.some(option => !option.hidden)

					// Hide unmatched options
					this.options.forEach(option => {
						if (!matches.some(match => match.option === option)) {
							option.hidden = true
						} else {
							option.hidden = false
						}
					})
					this.requestUpdate()
				}),
			)
			.subscribe(() => {
				this.showOptions()
			})

		fromEvent<FocusEvent>(this, 'focusout')
			.pipe(
				takeUntil(this.disconnecting),
				filter(e => (e.relatedTarget as SchmancyOption)?.tagName !== 'SCHMANCY-OPTION'),
				switchMap(() =>
					from(
						animate(this.ul, {
							opacity: 0,
							duration: 250,
							ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
							onComplete: () => {
								this.ul?.style.setProperty('display', 'none')
								this.ul?.style.setProperty('opacity', '1')
							},
						}),
					),
				),
			)
			.subscribe({
				next: () => {
					if (this.multi) {
						this.inputRef.value?.setAttribute(
							'value',
							this.options
								.filter(o => o.selected)
								.map(o => o.label)
								.join(', '),
						)
					} else {
						this.inputRef.value?.setAttribute('value', this.options.find(o => o.value === this.value)?.label ?? '')
					}
				},
			})
		this.updateInputValue()
	}

	updateInputValue() {
		requestAnimationFrame(() => {
			if (this.multi) {
				const selectedOptions = this.value.split(',').map(v => this.options.find(o => o.value === v)?.label)
				this.input.value = selectedOptions.join(', ')
			} else {
				this.input.value = this.options.find(o => o.value === this.value)?.label ?? ''
			}
		})
	}

	async showOptions() {
		this.ul?.removeAttribute('hidden')
		this.ul?.style.setProperty('display', 'block')

		// Position the dropdown using Floating UI
		const { x, y } = await computePosition(this.input, this.ul, {
			placement: 'bottom-start',
			middleware: [
				offset(5), // Adds a small gap between the input and the dropdown
				flip(), // Automatically flips the dropdown if there's not enough space
				shift({ padding: 5 }), // Adjusts the dropdown to stay within the viewport
			],
		})

		Object.assign(this.ul.style, {
			left: `${x}px`,
			top: `${y}px`,
			position: 'absolute',
			zIndex: '9999', // Ensure it's on top of other elements
			maxHeight: this.maxHeight, // Limit the height of the dropdown
			overflowY: 'auto', // Enable scrolling if the content is too tall
		})
	}

	hideOptions() {
		this.ul?.setAttribute('hidden', 'true')
		this.ul?.style.setProperty('display', 'none')
	}

	handleInputChange(event: SchmancyInputChangeEvent) {
		event.preventDefault()
		event.stopPropagation()
		const term = event.detail.value
		console.log('term', term)
		this.searchTerm$.next(term)
	}

	@eventOptions({ passive: true })
	handleOptionClick(value: string) {
		if (this.multi) {
			const option = this.options.find(o => o.value === value)
			if (option) {
				option.selected = !option.selected
			}
			this.updateInputValue()
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value: this.options.filter(o => o.selected).map(o => o.value) },
					bubbles: true,
					composed: true,
				}),
			)
		} else {
			this.hideOptions()
			this.value = value
			this.updateInputValue()
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value: value },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	/** Checks for validity of the control and shows the browser message if it's invalid. */
	public reportValidity() {
		return this.inputRef.value?.reportValidity()
	}

	/** Checks for validity of the control and emits the invalid event if it invalid. */
	public checkValidity() {
		return this.multi ? this.options.some(o => o.selected) : !!this.value
	}

	render() {
		const classes = {
			'absolute z-30 mt-1 w-full overflow-auto rounded-md shadow-2': true,
		}
		const styles = {
			maxHeight: this.maxHeight,
		}
		return html`
			<div class="relative">
				<slot name="trigger">
					<schmancy-input
						autocomplete=${'off'}
						class="w-full"
						${ref(this.inputRef)}
						.required=${this.required}
						id="input"
						.label=${this.label}
						@focus=${() => {
							this.showOptions()
						}}
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
					class=${this.classMap(classes)}
					style=${this.styleMap(styles)}
					id="options"
					role="listbox"
					hidden
					@click=${(e: SchmancyOptionChangeEvent) => {
						this.handleOptionClick(e.detail.value)
					}}
					@touchstart=${this.preventScroll}
					@touchmove=${this.preventScroll}
					${color({
						bgColor: SchmancyTheme.sys.color.surface.container,
					})}
				>
					<li id="empty" tabindex="-1">
						<schmancy-typography type="label">No results found</schmancy-typography>
					</li>
					<slot
						@slotchange=${() => {
							this.empty.hidden = this.options.some(option => !option.hidden)
							this.updateInputValue()
						}}
						tabindex="0"
					></slot>
				</ul>
			</div>
		`
	}

	preventScroll(event) {
		const target = event.target

		if (this.optionsContainer.contains(target)) {
			const scrollTop = this.optionsContainer.scrollTop
			const scrollHeight = this.optionsContainer.scrollHeight
			const offsetHeight = this.optionsContainer.offsetHeight
			const contentHeight = scrollHeight - offsetHeight

			if (
				(scrollTop === 0 && event.touches[0].clientY > event.touches[0].clientY) ||
				(scrollTop === contentHeight && event.touches[0].clientY < event.touches[0].clientY)
			) {
				event.preventDefault()
			}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-autocomplete': SchmancyAutocomplete
	}
}
