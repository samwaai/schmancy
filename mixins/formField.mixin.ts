import { CSSResult, LitElement, PropertyValueMap } from 'lit'
import { property } from 'lit/decorators.js'
import { IBaseMixin } from './baseElement'
import { Constructor } from './constructor'
import { ITailwindElementMixin, TailwindElement } from './tailwind.mixin'

/**
 * Cross-realm brand used by `<schmancy-form>` to discover form fields by
 * inheritance rather than tag-name allowlists. `Symbol.for` puts the symbol in
 * the global registry so detection works across module realms/bundles.
 */
export const SCHMANCY_FORM_FIELD = Symbol.for('schmancy.form-field')

/**
 * Interface defining the properties and methods that the FormFieldMixin adds.
 */
export interface IFormFieldMixin extends Element {
	name: string
	value: string | string[] | boolean | number | undefined
	label: string
	required: boolean
	disabled: boolean
	readonly: boolean
	error: boolean
	validationMessage: string
	hint?: string
	id: string

	form: HTMLFormElement | null

	checkValidity(): boolean
	reportValidity(): boolean
	setCustomValidity(message: string): void

	toFormEntries(): Array<[string, FormDataEntryValue]>
	resetForm(): void

	emitChange(detail: any): void
}

/** Predicate used by `<schmancy-form>` to detect mixin descendants. */
export function isSchmancyFormField(el: unknown): el is IFormFieldMixin {
	return !!el && typeof el === 'object' && (el as any).constructor?.[SCHMANCY_FORM_FIELD] === true
}

/**
 * A mixin that adds form field capabilities to a LitElement class.
 * Components that extend this mixin are automatically discovered and
 * collected by `<schmancy-form>` — no tag-name registration needed.
 *
 * Subclasses may override `toFormEntries()` to contribute multiple
 * name/value pairs to FormData (e.g. date-range, tag-input).
 *
 * @example
 * ```ts
 * class MyInput extends FormFieldMixin(TailwindElement(css`...`)) {
 *   // Your component code here
 * }
 * ```
 */
export function FormFieldMixin<T extends Constructor<LitElement>>(superClass: T) {
	class FormFieldMixinClass extends superClass {
		static formAssociated = true

		/** Brand for cross-realm detection by `<schmancy-form>`. */
		static readonly [SCHMANCY_FORM_FIELD] = true

		// Element internals for form association
		internals: ElementInternals | undefined

		/** Value snapshot captured at first render, used by `resetForm()`. */
		protected _defaultValue: string | string[] | boolean | number | undefined = undefined

		@property({ type: String })
		name: string = ''

		@property({ reflect: true })
		value: string | string[] | boolean | number | undefined = ''

		@property({ type: String })
		label: string = ''

		@property({ type: Boolean, reflect: true })
		required: boolean = false

		@property({ type: Boolean, reflect: true })
		disabled: boolean = false

		@property({ type: Boolean, reflect: true })
		readonly: boolean = false

		@property({ type: Boolean, reflect: true })
		error: boolean = false

		@property({ type: String })
		validationMessage: string = ''

		@property({ type: String })
		hint?: string

		@property({ reflect: true })
		override id: string = `schmancy-field-${Date.now()}-${Math.floor(Math.random() * 1000)}`

		constructor(...args: any[]) {
			super(...args)
			try {
				this.internals = this.attachInternals()
			} catch {
				this.internals = undefined
			}
		}

		/** The form this element is associated with (native FACE behavior). */
		get form(): HTMLFormElement | null {
			return this.internals?.form ?? null
		}

		protected firstUpdated(changedProps: PropertyValueMap<any>): void {
			super.firstUpdated?.(changedProps)
			if (this._defaultValue === undefined) this._defaultValue = this.value
		}

		protected willUpdate(changedProps: PropertyValueMap<any>): void {
			super.willUpdate(changedProps)

			if (changedProps.has('value')) {
				this.internals?.setFormValue(this.value as string | File | FormData | null)
			}

			if (changedProps.has('error') || changedProps.has('validationMessage')) {
				if (this.error && this.validationMessage) {
					this.internals?.setValidity({ customError: true }, this.validationMessage)
				} else {
					this.internals?.setValidity({})
				}
			}

			// Broadcast standard field states for consumer CSS: :state(invalid),
			// :state(required), :state(disabled), :state(readonly).
			if (changedProps.has('error')) {
				if (this.error) this.internals?.states.add('invalid')
				else this.internals?.states.delete('invalid')
			}
			if (changedProps.has('required')) {
				if (this.required) this.internals?.states.add('required')
				else this.internals?.states.delete('required')
			}
			if (changedProps.has('disabled')) {
				if (this.disabled) this.internals?.states.add('disabled')
				else this.internals?.states.delete('disabled')
			}
			if (changedProps.has('readonly')) {
				if (this.readonly) this.internals?.states.add('readonly')
				else this.internals?.states.delete('readonly')
			}
		}

		/**
		 * Native FACE lifecycle — called by the browser when the owning form
		 * is reset. Delegates to `resetForm()` so subclasses have one
		 * override point for both programmatic and user-initiated resets.
		 */
		formResetCallback(): void {
			this.resetForm()
		}

		/** Native FACE lifecycle — called when the form's disabled state changes. */
		formDisabledCallback(disabled: boolean): void {
			this.disabled = disabled
		}

		/**
		 * Native FACE lifecycle — restore value after bfcache / form autofill.
		 */
		formStateRestoreCallback(state: string | File | FormData | null): void {
			if (state == null) return
			this.value = state as any
		}

		/** Override to customize reset behavior; default restores `_defaultValue`. */
		resetForm(): void {
			this.value = this._defaultValue ?? ''
			this.error = false
			this.validationMessage = ''
			this.internals?.setValidity({})
		}

		/**
		 * Contribute entries to a parent FormData. Default: a single
		 * `[name, value]` pair when `name` is set and value is meaningful.
		 * Override for multi-entry controls (e.g. date range).
		 */
		toFormEntries(): Array<[string, FormDataEntryValue]> {
			if (!this.name || this.disabled) return []
			const v = this.value
			if (v === undefined || v === null || v === '') return []
			if (Array.isArray(v)) return v.map(item => [this.name, String(item)] as [string, FormDataEntryValue])
			if (typeof v === 'boolean') return v ? [[this.name, 'on']] : []
			return [[this.name, String(v)]]
		}

		checkValidity(): boolean {
			if (this.disabled) return true
			if (this.required && (this.value === '' || this.value === undefined || this.value === null)) {
				this.error = true
				this.validationMessage = 'This field is required'
				return false
			}
			return this.internals?.checkValidity() ?? true
		}

		reportValidity(): boolean {
			const isValid = this.checkValidity()
			if (!isValid) this.internals?.reportValidity()
			return isValid
		}

		setCustomValidity(message: string): void {
			this.validationMessage = message
			this.error = message !== ''
			if (message) {
				this.internals?.setValidity({ customError: true }, message)
			} else {
				this.internals?.setValidity({})
			}
		}

		emitChange(detail: any): void {
			if ('dispatchScopedEvent' in this && typeof this.dispatchScopedEvent === 'function') {
				this.dispatchScopedEvent('change', detail, { bubbles: true })
			} else {
				this.dispatchEvent(
					new CustomEvent('change', {
						detail,
						bubbles: true,
						composed: true,
					}),
				)
			}
		}
	}

	return FormFieldMixinClass as Constructor<IFormFieldMixin> & T
}

/**
 * A convenience function that composes FormFieldMixin with TailwindElement
 * to create a base class for Schmancy form components.
 */
export function SchmancyFormField<T extends CSSResult>(componentStyle?: T) {
	return FormFieldMixin(TailwindElement(componentStyle)) as Constructor<IFormFieldMixin> &
		Constructor<ITailwindElementMixin> &
		Constructor<LitElement> &
		Constructor<IBaseMixin>
}
