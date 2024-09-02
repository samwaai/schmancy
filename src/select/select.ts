import { color } from '@schmancy/directives'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
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
export default class SchmancySelect extends TailwindElement(style) {
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

	showOptions() {
		this.ul.style.display = 'block'
		this.overlay.removeAttribute('hidden')
		this.overlay.style.display = 'block'
	}

	hideOptions() {
		this.ul.setAttribute('hidden', 'true')
		this.ul.style.display = 'none'
		this.overlay.setAttribute('hidden', 'true')
		this.overlay.style.display = 'none'
		// animate(this.ul, {
		// 	opacity: 0,
		// 	duration: 100,
		// 	easing: 'easeOutQuad',
		// 	complete: () => {
		// 		this.ul.setAttribute('hidden', 'true')
		// 	},
		// })
	}

	render() {
		const classes = {
			'absolute z-30 top-[0px] mt-1 w-full overflow-auto rounded-md shadow-2': true,
		}
		const styles = {
			maxHeight: '25vh',
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
					style=${this.styleMap(styles)}
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
									<schmancy-button variant="filled"> save </schmancy-button>
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
