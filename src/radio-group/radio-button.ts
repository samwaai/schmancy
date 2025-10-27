import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FormFieldMixin } from '../../mixins/formField.mixin'
import { fromEvent, takeUntil } from 'rxjs'

/**
 * Radio button component for use within radio groups.
 *
 * @prop {string} name - Name attribute for grouping radio buttons
 * @prop {string} value - Value of this radio button
 * @prop {boolean} checked - Whether the radio button is selected
 * @prop {boolean} disabled - Whether the radio button is disabled
 */
@customElement('schmancy-radio-button')
export class RadioButton extends FormFieldMixin(TailwindElement()) {
	@property({ type: String }) override value = ''
	@property({ type: Boolean, reflect: true }) checked = false
	@property({ type: Boolean }) override disabled = false
	@property({ type: String }) override name = ''

	connectedCallback() {
		super.connectedCallback()
		// Listen for click events
		fromEvent<MouseEvent>(this, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(this.handleClick)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Event listeners are automatically cleaned up via takeUntil(this.disconnecting)
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
			this.emitChange({ value: this.value })
		}
	}

	render() {
		return html`
			<label class="relative flex items-start cursor-pointer">
				<div class="flex items-center h-6">
					<input
						type="radio"
						class="h-4 w-4 text-primary-default focus:ring-primary-container border-outline"
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
