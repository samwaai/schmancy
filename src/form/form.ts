import { customElement } from 'lit/decorators.js'

/**
 * Ergonomic wrapper around a native `<form>`. Children are reparented into a light-DOM `<form>` on connection so form-associated custom elements resolve `internals.form` via native DOM ancestry.
 *
 * - Form-associated custom elements (FACE) resolve their `internals.form`
 *   correctly via native DOM ancestry.
 * - `new FormData(form)` collects values from every FACE + native control
 *   without any manual walking.
 * - `form.reset()` triggers `formResetCallback()` on every FACE.
 * - `form.reportValidity()` runs native validation UI.
 * - `<button type="submit">` and `<schmancy-button type="submit">` both
 *   submit the form via the native submitter pipeline.
 *
 * This component exists only to translate the native `submit` / `reset`
 * events into the Schmancy event shape (`detail: FormData`). All heavy
 * lifting is the platform's.
 *
 * @element schmancy-form
 * @summary Always wrap form-associated schmancy components in schmancy-form (or a native `<form>`) so `new FormData(form)` just works.
 * @example
 * <schmancy-form @submit=${(e) => console.log(Object.fromEntries(e.detail))}>
 *   <schmancy-input name="email" type="email" required></schmancy-input>
 *   <schmancy-input name="password" type="password" required></schmancy-input>
 *   <schmancy-button type="submit" variant="filled">Sign in</schmancy-button>
 * </schmancy-form>
 * @platform form submit - Light-DOM native `<form>` element. Degrades to a `<form>` if the tag never registers — same semantics, just no CustomEvent translation.
 * @fires submit - `CustomEvent<FormData>` emitted when the form is submitted.
 * @fires reset - Emitted after the underlying form resets.
 */
@customElement('schmancy-form')
export default class SchmancyForm extends HTMLElement {
	public static readonly tagName: string = 'schmancy-form'

	private _form: HTMLFormElement | null = null
	private _wrapped = false

	/** ElementInternals for `:state(invalid)` / `:state(submitting)` broadcasting. */
	private readonly _internals: ElementInternals | undefined = (() => {
		try { return this.attachInternals() } catch { return undefined }
	})()

	/** Skip built-in constraint validation on submit. Mirrors `<form novalidate>`. */
	get novalidate(): boolean {
		return this.hasAttribute('novalidate')
	}
	set novalidate(value: boolean) {
		if (value) this.setAttribute('novalidate', '')
		else this.removeAttribute('novalidate')
	}

	connectedCallback(): void {
		this.ensureForm()
	}

	disconnectedCallback(): void {
		if (this._form) {
			this._form.removeEventListener('submit', this._onSubmit)
			this._form.removeEventListener('reset', this._onReset)
		}
	}

	/**
	 * On first connection, create the internal light-DOM `<form>` and move
	 * existing children into it. Re-entry is a no-op.
	 */
	private ensureForm(): void {
		if (this._wrapped) return

		// Respect an explicit consumer-supplied wrapping <form>.
		const existing = Array.from(this.children).find(c => c instanceof HTMLFormElement) as
			| HTMLFormElement
			| undefined

		const form = existing ?? document.createElement('form')
		form.noValidate = true

		if (!existing) {
			// Snapshot children because appending mutates `this.childNodes`.
			const children = Array.from(this.childNodes)
			for (const node of children) form.appendChild(node)
			this.appendChild(form)
		}

		form.addEventListener('submit', this._onSubmit)
		form.addEventListener('reset', this._onReset)

		this._form = form
		this._wrapped = true
	}

	private _onSubmit = (e: SubmitEvent): void => {
		// Prevent the default navigation AND stop the native submit from
		// bubbling past this wrapper — otherwise consumers listening for
		// `submit` on <schmancy-form> would see the native event plus our
		// CustomEvent (two fires per submission).
		e.preventDefault()
		e.stopPropagation()
		if (!this.novalidate && !this._form!.reportValidity()) {
			this._internals?.states.add('invalid')
			return
		}
		this._internals?.states.delete('invalid')
		this._internals?.states.add('submitting')
		try {
			this.dispatchEvent(
				new CustomEvent('submit', {
					detail: new FormData(this._form!),
				}),
			)
		} finally {
			this._internals?.states.delete('submitting')
		}
	}

	private _onReset = (e: Event): void => {
		e.stopPropagation()
		this._internals?.states.delete('invalid')
		this.dispatchEvent(new CustomEvent('reset'))
	}

	/** Programmatically submit via the native submitter pipeline. */
	public submit(): boolean {
		if (!this._form) return false
		if (!this.novalidate && !this._form.reportValidity()) return false
		this._form.requestSubmit()
		return true
	}

	/** Programmatically reset via native `form.reset()`. */
	public reset(): void {
		this._form?.reset()
	}

	public reportValidity(): boolean {
		return this._form?.reportValidity() ?? true
	}

	public checkValidity(): boolean {
		return this._form?.checkValidity() ?? true
	}

	/** Snapshot of current form values. Equivalent to `new FormData(this.form)`. */
	public getFormData(): FormData {
		return this._form ? new FormData(this._form) : new FormData()
	}

	/** The underlying `<form>` element (escape hatch for advanced integration). */
	public get form(): HTMLFormElement | null {
		return this._form
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-form': SchmancyForm
	}
}

// === Retained type surface ===
// These interfaces were part of the old collection-based engine. They're kept
// exported because downstream code may still import them as documentation.
// The new implementation no longer uses them internally.

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

export interface FormEventMap {
	submit: CustomEvent<FormData>
	reset: CustomEvent
}
