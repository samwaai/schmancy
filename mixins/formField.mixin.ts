import { CSSResult, LitElement, PropertyValueMap } from 'lit'
import { property } from 'lit/decorators.js'
import { IBaseMixin } from '../mixins/baseElement'
import { Constructor } from '../mixins/constructor'
import { ITailwindElementMixin, TailwindElement } from '../mixins/tailwind.mixin'

/**
 * Interface defining the properties and methods that the FormFieldMixin adds.
 */
export interface IFormFieldMixin extends Element {
	// Properties
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

	// Form association
	form: HTMLFormElement | null

	// Methods
	checkValidity(): boolean
	reportValidity(): boolean
	setCustomValidity(message: string): void

	// Event emitter helper
	emitChange(detail: any): void
}

/**
 * A mixin that adds form field capabilities to a LitElement class.
 * This provides common form field properties, validation, and form association.
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

		// Element internals for form association
		private internals: ElementInternals | undefined

		// Properties common to form fields
		/**
		 * The name of the form field (used for form submission)
		 */
		@property({ type: String })
		name: string = ''

		/**
		 * The current value of the form field
		 */
		@property({ reflect: true })
		value: string | string[] | boolean | number | undefined = ''

		/**
		 * Label text for the form field
		 */
		@property({ type: String })
		label: string = ''

		/**
		 * Whether the field is required
		 */
		@property({ type: Boolean, reflect: true })
		required: boolean = false

		/**
		 * Whether the field is disabled
		 */
		@property({ type: Boolean, reflect: true })
		disabled: boolean = false

		/**
		 * Whether the field is read-only
		 */
		@property({ type: Boolean, reflect: true })
		readonly: boolean = false

		/**
		 * Whether the field is in an error state
		 */
		@property({ type: Boolean, reflect: true })
		error: boolean = false

		/**
		 * The validation message to display
		 */
		@property({ type: String })
		validationMessage: string = ''

		/**
		 * Optional hint text to display below the field
		 */
		@property({ type: String })
		hint?: string

		/**
		 * Unique identifier for the field
		 */
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

		/**
		 * Gets the form this element is associated with
		 */
		get form(): HTMLFormElement | null {
			return this.internals?.form ?? null
		}

		/**
		 * Lifecycle method called when properties change
		 */
		protected willUpdate(changedProps: PropertyValueMap<any>): void {
			super.willUpdate(changedProps)

			// Update form value when value changes
			if (changedProps.has('value')) {
				this.internals?.setFormValue(this.value as string | File | FormData | null)
			}

			// Update validation state when error or validation message changes
			if (changedProps.has('error') || changedProps.has('validationMessage')) {
				if (this.error && this.validationMessage) {
					this.internals?.setValidity({ customError: true }, this.validationMessage)
				} else {
					this.internals?.setValidity({})
				}
			}
		}

		/**
		 * Checks if the field is valid without showing validation UI
		 */
		checkValidity(): boolean {
			if (this.disabled) return true

			if (this.required && (this.value === '' || this.value === undefined || this.value === null)) {
				this.error = true
				this.validationMessage = 'This field is required'
				return false
			}

			return true
		}

		/**
		 * Reports validity and shows validation UI if invalid
		 */
		reportValidity(): boolean {
			const isValid = this.checkValidity()
			if (!isValid) {
				this.internals?.reportValidity()
			}
			return isValid
		}

		/**
		 * Sets a custom validation message
		 */
		setCustomValidity(message: string): void {
			this.validationMessage = message
			this.error = message !== ''
			if (message) {
				this.internals?.setValidity({ customError: true }, message)
			} else {
				this.internals?.setValidity({})
			}
		}

		/**
		 * Helper method to emit change events
		 */
		emitChange(detail: any): void {
			this.dispatchEvent(
				new CustomEvent('change', {
					detail,
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	return FormFieldMixinClass as Constructor<IFormFieldMixin> & T
}

/**
 * A convenience function that composes FormFieldMixin with TailwindElement
 * to create a base class for Schmancy form components.
 *
 * @example
 * ```ts
 * class MyInput extends SchmancyFormField(css`...`) {
 *   // Your component code here
 * }
 * ```
 */
export function SchmancyFormField<T extends CSSResult>(componentStyle?: T) {
	return FormFieldMixin(TailwindElement(componentStyle)) as Constructor<IFormFieldMixin> &
		Constructor<ITailwindElementMixin> &
		Constructor<LitElement> &
		Constructor<IBaseMixin>
}
