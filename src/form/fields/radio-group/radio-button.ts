import { SchmancyElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
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
export class RadioButton extends SchmancyElement {
	@property({ type: String }) value = ''
	@property({ type: Boolean, reflect: true }) checked = false
	@property({ type: Boolean }) disabled = false
	@property({ type: String }) name = ''

	connectedCallback() {
		super.connectedCallback()
		fromEvent<MouseEvent>(this, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(this._handleClick)
	}

	private _handleClick = () => {
		if (this.disabled) return
		this.dispatchEvent(new CustomEvent('radio-button-click', {
			detail: { value: this.value },
			bubbles: true,
			composed: true,
		}))
	}

	render() {
		return html`
			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="radio"
					class="h-4 w-4 text-primary-default focus:ring-primary-container border-outline"
					.value=${this.value}
					.checked=${this.checked}
					.disabled=${this.disabled}
					.name=${this.name}
					@change=${() => {}}
				/>
				<slot></slot>
			</label>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-radio-button': RadioButton
	}
}
