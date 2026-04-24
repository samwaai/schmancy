import '@material/web/checkbox/checkbox.js'
import { TailwindElement } from '@mixins/index'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

export type schmancyCheckBoxChangeEvent = CustomEvent<{
	value: boolean
}>

/**
 * Binary checkbox for multi-select or boolean form fields. Wraps Material Web's `<md-checkbox>`; form-associated.
 *
 * @element schmancy-checkbox
 * @summary Use for "select many from a list" or any boolean that's part of a form submission. Prefer schmancy-switch for immediate-effect toggles.
 * @example
 * <schmancy-checkbox name="tos" required>I accept the terms</schmancy-checkbox>
 * @platform checkbox change - Wraps `<md-checkbox>` from `@material/web`. Degrades to styled native `<input type="checkbox">` if the tag never registers.
 * @slot - The label for the checkbox.
 * @fires valueChange - `CustomEvent<{ value: boolean }>` when the checkbox is toggled.
 **/

@customElement('schmancy-checkbox')
class SchmancyCheckboxElement extends TailwindElement() {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}
	static formAssociated = true
	internals: ElementInternals | undefined

	constructor() {
		super()
		try {
			this.internals = this.attachInternals()
		} catch {
			// attachInternals can throw if the element does not support form association
		}
	}

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
		this._syncFormValue()
	}

	updated(changed: Map<string, unknown>) {
		super.updated?.(changed)
		if (changed.has('value') || changed.has('name')) this._syncFormValue()
		if (changed.has('required') || changed.has('value')) this._syncValidity()
		if (changed.has('value')) {
			if (this.value) this.internals?.states.add('checked')
			else this.internals?.states.delete('checked')
		}
	}

	private _syncFormValue() {
		this.internals?.setFormValue(this.value ? (this.getAttribute('true-value') ?? 'on') : null)
	}

	private _syncValidity() {
		if (this.required && !this.value) {
			this.internals?.setValidity({ valueMissing: true }, 'Please check this box if you want to proceed.')
		} else {
			this.internals?.setValidity({})
		}
	}

	public checkValidity(): boolean {
		return this.internals?.checkValidity() ?? true
	}

	public reportValidity(): boolean {
		return this.internals?.reportValidity() ?? true
	}

	/**
	 * @attr {xxs | xs | sm | md | lg } size - The size of the checkbox.
	 * M3 aligned: 24dp (xxs) → 32dp (xs) → 40dp (sm) → 48dp (md) → 56dp (lg)
	 */
	@property({ type: String })
	size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' = 'md'

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
