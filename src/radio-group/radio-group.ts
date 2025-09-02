import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Subject } from 'rxjs'
import style from './radio-group.scss?inline'
import { TailwindElement } from '@mixins/index'
import { when } from 'lit/directives/when.js'
import { FormFieldMixin } from '../../mixins/formField.mixin'

export type SchmancyRadioGroupOption = {
	label: string
	value: string
}
export type SchmancyRadioGroupChangeEvent = CustomEvent<{
	value: string
}>
@customElement('schmancy-radio-group')
export class RadioGroup extends FormFieldMixin(TailwindElement(style)) {
	@property({ type: String }) override label = ''
	@property({ type: String }) override name = ''
	@property({ type: String }) override value = ''
	@property({ type: Array }) options: SchmancyRadioGroupOption[] = []
	@property({ type: Boolean }) override required: boolean = false
	private selection$ = new Subject<string>()

	connectedCallback() {
		super.connectedCallback()
		this.selection$.subscribe(value => {
			this.value = value
			this.emitChange({ value })
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
				${when(this.label, () => html` <label class="text-base font-semibold text-surface-on">${this.label}</label> `)}
				
				${hasSlottedContent ? 
					html`<slot></slot>` :
					this.options?.map(option => html`
						<div class="flex items-center">
							<input
								.required=${this.required}
								id=${option.value}
								class="h-4 w-4 border-outline text-primary-default focus:ring-primary-default"
								type="radio"
								name=${this.name}
								.value=${option.value}
								.checked=${option.value === this.value}
								@change=${() => this.handleSelection(option.value)}
							/>
							<label for=${option.value} class="ml-3 block text-sm font-medium leading-6 text-surface-on">
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
