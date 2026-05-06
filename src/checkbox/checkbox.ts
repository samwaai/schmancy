import '@material/web/checkbox/checkbox.js'
import { html, LitElement, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { SchmancyFormField } from '@mixins/index'

export type schmancyCheckBoxChangeEvent = CustomEvent<{
	value: boolean
}>

/**
 * @element schmancy-checkbox
 * @slot - The label for the checkbox.
 * @fires change - Event fired when the checkbox value changes.
 */
@customElement('schmancy-checkbox')
class SchmancyCheckboxElement extends SchmancyFormField() {
	// Inner <md-checkbox> is the focusable surface; route host focus to it.
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}

	// FACE wiring (formAssociated, internals, attachInternals), `name`,
	// `disabled`, `required`, `id`, `label`, `error`, `validationMessage`,
	// `validateOn`, touched/dirty/submitted, markTouched/markSubmitted,
	// FIELD_CONNECT_EVENT dispatch — all from the mixin.

	/**
	 * Narrowed `value` — checkbox is boolean, not the mixin's wide union.
	 * @attr {boolean} value
	 */
	@property({ type: Boolean, reflect: true })
	override value: boolean = false

	/** Alias for `value` — common consumer-facing name. */
	@property({ type: Boolean })
	get checked(): boolean {
		return this.value
	}
	set checked(val: boolean) {
		this.value = val
	}

	/**
	 * M3-aligned sizes: 24dp (xxs) → 32dp (xs) → 40dp (sm) → 48dp (md) → 56dp (lg).
	 */
	@property({ type: String })
	size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' = 'md'

	override willUpdate(changed: PropertyValues): void {
		super.willUpdate(changed)
		if (changed.has('value') || changed.has('name')) {
			// FormData expects the value attribute (or 'on') for a checked box;
			// nothing for an unchecked one — overrides the mixin's default
			// scalar setFormValue call.
			this.internals?.setFormValue(this.value ? (this.getAttribute('true-value') ?? 'on') : null)
		}
		if (changed.has('value')) {
			if (this.value) this.internals?.states.add('checked')
			else this.internals?.states.delete('checked')
		}
	}

	/**
	 * Override — checkbox validity is `checked === true` when required, not the
	 * mixin's "non-empty value" semantics. Platform validity (`internals.setValidity`)
	 * is set unconditionally so `form.checkValidity()` and `:invalid` reflect
	 * the truth; the `_shouldShowError()` gate only controls whether the visual
	 * `this.error` flag flips (which drives the component's own UI).
	 */
	override checkValidity(): boolean {
		if (this.disabled) {
			this.internals?.setValidity({})
			return true
		}
		const isValid = !this.required || this.value === true
		const message = isValid ? '' : 'Please check this box if you want to proceed.'

		// Platform validity: always reflect the truth so native form aggregation works.
		this.internals?.setValidity(
			isValid ? {} : { valueMissing: true },
			isValid ? undefined : message,
		)

		// Visual error flag: only flip when the gate is open.
		if (this._shouldShowError()) {
			this.error = !isValid
			this.validationMessage = message
		}

		return isValid
	}

	/**
	 * Override — emit only when checked. An unchecked box contributes nothing
	 * to FormData (HTML form semantics).
	 */
	override toFormEntries(): Array<[string, FormDataEntryValue]> {
		if (!this.name || this.disabled || !this.value) return []
		return [[this.name, this.getAttribute('true-value') ?? 'on']]
	}

	render() {
		return html`
			<label class="grid grid-flow-col items-center space-x-2 w-fit">
				<md-checkbox
					.required=${this.required}
					.disabled=${this.disabled}
					?checked=${this.value === true}
					@change=${(e: Event) => {
						this.value = (e.target as HTMLInputElement).checked
						this.markTouched()
						this.emitChange({ value: this.value })
					}}
				>
				</md-checkbox>
				${when(
					this.label,
					() => html`<span>${this.label}</span>`,
					() => html`<slot></slot>`,
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
