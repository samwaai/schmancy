import { TailwindElement } from '@mixins/index'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, merge, Subject, takeUntil, tap } from 'rxjs'

export interface FormEventMap {
	submit: CustomEvent<FormData>
	reset: CustomEvent
}

/**
 * The form is a component used to collect user input from
 * interactive controls.
 *
 * @element schmancy-form
 *
 * @slot - Default slot for the form.
 *
 * @fires submit - Emitted when the form is submitted.
 * @fires reset - Emitted when the form is reset.
 */
@customElement('schmancy-form')
export default class SchmancyForm extends TailwindElement() {
	private $disconnecting = new Subject()
	public static readonly tagName = 'schmancy-form'
	tabIndex = 0
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

	private _controlsWithChecked = [
		'input',
		'radio',
		'schmancy-radio',
		'schmancy-switch',
		'schmancy-checkbox',
		'schmancy-radio-group',
		'schmancy-autocomplete',
	]
	private _controlsWithValue = [
		'input',
		'schmancy-input',
		'schmancy-mask-input',
		'textarea',
		'schmancy-rating',
		'schmancy-select',
		'schmancy-combo',
		'schmancy-date-time-input',
		'schmancy-autocomplete',
	]
	private _controlsThatSubmit = ['button', 'schmancy-input', 'schmancy-button', 'schmancy-icon-button']

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
					if ((e.target as HTMLButtonElement).type?.toLowerCase() === 'submit') this.handleSubmitRequest(e)
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
				for (let i = 0; i < element.options.length; i++) {
					const option = element.options[i]
					option.selected = option.defaultSelected
				}
			} else if (
				(tagName === 'input' && (element.type === 'checkbox' || element.type == 'radio')) ||
				(tagName !== 'input' && this._controlsWithChecked.includes(tagName))
			) {
				element.checked = element.hasAttribute('checked')
			} else if (
				tagName === 'schmancy-input' ||
				tagName === 'schmancy-rating' ||
				tagName === 'schmancy-mask-input' ||
				tagName === 'schmancy-date-time-input'
			) {
				element.value = element.getAttribute('value')
			} else if (this._controlsWithValue.includes(tagName)) {
				element.value = element.defaultValue
			}
		})
		this.dispatchEvent(new CustomEvent('reset'))
	}

	private getFormElements(): any[] {
		const slot = this.shadowRoot?.querySelector('slot')
		const assignedElements = slot?.assignedElements({ flatten: true })
		const formElements: any[] = []
		assignedElements?.forEach((element: any) => {
			if (!element.disabled) {
				formElements.push(element)
			}
			const children = Array.from(element.getElementsByTagName('*')).filter((element: any) => !element.disabled)
			formElements.push(...children)
		})

		return formElements
	}

	public getFormData() {
		const formData = new FormData()

		const formElements = this.getFormElements()
		formElements.forEach(element => {
			const tagName = element.tagName.toLowerCase()
			if (tagName === 'select') {
				for (let i = 0; i < element.options.length; i++) {
					const option = element.options[i]
					if (option.selected) {
						formData.append(element.name, option.value)
					}
				}
			} else if (this._controlsWithChecked.includes(tagName) && element.checked) {
				formData.append(element.name, element.value || 'on')
			} else if (
				this._controlsWithValue.includes(tagName) &&
				element.type !== 'checkbox' &&
				element.type !== 'radio' &&
				element.type !== 'submit'
			) {
				formData.append(element.name, element.value)
			}
		})

		return formData
	}

	/** Checks for validity of the form. */
	public reportValidity(): boolean {
		const formElements = this.getFormElements()
		return !formElements.some(
			element => typeof element.reportValidity === 'function' && element.reportValidity() === false,
		)
	}

	private handleSubmitRequest(event: MouseEvent | KeyboardEvent) {
		const targetElement: any = event.target as HTMLElement
		if (this._controlsThatSubmit.includes(targetElement.tagName.toLowerCase())) {
			this.submit()
		} else if (targetElement.type?.toLowerCase() === 'reset') {
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
		'schmancy-form': SchmancyForm
	}
}
