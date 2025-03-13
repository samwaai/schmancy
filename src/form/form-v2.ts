import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, merge, Subject, takeUntil, tap } from 'rxjs'

// Define interfaces for form element capabilities
export interface FormElement extends HTMLElement {
	name?: string
	value?: string
	disabled?: boolean
	type?: string
	defaultValue?: string
}

export interface CheckableFormElement extends FormElement {
	checked?: boolean
}

export interface ValidatableFormElement extends FormElement {
	reportValidity?: () => boolean
}

// Define interface for form control registry
export interface FormControlConfig {
	tagName: string
	hasValue?: boolean
	hasChecked?: boolean
	canSubmit?: boolean
}

/**
 * The form is a component used to collect user input from
 * interactive controls.
 *
 * @element sch-form
 *
 * @slot - Default slot for the form.
 *
 * @fires submit - Emitted when the form is submitted.
 * @fires reset - Emitted when the form is reset.
 */
@customElement('sch-form')
export default class SchmancyFormV2 extends TailwindElement() {
	private $disconnecting = new Subject()
	public static readonly tagName = 'sch-form'

	// Static registry of form controls
	private static formControlRegistry: FormControlConfig[] = [
		// Native elements
		{ tagName: 'input', hasValue: true, hasChecked: true, canSubmit: true },
		{ tagName: 'textarea', hasValue: true },
		{ tagName: 'select', hasValue: true },
		{ tagName: 'button', canSubmit: true },
		{ tagName: 'radio', hasChecked: true },

		// Custom elements
		{ tagName: 'schmancy-input', hasValue: true, canSubmit: true },
		{ tagName: 'schmancy-mask-input', hasValue: true },
		{ tagName: 'schmancy-button', canSubmit: true },
		{ tagName: 'schmancy-icon-button', canSubmit: true },
		{ tagName: 'schmancy-radio', hasChecked: true },
		{ tagName: 'schmancy-switch', hasChecked: true },
		{ tagName: 'schmancy-checkbox', hasValue: true, hasChecked: true },
		{ tagName: 'schmancy-radio-group', hasChecked: true },
		{ tagName: 'schmancy-autocomplete', hasValue: true, hasChecked: true },
		{ tagName: 'schmancy-select', hasValue: true, hasChecked: true },
		{ tagName: 'schmancy-combo', hasValue: true },
		{ tagName: 'schmancy-date-time-input', hasValue: true },
		{ tagName: 'schmancy-rating', hasValue: true },
	]

	// Static methods to register new form controls
	public static registerFormControl(config: FormControlConfig): void {
		const existingIndex = this.formControlRegistry.findIndex(item => item.tagName === config.tagName)

		if (existingIndex >= 0) {
			this.formControlRegistry[existingIndex] = {
				...this.formControlRegistry[existingIndex],
				...config,
			}
		} else {
			this.formControlRegistry.push(config)
		}
	}

	// Helper methods to check control capabilities
	private static hasValue(tagName: string): boolean {
		const config = this.formControlRegistry.find(item => item.tagName === tagName)
		return config?.hasValue || false
	}

	private static hasChecked(tagName: string): boolean {
		const config = this.formControlRegistry.find(item => item.tagName === tagName)
		return config?.hasChecked || false
	}

	private static canSubmit(tagName: string): boolean {
		const config = this.formControlRegistry.find(item => item.tagName === tagName)
		return config?.canSubmit || false
	}

	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open',
		delegatesFocus: false,
	}

	public static styles = css`
		:host {
			height: 100%;
			width: 100%;
			display: block;
		}
	`

	/** Specifies if form data validation should be skipped on submit.
	 * @attr novalidate
	 * @type {boolean}
	 * @public
	 */
	@property({ type: Boolean, reflect: true }) public novalidate = false

	constructor() {
		super()
		merge(
			fromEvent<MouseEvent>(this, 'click').pipe(
				tap(e => {
					const target = e.target as HTMLButtonElement
					if (target.type?.toLowerCase() === 'submit') {
						this.handleSubmitRequest(e)
					}
				}),
			),
			fromEvent<KeyboardEvent>(this, 'keydown').pipe(
				tap(e => {
					if (e.code === 'Enter' || e.key === 'Enter') {
						this.handleSubmitRequest(e)
					}
				}),
			),
		)
			.pipe(takeUntil(this.$disconnecting))
			.subscribe()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.$disconnecting.next(null)
		this.$disconnecting.complete()
	}

	/** Submits the form. */
	public submit(): boolean {
		const formData = this.getFormData()
		if (!this.novalidate && !this.reportValidity()) {
			return false
		}
		this.dispatchEvent(new CustomEvent('submit', { detail: formData }))
		return true
	}

	/** Resets the form. */
	public reset() {
		const formElements = this.getFormElements()
		formElements.forEach(element => {
			const tagName = element.tagName.toLowerCase()

			if (tagName === 'select') {
				const selectElement = element as HTMLSelectElement
				for (let i = 0; i < selectElement.options.length; i++) {
					const option = selectElement.options[i]
					option.selected = option.defaultSelected
				}
			} else if (
				(tagName === 'input' && (element.type === 'checkbox' || element.type === 'radio')) ||
				(tagName !== 'input' && SchmancyFormV2.hasChecked(tagName))
			) {
				;(element as CheckableFormElement).checked = element.hasAttribute('checked')
			} else if (
				tagName === 'schmancy-input' ||
				tagName === 'schmancy-rating' ||
				tagName === 'schmancy-mask-input' ||
				tagName === 'schmancy-date-time-input'
			) {
				element.value = element.getAttribute('value')
			} else if (SchmancyFormV2.hasValue(tagName)) {
				element.value = element.defaultValue
			}
		})
		this.dispatchEvent(new CustomEvent('reset'))
	}

	private getFormElements(): FormElement[] {
		const slot = this.shadowRoot?.querySelector('slot')
		const assignedElements = slot?.assignedElements({ flatten: true })
		const formElements: FormElement[] = []

		assignedElements?.forEach((element: FormElement) => {
			if (!element.disabled) {
				formElements.push(element)
			}

			const children = Array.from(element.getElementsByTagName('*')).filter(
				(childElement: FormElement) => !childElement.disabled,
			)
			formElements.push(...(children as FormElement[]))
		})

		return formElements
	}

	public getFormData() {
		const formData = new FormData()
		const formElements = this.getFormElements()

		formElements.forEach(element => {
			if (!element.name) return

			const tagName = element.tagName.toLowerCase()

			if (tagName === 'select') {
				for (let i = 0; i < (element as HTMLSelectElement).options.length; i++) {
					const option = (element as HTMLSelectElement).options[i]
					if (option.selected) {
						formData.append(element.name, option.value)
					}
				}
			} else if (SchmancyFormV2.hasChecked(tagName) && (element as CheckableFormElement).checked) {
				formData.append(element.name, element.value || 'on')
			} else if (
				SchmancyFormV2.hasValue(tagName) &&
				(element as HTMLInputElement).type !== 'checkbox' &&
				(element as HTMLInputElement).type !== 'radio' &&
				(element as HTMLInputElement).type !== 'submit'
			) {
				formData.append(element.name, element.value || '')
			}
		})

		return formData
	}

	/** Checks for validity of the form. */
	public reportValidity(): boolean {
		const formElements = this.getFormElements()
		return !formElements.some(
			element =>
				typeof (element as ValidatableFormElement).reportValidity === 'function' &&
				(element as ValidatableFormElement).reportValidity() === false,
		)
	}

	private handleSubmitRequest(event: MouseEvent | KeyboardEvent) {
		const targetElement = event.target as HTMLElement
		const tagName = targetElement.tagName.toLowerCase()

		if (SchmancyFormV2.canSubmit(tagName)) {
			this.submit()
		} else if ((targetElement as HTMLButtonElement).type?.toLowerCase() === 'reset') {
			this.reset()
		}

		return true
	}

	protected override render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-form': SchmancyFormV2
	}
}
