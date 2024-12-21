import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Subject } from 'rxjs'
import style from './radio-group.scss?inline'
import { TailwindElement } from '@mixins/index'
import { when } from 'lit/directives/when.js'

export type SchmancyRadioGroupOption = {
	label: string
	value: string
}
export type SchmancyRadioGroupChangeEvent = CustomEvent<{
	value: string
}>
@customElement('schmancy-radio-group')
export class RadioGroup extends TailwindElement(style) {
	@property({ type: String }) label = ''
	@property({ type: String }) name = ''
	@property({ type: String }) selected = ''
	@property({ type: Array }) options: SchmancyRadioGroupOption[] = []
	@property({ type: Boolean }) required: boolean = false
	private selection$ = new Subject<SchmancyRadioGroupOption>()

	connectedCallback() {
		super.connectedCallback()
		this.selection$.subscribe(value => {
			this.selected = value.value
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: value,
					bubbles: true,
				}),
			)
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.selection$?.unsubscribe()
	}
	private handleSelection(value: SchmancyRadioGroupOption) {
		this.selection$.next(value)
	}

	render() {
		return html`
			<div class="grid gap-4">
				${when(this.label, () => html` <label class="text-base font-semibold text-gray-900">${this.label}</label> `)}
				${this.options?.map(
					option => html`
						<div class="flex items-center">
							<input
								.required=${this.required}
								id=${option.value}
								class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
								type="radio"
								name=${this.name}
								.value=${option.value}
								.checked=${option.value === this.selected}
								@change=${() => this.handleSelection(option)}
							/>
							<label for=${option.value} class="ml-3 block text-sm font-medium leading-6 text-gray-900"
								>${option.value}</label
							>
						</div>
					`,
				)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-radio-group': RadioGroup
	}
}
