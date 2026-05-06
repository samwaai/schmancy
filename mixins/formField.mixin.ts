import { CSSResult, LitElement, PropertyValueMap } from 'lit'
import { property, state } from 'lit/decorators.js'
import { IBaseMixin } from './baseElement'
import { Constructor } from './constructor'
import { ITailwindElementMixin } from './tailwind.mixin'
import { SchmancyElement } from './SchmancyElement'

/**
 * Cross-realm brand used by `<schmancy-form>` to discover form fields by
 * inheritance rather than tag-name allowlists. `Symbol.for` puts the symbol in
 * the global registry so detection works across module realms/bundles.
 */
export const SCHMANCY_FORM_FIELD = Symbol.for('schmancy.form-field')

/**
 * Composed event a field dispatches in `connectedCallback`. `<schmancy-form>`
 * subscribes via `fromEvent(this, FIELD_CONNECT_EVENT)` and adds the field to
 * its registry. No matching disconnect event — composed events from a
 * disconnected node have an empty composed path; cleanup is via `isConnected`
 * filter at iteration time.
 */
export const FIELD_CONNECT_EVENT = 'schmancy:field:connect'

/** Validation modes. `dirty` is the default per the Revolute UX contract. */
export type ValidateOn = 'always' | 'touched' | 'dirty' | 'submitted'

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

	/** Set to `true` once the user has blurred the field at least once. */
	touched: boolean
	/** `true` when the current value differs from the captured default. */
	dirty: boolean
	/** Inverse of `dirty`. */
	pristine: boolean
	/** Set to `true` by `<schmancy-form>` on submit (forces error display). */
	submitted: boolean
	/** Validation mode — controls when errors display. Default `'dirty'`. */
	validateOn: ValidateOn

	/**
	 * `ElementInternals` instance attached by the mixin. Exposed so subclasses
	 * with non-standard validity semantics (date-range, multi-select) can
	 * surface platform `ValidityStateFlags` directly via
	 * `internals.setValidity({ valueMissing: true })` rather than rolling their
	 * own `attachInternals` call.
	 */
	internals: ElementInternals | undefined

	form: HTMLFormElement | null

	checkValidity(): boolean
	reportValidity(): boolean
	setCustomValidity(message: string): void

	/** Mark the field as touched (component should call on blur). */
	markTouched(): void
	/** Mark the field as submitted (called by `<schmancy-form>` on submit). */
	markSubmitted(): void
	/**
	 * Clear the `submitted` flag without resetting value/touched/error.
	 * Used by wizards: stepping back from step N to step N-1 should not
	 * leave step N-1's fields in aggressive "show all errors" mode.
	 */
	clearSubmitted(): void

	/**
	 * `true` while an async validator is in flight. Broadcast as
	 * `:state(validating)`. `<schmancy-form>` blocks submit until every
	 * registered field's `isValidating` is back to `false`.
	 */
	isValidating: boolean

	/**
	 * Run an async validator. While the promise is pending, `isValidating` is
	 * `true` and `:state(validating)` is broadcast. On resolve, the returned
	 * string is passed to `setCustomValidity` — empty string clears any
	 * existing custom error; non-empty marks the field invalid with that
	 * message.
	 *
	 * Submitting the form while a validator is pending is queued — the form
	 * waits for `Promise.all(pending validators)` to settle before proceeding.
	 */
	runAsyncValidator(fn: () => Promise<string>): Promise<void>

	/**
	 * Whether the gate for showing validation errors is open right now. Exposed
	 * so subclasses with custom error-display channels (e.g. select renders
	 * errors on a child input) can keep their gate consistent with the mixin's.
	 * Subclasses should not override this — extend the truth table by changing
	 * `validateOn` instead.
	 */
	_shouldShowError(): boolean

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

		// ----- Validation UX state (Revolute contract) -----

		/** True after the user has blurred the field at least once. */
		@state() touched: boolean = false

		/** Set by `<schmancy-form>` on submit; persists until `resetForm()`. */
		@state() submitted: boolean = false

		/**
		 * When errors display. Default `'dirty'` — the autofocus+cancel anti-pattern
		 * is avoided because pristine fields never show errors until submit.
		 */
		@property({ type: String, reflect: true })
		validateOn: ValidateOn = 'dirty'

		/** True when value has been changed from the captured default. */
		get dirty(): boolean {
			return this._defaultValue !== undefined && this.value !== this._defaultValue
		}

		get pristine(): boolean {
			return !this.dirty
		}

		markTouched(): void {
			if (!this.touched) this.touched = true
		}

		markSubmitted(): void {
			if (!this.submitted) this.submitted = true
		}

		clearSubmitted(): void {
			if (this.submitted) this.submitted = false
		}

		/**
		 * Reactive flag set while an async validator is in flight. Read by
		 * `<schmancy-form>` to gate submit; broadcast as `:state(validating)`
		 * for CSS spinner targeting.
		 */
		@state() isValidating: boolean = false

		async runAsyncValidator(fn: () => Promise<string>): Promise<void> {
			if (this.isValidating) {
				// Cancel-by-supersede semantics — a new call wins; the previous
				// is best-effort and its result is dropped if it resolves later.
				this._asyncValidatorEpoch++
			}
			const epoch = ++this._asyncValidatorEpoch
			this.isValidating = true
			try {
				const message = await fn()
				if (epoch !== this._asyncValidatorEpoch) return // superseded
				this.setCustomValidity(message)
			} finally {
				if (epoch === this._asyncValidatorEpoch) {
					this.isValidating = false
				}
			}
		}

		private _asyncValidatorEpoch: number = 0

		/**
		 * Whether `checkValidity()` should display errors right now.
		 * `submitted` overrides every mode — once a submit attempt happens, the
		 * field stays in live-correction mode (Phase 3) for the rest of the
		 * session, and `resetForm()` is the only way back. The leading
		 * underscore marks this as an internal API: subclasses may call it but
		 * should not override it (extend the truth table by changing
		 * `validateOn` instead).
		 */
		_shouldShowError(): boolean {
			if (this.submitted) return true
			switch (this.validateOn) {
				case 'always':
					return true
				case 'touched':
					return this.touched
				case 'dirty':
					return this.dirty
				case 'submitted':
					return false
			}
		}

		constructor(...args: any[]) {
			super(...args)
			try {
				this.internals = this.attachInternals()
			} catch {
				this.internals = undefined
			}
		}

		override connectedCallback(): void {
			super.connectedCallback()
			// Register with any ancestor <schmancy-form> via composed event.
			this.dispatchEvent(
				new CustomEvent(FIELD_CONNECT_EVENT, {
					detail: this,
					bubbles: true,
					composed: true,
				}),
			)
		}

		/** The form this element is associated with (native FACE behavior). */
		get form(): HTMLFormElement | null {
			return this.internals?.form ?? null
		}

		protected firstUpdated(changedProps: PropertyValueMap<any>): void {
			super.firstUpdated?.(changedProps)
			if (this._defaultValue === undefined) this._defaultValue = this.value
			// Sync platform validity (`internals.setValidity`) once after first
			// render so `<form>.checkValidity()` and `:invalid` reflect truth
			// even when no property change has fired through `willUpdate` yet
			// (e.g. for required-empty fields with class-field-initialized
			// defaults that Lit doesn't see as "changed" on the first cycle).
			this.checkValidity()
		}

		protected willUpdate(changedProps: PropertyValueMap<any>): void {
			super.willUpdate(changedProps)

			if (changedProps.has('value')) {
				this.internals?.setFormValue(this.value as string | File | FormData | null)
				// :state(dirty) tracks value-vs-default; recompute on every value change.
				if (this.dirty) this.internals?.states.add('dirty')
				else this.internals?.states.delete('dirty')
				// Always sync platform validity (internals.setValidity) so
				// `<form>.checkValidity()` and `:invalid` reflect truth, even
				// while the visual `error` gate stays closed for pristine
				// fields under `validateOn: 'dirty'`. The visibility gate is
				// inside checkValidity() itself.
				this.checkValidity()
			}

			if (changedProps.has('required') || changedProps.has('disabled')) {
				this.checkValidity()
			}

			if (changedProps.has('isValidating')) {
				if (this.isValidating) this.internals?.states.add('validating')
				else this.internals?.states.delete('validating')
			}

			if (changedProps.has('touched')) {
				if (this.touched) this.internals?.states.add('touched')
				else this.internals?.states.delete('touched')
				// Phase 2 — blur on a dirty field. Validate to surface the error.
				if (this.touched && this.dirty) this.checkValidity()
			}

			if (changedProps.has('submitted')) {
				if (this.submitted) {
					this.internals?.states.add('submitted')
					// Phase 4 — submit forces error display regardless of dirty/touched.
					this.checkValidity()
				} else {
					this.internals?.states.delete('submitted')
				}
			}

			// Note: we do not write to `internals.setValidity` from willUpdate
			// based on `error` / `validationMessage` changes. `checkValidity`
			// and `setCustomValidity` are the sole writers — overwriting the
			// validity flags from willUpdate would clobber structured flags
			// set by subclass overrides (e.g. input.ts surfaces typeMismatch /
			// patternMismatch / tooShort / etc.).

			if (changedProps.has('error')) {
				if (this.error) this.internals?.states.add('invalid')
				else this.internals?.states.delete('invalid')
				// ARIA reflection through ElementInternals reaches AT through shadow DOM.
				if (this.internals) this.internals.ariaInvalid = this.error ? 'true' : 'false'
			}

			if (changedProps.has('required') || changedProps.has('disabled')) {
				if (this.required) this.internals?.states.add('required')
				else this.internals?.states.delete('required')
				// Suppress aria-required when disabled — disabled fields shouldn't
				// announce as required to assistive tech.
				if (this.internals) {
					this.internals.ariaRequired = this.required && !this.disabled ? 'true' : 'false'
				}
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
			this.touched = false
			this.submitted = false
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
			if (this.disabled) {
				this.internals?.setValidity({})
				return true
			}

			const requiredFailed =
				this.required && (this.value === '' || this.value === undefined || this.value === null)
			// Custom errors set via setCustomValidity() are platform-truth too —
			// preserve them through re-validation cycles.
			const customErrorSet = !!this.internals?.validity?.customError
			const isValid = !requiredFailed && !customErrorSet
			const defaultMessage = requiredFailed ? 'This field is required' : 'Invalid value'

			// Platform validity (read by `form.checkValidity()` and `:invalid`)
			// is always set to the truth — independent of the visual gate.
			if (requiredFailed) {
				this.internals?.setValidity(
					{ valueMissing: true },
					this.validationMessage || defaultMessage,
				)
			} else if (!customErrorSet) {
				// No required failure, no custom error — clear flags.
				this.internals?.setValidity({})
			}
			// (customErrorSet branch falls through — leave the custom validity intact.)

			// Visual `error` flag is gated. The returned boolean tells the caller
			// the truth; only the in-component error display is suppressed for
			// pristine fields under `validateOn: 'dirty'`.
			if (this._shouldShowError()) {
				this.error = !isValid
				if (!isValid && !this.validationMessage) {
					this.validationMessage = defaultMessage
				} else if (isValid) {
					this.validationMessage = ''
				}
			}

			return isValid
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
 * A convenience function that composes FormFieldMixin with SchmancyElement
 * to create a base class for Schmancy form components. Subclasses gain the
 * full SchmancyElement stack (SignalWatcher, _activeHost wrap, AbortSignal,
 * automatic Tailwind injection) plus the form-field semantics.
 */
export function SchmancyFormField<T extends CSSResult>(componentStyle?: T) {
	class StyledSchmancyElement extends SchmancyElement {
		static styles = componentStyle ? [componentStyle] : []
	}
	return FormFieldMixin(StyledSchmancyElement) as unknown as Constructor<IFormFieldMixin> &
		Constructor<ITailwindElementMixin> &
		Constructor<LitElement> &
		Constructor<IBaseMixin>
}
