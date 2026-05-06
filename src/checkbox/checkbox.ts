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
	 * Boolean checked state. Test contract: `cb.value = true` flips the state.
	 * The FormData *string* is read from `true-value` attribute (or `'on'`
	 * default) — kept separate from `value` to keep the boolean-state ergonomic.
	 */
	@property({ type: Boolean, reflect: true })
	override value: boolean = false

	/** Alias for `value` for read-side ergonomics. */
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

	private get _trueValue(): string {
		return this.getAttribute('true-value') ?? 'on'
	}

	override willUpdate(changed: PropertyValues): void {
		super.willUpdate(changed)
		if (changed.has('value') || changed.has('name')) {
			this.internals?.setFormValue(this.value ? this._trueValue : null)
			if (this.value) this.internals?.states.add('checked')
			else this.internals?.states.delete('checked')
			this.checkValidity()
		}
		if (changed.has('required') || changed.has('disabled')) {
			this.checkValidity()
		}
	}

	/** Checkbox validity is `checked === true` when required. */
	override checkValidity(): boolean {
		if (this.disabled) {
			this.internals?.setValidity({})
			return true
		}
		const isValid = !this.required || this.value === true
		const message = isValid ? '' : 'Please check this box if you want to proceed.'

		this.internals?.setValidity(
			isValid ? {} : { valueMissing: true },
			isValid ? undefined : message,
		)

		if (this._shouldShowError()) {
			this.error = !isValid
			this.validationMessage = message
		}
		return isValid
	}

	/** Emit only when checked. */
	override toFormEntries(): Array<[string, FormDataEntryValue]> {
		if (!this.name || this.disabled || !this.value) return []
		return [[this.name, this._trueValue]]
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
