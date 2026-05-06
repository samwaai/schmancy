/**
 * Form-level submit state — consumed by `<schmancy-form>` and any descendant
 * (e.g. `<schmancy-button type="submit">` to drive its loading/aria-busy).
 *
 * `<schmancy-form>` wraps its render output in `<schmancy-context
 * .provides=${[formSubmitState]}>` so each instance gets an isolated copy
 * via the schmancy state library's resolveContextual mechanism. Reads of
 * `formSubmitState.value` and writes via `formSubmitState.set(...)` inside
 * the form's subtree resolve to the per-form copy automatically — no
 * `@lit/context` plumbing in user code.
 */

import { state } from '../state'

export type FormError = {
	message: string
	code?: string
}

export type FormSubmitState = {
	status: 'idle' | 'submitting' | 'success' | 'error'
	error: FormError | null
	/** Increments on every submit attempt — RHF parity. */
	submitCount: number
}

export const formSubmitState = state<FormSubmitState>('schmancy/form-submit').memory({
	status: 'idle',
	error: null,
	submitCount: 0,
})
