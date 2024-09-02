import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { color } from '@schmancy/directives'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement, eventOptions, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import style from './select.scss?inline'

export type SchmancySelectChangeEvent = CustomEvent<{
	value: string | string[]
}>

@customElement('schmancy-select')
export default class SchmancySelect extends $LitElement(style) {
	@property({ type: Boolean }) required = false
	@property({ type: String }) placeholder = 'Select an option'
	@property({ type: String, reflect: true }) value = ''
	@property({ type: Boolean }) multi = false
	@state() valueLabel = ''
	@query('ul') ul!: HTMLUListElement
	@query('#overlay') overlay!: HTMLElement
	@queryAssignedElements({ flatten: true }) options!: SchmancyOption[]

	firstUpdated() {
		this.updateDisplayLabel()
	}

	updateDisplayLabel() {
		if (this.multi) {
			const selectedOptions = this.options.filter(o => o.selected).map(o => o.label)
			this.valueLabel = selectedOptions.length > 0 ? selectedOptions.join(', ') : this.placeholder
		} else {
			const selectedOption = this.options.find(o => o.value === this.value)
			this.valueLabel = selectedOption ? selectedOption.label : this.placeholder
		}
	}

	@eventOptions({ passive: true })
	handleOptionClick(value: string) {
		if (this.multi) {
			const option = this.options.find(o => o.value === value)
			if (option) {
				option.selected = !option.selected
			}
			this.updateDisplayLabel()
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value: this.options.filter(o => o.selected).map(o => o.value) },
					bubbles: true,
					composed: true,
				}),
			)
		} else {
			this.value = value
			this.updateDisplayLabel()
			this.hideOptions()
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	async showOptions() {
		this.ul.removeAttribute('hidden')
		this.overlay.removeAttribute('hidden')
		this.overlay.style.display = 'block'

		// Position the dropdown using Floating UI
		const { x, y } = await computePosition(this.renderRoot.querySelector('div') as HTMLElement, this.ul, {
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
			maxHeight: '25vh', // Limit the height of the dropdown
			overflowY: 'auto', // Enable scrolling if the content is too tall
		})
	}

	hideOptions() {
		this.ul.setAttribute('hidden', 'true')
		this.overlay.setAttribute('hidden', 'true')
		this.overlay.style.display = 'none'
	}

	render() {
		const classes = {
			'absolute z-30 mt-1 w-full overflow-auto rounded-md shadow-2': true,
		}
		return html`
			<div class="relative">
				<div
					class="cursor-pointer bg-[${SchmancyTheme.sys.color.surface.container}] border border-[${SchmancyTheme.sys
						.color.outline}] rounded px-3 py-2"
					@click=${() => this.showOptions()}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
				>
					<span class="text-[${SchmancyTheme.sys.color.surface.on}]"> ${this.valueLabel} </span>
				</div>
				<div
					id="overlay"
					hidden
					class="fixed inset-0"
					@click=${(e: Event) => {
						e.stopPropagation()
						e.preventDefault()
						this.hideOptions()
					}}
					tabindex="-1"
				></div>
				<ul
					tabindex="-1"
					class=${this.classMap(classes)}
					id="options"
					role="listbox"
					hidden
					@click=${(e: Event) => this.handleOptionClick((e.target as SchmancyOption).value)}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
				>
					<slot @slotchange=${() => this.updateDisplayLabel()} tabindex="0"></slot>
					${when(
						this.multi,
						() => html`
							<li id="confirm" class="py-2" tabindex="-1">
								<schmancy-grid justify="center">
									<schmancy-button
										@click=${() => {
											this.hideOptions()
											this.dispatchEvent(
												new CustomEvent('change', {
													detail: { value: this.options.filter(o => o.selected).map(o => o.value) },
													bubbles: true,
													composed: true,
												}),
											)
										}}
										variant="filled"
									>
										save
									</schmancy-button>
								</schmancy-grid>
							</li>
						`,
					)}
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
