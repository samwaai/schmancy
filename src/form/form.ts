import { TailwindElement, isSchmancyFormField, type IFormFieldMixin } from '@mixins/index'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, merge, Subject, takeUntil, tap } from 'rxjs'

// === Public form-element interfaces ===

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
	checkValidity?: () => boolean
}

/** Optional registry entry for controls that cannot (yet) extend FormFieldMixin. */
export interface FormControlConfig {
	tagName: string
	hasValue?: boolean
	hasChecked?: boolean
	canSubmit?: boolean
}

export interface FormEventMap {
	submit: CustomEvent<FormData>
	reset: CustomEvent
}

/**
 * Fallback registry for legacy controls that do not extend FormFieldMixin and
 * are not natively form-associated. FormFieldMixin descendants are detected
 * automatically via brand symbol — no registration needed.
 *
 * This list is the union of v1's three hard-coded arrays and v2's typed list;
 * every existing Schmancy form control keeps working unchanged.
 */
const LEGACY_REGISTRY: ReadonlyArray<FormControlConfig> = [
	{ tagName: 'input', hasValue: true, hasChecked: true, canSubmit: true },
	{ tagName: 'textarea', hasValue: true },
	{ tagName: 'select', hasValue: true },
	{ tagName: 'button', canSubmit: true },
	{ tagName: 'radio', hasChecked: true },
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

/**
 * The form component collects user input from interactive controls.
 *
 * Discovery priority:
 * 1. **FormFieldMixin brand** — any descendant that extends `FormFieldMixin`
 *    is auto-discovered and contributes via its `toFormEntries()` override.
 * 2. **Native form-associated custom elements** — detected via
 *    `constructor.formAssociated === true` and read by duck type.
 * 3. **Legacy registry + optional user overrides** — for controls that do
 *    not yet extend FormFieldMixin. Seeded with every existing Schmancy
 *    control for zero-config back-compat.
 * 4. **Native HTML form elements** (`<input>`, `<select>`, `<textarea>`,
 *    `<button>`) — read via standard DOM APIs.
 *
 * New form components should extend `FormFieldMixin` and override
 * `toFormEntries()` / `resetForm()` as needed — they will be picked up
 * automatically without touching schmancy-form.
 *
 * @element schmancy-form
 * @slot - Default slot for form content.
 * @fires submit - FormData emitted when the form is submitted.
 * @fires reset - Emitted when the form is reset.
 */
@customElement('schmancy-form')
export default class SchmancyForm extends TailwindElement() {
	private $disconnecting = new Subject()
	public static readonly tagName: string = 'schmancy-form'
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open',
		delegatesFocus: false,
	}

	/** User-supplied overrides for controls not covered by FormFieldMixin or the legacy registry. */
	private static userRegistry: Map<string, FormControlConfig> = new Map()

	/**
	 * Register a custom form control with schmancy-form. Rarely needed —
	 * FormFieldMixin descendants are auto-discovered, and every existing
	 * Schmancy control is already in the legacy registry. Use for third-party
	 * form controls whose value cannot be read by duck-type heuristics.
	 */
	public static registerControl(config: FormControlConfig): void {
		const existing = this.userRegistry.get(config.tagName) ?? {}
		this.userRegistry.set(config.tagName, { ...existing, ...config })
	}

	private static getConfig(tagName: string): FormControlConfig | undefined {
		return this.userRegistry.get(tagName) ?? LEGACY_REGISTRY.find(c => c.tagName === tagName)
	}

	/** Skip form validation on submit. */
	@property({ type: Boolean, reflect: true }) public novalidate = false

	constructor() {
		super()
		merge(
			fromEvent<MouseEvent>(this, 'click').pipe(
				tap(e => {
					const target = e.target as HTMLButtonElement
					if (target.type?.toLowerCase() === 'submit') this.handleSubmitRequest(e)
				}),
			),
			fromEvent<KeyboardEvent>(this, 'keydown').pipe(
				tap(e => {
					if (e.code === 'Enter' || e.key === 'Enter') this.handleSubmitRequest(e)
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

	public submit(): boolean {
		if (!this.novalidate && !this.reportValidity()) return false
		this.dispatchEvent(new CustomEvent('submit', { detail: this.getFormData() }))
		return true
	}

	public reset(): void {
		for (const el of this.getFormElements()) {
			if (isSchmancyFormField(el)) {
				el.resetForm()
				continue
			}

			const tagName = el.tagName.toLowerCase()
			const cfg = SchmancyForm.getConfig(tagName)

			if (tagName === 'select') {
				const sel = el as HTMLSelectElement
				for (let i = 0; i < sel.options.length; i++) {
					const option = sel.options[i]
					option.selected = option.defaultSelected
				}
			} else if (
				(tagName === 'input' &&
					((el as HTMLInputElement).type === 'checkbox' || (el as HTMLInputElement).type === 'radio')) ||
				(tagName !== 'input' && cfg?.hasChecked)
			) {
				;(el as CheckableFormElement).checked = el.hasAttribute('checked')
			} else if (
				tagName === 'schmancy-input' ||
				tagName === 'schmancy-rating' ||
				tagName === 'schmancy-mask-input' ||
				tagName === 'schmancy-date-time-input'
			) {
				;(el as FormElement).value = el.getAttribute('value') ?? ''
			} else if (cfg?.hasValue) {
				;(el as FormElement).value = (el as FormElement).defaultValue ?? ''
			}
		}
		this.dispatchEvent(new CustomEvent('reset'))
	}

	public getFormData(): FormData {
		const fd = new FormData()

		for (const el of this.getFormElements()) {
			// Priority 1: FormFieldMixin brand — richest contract
			if (isSchmancyFormField(el)) {
				for (const [name, value] of el.toFormEntries()) fd.append(name, value)
				continue
			}

			// Priority 2–4: duck type / registry / native
			const name = (el as FormElement).name
			if (!name) continue

			const tagName = el.tagName.toLowerCase()
			const cfg = SchmancyForm.getConfig(tagName)

			if (tagName === 'select') {
				const sel = el as HTMLSelectElement
				for (let i = 0; i < sel.options.length; i++) {
					const option = sel.options[i]
					if (option.selected) fd.append(name, option.value)
				}
				continue
			}

			const inputEl = el as HTMLInputElement
			if (cfg?.hasChecked && (el as CheckableFormElement).checked) {
				fd.append(name, inputEl.value || 'on')
			} else if (
				cfg?.hasValue &&
				inputEl.type !== 'checkbox' &&
				inputEl.type !== 'radio' &&
				inputEl.type !== 'submit'
			) {
				fd.append(name, inputEl.value ?? '')
			}
		}

		return fd
	}

	public reportValidity(): boolean {
		const elements = this.getFormElements()
		return !elements.some(
			el => typeof (el as ValidatableFormElement).reportValidity === 'function' && (el as ValidatableFormElement).reportValidity!() === false,
		)
	}

	private getFormElements(): Array<HTMLElement | IFormFieldMixin> {
		const slot = this.shadowRoot?.querySelector('slot')
		const assigned = slot?.assignedElements({ flatten: true }) as HTMLElement[] | undefined
		const out: HTMLElement[] = []

		const collect = (el: HTMLElement) => {
			if ((el as HTMLInputElement).disabled) return
			out.push(el)
			const descendants = Array.from(el.getElementsByTagName('*')) as HTMLElement[]
			for (const d of descendants) {
				if (!(d as HTMLInputElement).disabled) out.push(d)
			}
		}

		assigned?.forEach(collect)
		return out
	}

	private handleSubmitRequest(event: Event): void {
		const target = event.target as HTMLElement
		const tagName = target.tagName.toLowerCase()
		const cfg = SchmancyForm.getConfig(tagName)
		const type = (target as HTMLButtonElement).type?.toLowerCase()

		// Submit on: native submit-type element OR registered canSubmit tag with type=submit
		if (type === 'submit' && (cfg?.canSubmit || tagName === 'button' || tagName === 'input')) {
			this.submit()
		} else if (type === 'reset') {
			this.reset()
		}
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
