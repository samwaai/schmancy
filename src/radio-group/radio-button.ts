import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-radio-button')
export class RadioButton extends TailwindElement() {
	@property({ type: String }) value = ''
	@property({ type: Boolean, reflect: true }) checked = false
	@property({ type: Boolean }) disabled = false
	@property({ type: String }) name = ''

	connectedCallback() {
		super.connectedCallback()
		// Find parent radio-group if exists
		this.addEventListener('click', this.handleClick)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.removeEventListener('click', this.handleClick)
	}

	private handleClick() {
		if (this.disabled) return

		// Find parent radio-group if exists
		const radioGroup = this.closest('schmancy-radio-group')
		if (radioGroup) {
			// Let the radio-group handle the change
			const event = new CustomEvent('radio-button-click', {
				detail: { value: this.value },
				bubbles: true,
				composed: true,
			})
			this.dispatchEvent(event)
		} else {
			// Standalone usage
			this.checked = true
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { value: this.value },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	render() {
		return html`
			<label class="relative flex items-start cursor-pointer">
				<div class="flex items-center h-6">
					<input
						type="radio"
						class="h-4 w-4 text-primary focus:ring-primary-light border-gray-300"
						.value=${this.value}
						.checked=${this.checked}
						.disabled=${this.disabled}
						.name=${this.name}
						@change=${() => {}}
					/>
				</div>
				<div class="ml-3">
					<slot name="label"></slot>
				</div>
			</label>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-radio-button': RadioButton
	}
}
