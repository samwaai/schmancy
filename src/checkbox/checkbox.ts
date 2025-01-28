import '@material/web/checkbox/checkbox.js'
import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type schmancyCheckBoxChangeEvent = CustomEvent<{
	value: boolean
}>

/**
 * @element schmancy-checkbox
 * @slot - The label for the checkbox.
 * @fires valueChange - Event fired when the checkbox value changes.
 **/

@customElement('schmancy-checkbox')
export class SchmancyCheckbox extends TailwindElement() {
	/**
	 * @attr {boolean} value - The value of the checkbox.
	 */
	@property({ type: Boolean, reflect: true })
	value = false

	/**
	 * @attr {boolean} disabled - The disabled state of the checkbox.
	 */
	@property({ type: Boolean })
	disabled = false

	/**
	 * @attr {boolean} required - The required state of the checkbox.
	 */
	@property({ type: Boolean })
	required = false

	/**
	 * @attr {string} name - The name of the checkbox.
	 */
	@property({ type: String })
	name = 'checkbox-' + Math.random().toString(36)

	/**
	 * @attr {string} id - The id of the checkbox.
	 */
	@property({ type: String })
	id = 'checkbox-' + Math.random().toString(36)

	/**
	 * @attr {sm | md | lg } size - The size of the checkbox.
	 */
	@property({ type: String })
	size: 'sm' | 'md' | 'lg' = 'md'

	render() {
		return html`
			<label class="flex items-center space-x-2">
				<md-checkbox
					.required=${this.required}
					.disabled=${this.disabled}
					?checked=${this.value === true}
					@change=${(e: Event) => {
						this.value = (e.target as HTMLInputElement).checked
						this.dispatchEvent(
							new CustomEvent('change', {
								detail: {
									value: this.value,
								},
							}),
						)
					}}
				>
				</md-checkbox>
				<slot></slot>
			</label>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-checkbox': SchmancyCheckbox
	}
}
