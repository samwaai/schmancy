import '@material/web/checkbox/checkbox.js'
import { TailwindElement } from '@mixins/index'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

export type schmancyCheckBoxChangeEvent = CustomEvent<{
	value: boolean
}>

/**
 * @element schmancy-checkbox
 * @slot - The label for the checkbox.
 * @fires valueChange - Event fired when the checkbox value changes.
 **/

@customElement('schmancy-checkbox')
class SchmancyCheckboxElement extends TailwindElement() {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}
	static formAssociated = true
	// private internals
	internals: ElementInternals | undefined
	get form() {
		return this.internals?.form
	}

	/**
	 * @attr {boolean} value - The value of the checkbox.
	 */
	@property({ type: Boolean, reflect: true })
	value = false

	/**
	 * @attr {boolean} checked - Alternative property for checkbox state (alias for value).
	 */
	@property({ type: Boolean })
	get checked() {
		return this.value
	}
	set checked(val: boolean) {
		this.value = val
	}

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
	 * @attr {string} label - The label text for the checkbox.
	 */
	@property({ type: String })
	label?: string

	connectedCallback() {
		super.connectedCallback()
	}

	/**
	 * @attr {sm | md | lg } size - The size of the checkbox.
	 */
	@property({ type: String })
	size: 'sm' | 'md' | 'lg' = 'md'

	render() {
		return html`
			<label class="grid grid-flow-col items-center space-x-2 w-fit">
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
				${when(this.label, 
					() => html`<span>${this.label}</span>`, 
					() => html`<slot></slot>`
				)}
			</label>
		`
	}
}

export { SchmancyCheckboxElement as SchmancyCheckbox }

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-checkbox': SchmancyCheckboxElement
	}
}
