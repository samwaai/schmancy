import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { color } from '@schmancy/directives'
import { ref } from 'lit/directives/ref.js'
import SchmancyInput from '@schmancy/input/input'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import SchmancyOption, { SchmancyOptionChangeEvent } from '@schmancy/option/option'
import anime from 'animejs'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { BehaviorSubject, fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators'
import { SchmancyInputChangeEvent } from '..'
import style from './autocomplete.scss?inline'
import { createRef } from 'lit/directives/ref.js'

export type SchmancyAutocompleteChangeEvent = CustomEvent<{
	value: string
}>
@customElement('schmancy-autocomplete')
export class SchmancyAutocomplete extends TailwindElement(style) {
	@property({ type: Boolean }) required
	@property({ type: String }) placeholder = ''
	@property({ type: String, reflect: true }) value = ''
	@property({ type: String, reflect: true }) label = ''
	@state() valueLabel = ''
	inputRef = createRef<HTMLInputElement>()

	@query('ul') ul!: HTMLUListElement
	@query('#empty') empty!: HTMLLIElement
	@query('schmancy-input') input!: SchmancyInput
	searchTerm$ = new BehaviorSubject('')
	searchTermSubscription: any

	@queryAssignedElements({ flatten: true }) options!: SchmancyOption[]

	firstUpdated() {
		this.searchTermSubscription = this.searchTerm$
			.pipe(
				takeUntil(this.disconnecting),
				debounceTime(50),
				distinctUntilChanged(),
				tap(term => {
					const regex = new RegExp(term.trim(), 'i')
					this.empty.hidden = this.options
						.map(option => {
							option.hidden = !regex.test(option.innerText)
							return option
						})
						.some(option => !option.hidden)
				}),
			)
			.subscribe(() => {})

		fromEvent<FocusEvent>(this, 'focusout')
			.pipe(
				takeUntil(this.disconnecting),
				filter(e => (e.relatedTarget as SchmancyOption)?.tagName !== 'SCHMANCY-OPTION'),
			)
			.subscribe(() => {
				anime({
					targets: this.ul,
					opacity: 0,
					duration: 250,
					easing: 'cubicBezier(0.5, 0.01, 0.25, 1)',
					complete: () => {
						this.ul?.style.setProperty('display', 'none')
						this.ul?.style.setProperty('opacity', '1')
					},
				})
			})
		this.updateInputValue()
	}

	updateInputValue() {
		this.input.value = this.options.find(o => o.value === this.value)?.label ?? ''
	}

	handleInputChange(event: SchmancyInputChangeEvent) {
		event.preventDefault()
		event.stopPropagation()
		const term = event.detail.value
		this.searchTerm$.next(term)
	}

	handleOptionClick(value) {
		this.ul?.style.setProperty('display', 'none')
		this.value = value
		this.searchTerm$.next('')
		this.updateInputValue()
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value: value },
				bubbles: true,
				composed: true,
			}),
		)
	}

	/** Checks for validity of the control and shows the browser message if it's invalid. */
	public reportValidity() {
		return this.inputRef.value?.reportValidity()
	}

	/** Checks for validity of the control and emits the invalid event if it invalid. */
	public checkValidity() {
		return !!this.value
	}

	render() {
		return html`
			<div class="relative">
				<schmancy-input
					${ref(this.inputRef)}
					.required=${this.required}
					id="input"
					.label=${this.label}
					@focus=${() => {
						this.ul?.style.setProperty('display', 'block')
					}}
					type="search"
					inputmode="text"
					placeholder=${this.placeholder}
					@change=${this.handleInputChange}
					@reset=${() => {
						this.value = ''
						this.updateInputValue()
					}}
				>
				</schmancy-input>
				<ul
					tabindex="-1"
					class="absolute z-30 mt-1 max-h-auto w-full overflow-auto rounded-md shadow-2"
					id="options"
					role="listbox"
					hidden
					@click=${(e: SchmancyOptionChangeEvent) => {
						this.handleOptionClick(e.detail.value)
					}}
					${color({
						bgColor: SchmancyTheme.sys.color.surface.default,
					})}
				>
					<li
						id="empty"
						class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500
                hover:text-white hover:bg-indigo-600
                "
						tabindex="-1"
					>
						No results found
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
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-autocomplete': SchmancyAutocomplete
	}
}
