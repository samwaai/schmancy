/**
 * `<schmancy-form>` — schmancy form owner with isolated submit state.
 *
 * Architecture:
 * - Extends `SchmancyElement` (shadow DOM, RxJS + `disconnecting` conventions).
 * - Renders content inside `<schmancy-context .provides=${[formSubmitState]}>`
 *   so each form instance gets an isolated copy of the submit state via the
 *   schmancy state library — no `@lit/context` plumbing in user code.
 * - Inner `<form novalidate>` is the native-semantics trigger for Enter-key
 *   submit and `type=submit` button activation.
 * - Fields self-register via `FIELD_CONNECT_EVENT` (composed event from
 *   `FormFieldMixin.connectedCallback`). Stale refs (from disconnected
 *   fields) are filtered by `isConnected` at iteration time.
 *
 * Schema seam — pass any `{ parse(input): T }` object (zod, valibot, ArkType,
 * etc.) via the `schema` property to get typed `submit` event detail.
 */

import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'
import { SchmancyElement } from '../../mixins'
import { FIELD_CONNECT_EVENT, type IFormFieldMixin } from '../../mixins/formField.mixin'
import { formSubmitState, type FormSubmitState, type FormError } from './form-state'

/** Structural type matching zod, valibot, ArkType, etc. — any schema with `.parse()`. */
export interface ParseSchema<T = unknown> {
	parse(input: unknown): T
}

const isButton = (node: EventTarget): node is HTMLElement => {
	if (!(node instanceof HTMLElement)) return false
	return node.tagName === 'BUTTON' || node.tagName === 'SCHMANCY-BUTTON'
}

/** Submit event detail. `data` is typed when `schema` is set. */
export type SchmancyFormSubmitDetail<T = Record<string, FormDataEntryValue>> = {
	data: T
	formData: FormData
	/**
	 * Register a promise that gates the form's success/error state. If unused,
	 * the form synchronously flips to `success` after dispatch. If used,
	 * `success`/`error` reflect the promise's outcome.
	 */
	until(p: Promise<unknown>): void
}

@customElement('schmancy-form')
export default class SchmancyForm<TSchema extends ParseSchema | undefined = undefined>
	extends SchmancyElement {
	public static readonly tagName: string = 'schmancy-form'

	/**
	 * Optional schema for parsing FormData on submit. Anything with a
	 * `.parse(input)` method works (zod, valibot, ArkType). When set, the
	 * `submit` event's `detail.data` is typed `z.infer<TSchema>`.
	 */
	@property({ attribute: false })
	schema?: TSchema

	/** Skip built-in browser constraint validation. Mirrors `<form novalidate>`. */
	@property({ type: Boolean })
	novalidate: boolean = true

	private _fields = new Set<IFormFieldMixin>()
	private _submitting = false

	/**
	 * Local mirror of the submit-state status — drives the inline live region
	 * synchronously. Independent of the schmancy-state library's resolution
	 * chain (which has known cross-await fallback semantics) so the AT-facing
	 * announcement is always correct for this form instance.
	 */
	@state() private _liveStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle'
	@state() private _liveError: string = ''
	private _internals: ElementInternals | undefined = (() => {
		try {
			return this.attachInternals()
		} catch {
			return undefined
		}
	})()

	override connectedCallback(): void {
		super.connectedCallback()

		// Forbid nested <schmancy-form>.
		if (this.parentElement?.closest('schmancy-form')) {
			console.error('[schmancy-form] nested <schmancy-form> is not supported')
			return
		}

		// Field registry — composed event from FormFieldMixin.connectedCallback.
		fromEvent<CustomEvent<IFormFieldMixin>>(this, FIELD_CONNECT_EVENT)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => this._fields.add(e.detail))

		// Submit-trigger interception — slotted descendants live in light DOM
		// while the inner <form> is in shadow DOM, so native form-association
		// across the shadow boundary doesn't work for `<button type=submit>`.
		// Capture clicks on type=submit buttons (native + schmancy-button) and
		// Enter keys on registered fields, then call the inner form's
		// requestSubmit() which fires the same native submit event handler
		// chain that a directly-associated button would have triggered.
		fromEvent<MouseEvent>(this, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => this._maybeRequestSubmit(e))
		fromEvent<KeyboardEvent>(this, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				if (e.key !== 'Enter' || e.shiftKey) return
				// Skip Enter inside <textarea> (newline) and contenteditable.
				const target = e.target as HTMLElement | null
				if (target?.tagName === 'TEXTAREA') return
				if (target?.isContentEditable) return
				this._maybeRequestSubmit(e)
			})
	}

	private _maybeRequestSubmit(e: Event): void {
		// On click: trigger only when the target is a type=submit button.
		// On keydown(Enter): always trigger if focus is on a registered field.
		// type=reset is handled separately in _maybeReset.
		if (e.type === 'click') {
			const path = e.composedPath()
			const resetBtn = path.find(
				node => isButton(node) && node.getAttribute('type') === 'reset',
			)
			if (resetBtn) {
				e.preventDefault()
				const form = this.shadowRoot?.querySelector('form')
				form?.reset()
				return
			}
			const submitBtn = path.find(
				node => isButton(node) && node.getAttribute('type') === 'submit',
			)
			if (!submitBtn) return
			e.preventDefault()
		}
		const form = this.shadowRoot?.querySelector('form')
		form?.requestSubmit()
	}

	/** Active fields — drops stale refs from disconnected nodes. */
	private get _activeFields(): IFormFieldMixin[] {
		return [...this._fields].filter(f => f.isConnected)
	}

	private async _onSubmit(e: SubmitEvent): Promise<void> {
		e.preventDefault()
		e.stopPropagation()
		if (this._submitting) return

		// Phase 4 — submit forces error display on every field.
		this._activeFields.forEach(f => f.markSubmitted())

		// Validate; success path entered ONLY if all valid.
		const allValid = this._activeFields.every(f => f.checkValidity())
		const fs = formSubmitState.value
		if (!allValid) {
			formSubmitState.set({
				...fs,
				status: 'error',
				error: { message: 'Validation failed' },
			})
			this._broadcastStatus('error', 'Validation failed. Please correct the highlighted fields.')
			const firstInvalid = this._activeFields.find(f => f.error) as unknown as
				| HTMLElement
				| undefined
			firstInvalid?.focus()
			return
		}

		this._submitting = true
		formSubmitState.set({
			...fs,
			status: 'submitting',
			error: null,
			submitCount: fs.submitCount + 1,
		})
		this._broadcastStatus('submitting')

		// Build payload from the registered fields' contracted toFormEntries().
		const formData = new FormData()
		for (const field of this._activeFields) {
			for (const [k, v] of field.toFormEntries()) formData.append(k, v)
		}
		const raw = Object.fromEntries(formData)
		const data = this.schema ? this.schema.parse(raw) : raw

		// Awaitable submit — consumers register promises via e.detail.until(p).
		const pending: Promise<unknown>[] = []
		this.dispatchEvent(
			new CustomEvent<SchmancyFormSubmitDetail<unknown>>('submit', {
				detail: {
					data,
					formData,
					until: (p: Promise<unknown>) => pending.push(p),
				},
			}),
		)

		try {
			await Promise.all(pending)
			formSubmitState.set({
				...formSubmitState.value,
				status: 'success',
				error: null,
			})
			this._broadcastStatus('success')
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			formSubmitState.set({
				...formSubmitState.value,
				status: 'error',
				error: { message },
			})
			this._broadcastStatus('error', message)
		} finally {
			this._submitting = false
		}
	}

	private _onReset(e: Event): void {
		e.stopPropagation()
		this._activeFields.forEach(f => f.resetForm())
		formSubmitState.set({ status: 'idle', error: null, submitCount: 0 })
		this._broadcastStatus('idle')
		this.dispatchEvent(new CustomEvent('reset'))
	}

	private _broadcastStatus(status: FormSubmitState['status'], errorMessage?: string): void {
		this._liveStatus = status
		this._liveError = errorMessage ?? ''
		const states = this._internals?.states
		if (states) {
			for (const s of ['submitting', 'success', 'error', 'idle']) states.delete(s)
			states.add(status)
		}
		// aria-busy on the host while submitting (WCAG 2.2 AA — disabled buttons
		// drop from tab order; keep them focusable, signal busy via aria).
		if (status === 'submitting') this.setAttribute('aria-busy', 'true')
		else this.removeAttribute('aria-busy')
	}

	/**
	 * Server-side error mapping (RHF `setError(name, ...)`-equivalent).
	 * Sets `setCustomValidity(message)` on the matching field and ensures the
	 * error displays by marking it submitted.
	 */
	public setFieldError(name: string, message: string): boolean {
		const field = this._activeFields.find(f => f.name === name)
		if (!field) return false
		field.setCustomValidity(message)
		field.markSubmitted()
		return true
	}

	/**
	 * Top-of-form error (RHF `setError('root.serverError', ...)`-equivalent).
	 * Flips form status to 'error' with a structured `FormError`.
	 */
	public setFormError(message: string, code?: string): void {
		formSubmitState.set({
			...formSubmitState.value,
			status: 'error',
			error: { message, code } as FormError,
		})
		this._broadcastStatus('error', message)
	}

	/** Programmatically submit via the native submitter pipeline. */
	public submit(): boolean {
		const form = this.shadowRoot?.querySelector('form')
		if (!form) return false
		form.requestSubmit()
		return true
	}

	/** Programmatically reset via native `form.reset()`. */
	public reset(): void {
		const form = this.shadowRoot?.querySelector('form')
		form?.reset()
	}

	public reportValidity(): boolean {
		return this._activeFields.every(f => f.reportValidity())
	}

	public checkValidity(): boolean {
		return this._activeFields.every(f => f.checkValidity())
	}

	/** Snapshot of current form values from the registered fields. */
	public getFormData(): FormData {
		const formData = new FormData()
		for (const field of this._activeFields) {
			for (const [k, v] of field.toFormEntries()) formData.append(k, v)
		}
		return formData
	}

	render() {
		return html`
			<schmancy-context .provides=${[formSubmitState]}>
				<form
					?novalidate=${this.novalidate}
					@submit=${this._onSubmit}
					@reset=${this._onReset}
				>
					<slot></slot>
				</form>
				<!--
					Form-level live region — assistive tech announces server-side
					form errors (validation summary, network failure, server reject)
					here. Visually hidden via the .sr-only convention; consumers
					render their own visible banner from formSubmitState if they
					want one. Empty content while idle/submitting/success — only
					error states populate the region. WCAG 4.1.3 (Status Messages).
				-->
				<div
					role="status"
					aria-live="assertive"
					aria-atomic="true"
					class="sr-only"
				>${this._liveStatus === 'error' ? this._liveError : ''}</div>
			</schmancy-context>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-form': SchmancyForm
	}
}

// Retained type surfaces — kept exported because downstream code may import
// them as documentation. The new implementation no longer uses them
// internally.

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
	submit: CustomEvent<SchmancyFormSubmitDetail<unknown>>
	reset: CustomEvent
}
