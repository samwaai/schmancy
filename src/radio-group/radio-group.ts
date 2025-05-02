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
	@property({ type: String }) value = ''
	@property({ type: Array }) options: SchmancyRadioGroupOption[] = []
	@property({ type: Boolean }) required: boolean = false
	private selection$ = new Subject<string>()

	connectedCallback() {
		super.connectedCallback()
		this.selection$.subscribe(value => {
			this.value = value
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value },
					bubbles: true,
				}),
			)
			// Update all child radio buttons
			this.updateChildRadioButtons()
		})
		
		// Listen for radio button clicks from children
		this.addEventListener('radio-button-click', ((e: CustomEvent) => {
			this.selection$.next(e.detail.value)
		}) as EventListener)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.selection$?.unsubscribe()
	}
	
	private handleSelection(value: string) {
		this.selection$.next(value)
	}
	
	private updateChildRadioButtons() {
		// Update child radio buttons checked state
		const radioButtons = this.querySelectorAll('schmancy-radio-button')
		radioButtons.forEach(button => {
			const buttonValue = button.getAttribute('value')
			if (buttonValue === this.value) {
				button.setAttribute('checked', '')
			} else {
				button.removeAttribute('checked')
			}
		})
	}
	
	// For backwards compatibility with direct option setting
	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)
		if (changedProperties.has('value')) {
			this.updateChildRadioButtons()
		}
	}

	render() {
		// Check if we have any slotted radio buttons
		const hasSlottedContent = this.childElementCount > 0
		
		return html`
			<div class="grid gap-4">
				${when(this.label, () => html` <label class="text-base font-semibold text-gray-900">${this.label}</label> `)}
				
				${hasSlottedContent ? 
					html`<slot></slot>` :
					this.options?.map(option => html`
						<div class="flex items-center">
							<input
								.required=${this.required}
								id=${option.value}
								class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
								type="radio"
								name=${this.name}
								.value=${option.value}
								.checked=${option.value === this.value}
								@change=${() => this.handleSelection(option.value)}
							/>
							<label for=${option.value} class="ml-3 block text-sm font-medium leading-6 text-gray-900">
								${option.label || option.value}
							</label>
						</div>
					`)
				}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-radio-group': RadioGroup
	}
}
