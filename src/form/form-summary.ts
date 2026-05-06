/**
 * `<schmancy-form-summary>` — top-of-form error summary with anchor links to
 * each invalid field. Linear / GOV.UK / GitHub pattern.
 *
 * Drop one inside any `<schmancy-form>`; on submit-failure or when
 * `<schmancy-form>.setFormError(...)` is called, the summary renders a
 * `role="alert"` banner with the form-level error message and a list of
 * links pointing at each invalid field's `id`.
 *
 * Hidden when the form is idle, submitting, or successful — only `error`
 * populates it.
 *
 * @element schmancy-form-summary
 */

import { html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyElement } from '../../mixins'
import type SchmancyForm from './form'

@customElement('schmancy-form-summary')
export class SchmancyFormSummary extends SchmancyElement {
	/**
	 * Optional heading text. Defaults to a count-based summary
	 * ("1 problem with this form" / "3 problems with this form").
	 */
	@property({ type: String }) heading?: string

	/**
	 * Render bumper — incremented to force a re-render when the form's state
	 * changes (the actual content is computed from the DOM in render()).
	 */
	@state() private _bump: number = 0

	private _form: SchmancyForm | null = null
	private _formObserver?: MutationObserver

	override connectedCallback(): void {
		super.connectedCallback()
		this._form = this.closest('schmancy-form') as SchmancyForm | null
		if (!this._form) {
			console.error('[schmancy-form-summary] must be a descendant of <schmancy-form>')
			return
		}
		const bump = () => { this._bump++ }
		this._formObserver = new MutationObserver(bump)
		// Form host attribute changes (aria-busy, :state class reflections,
		// descendant attribute changes for fields' aria-invalid). subtree:true
		// catches attribute mutations on every descendant including light-DOM
		// fields and the form's own host.
		this._formObserver.observe(this._form, {
			attributes: true,
			subtree: true,
		})
		// Defer live-region observation until the form has rendered its
		// shadow tree.
		const attachLiveRegionObserver = async (): Promise<void> => {
			await this._form?.updateComplete
			const liveRegion = this._form?.shadowRoot?.querySelector('[role="status"]')
			if (liveRegion) {
				this._formObserver?.observe(liveRegion, {
					childList: true,
					characterData: true,
					subtree: true,
				})
			}
			// Force a render so the initial state is reflected.
			this._bump++
		}
		void attachLiveRegionObserver()
	}

	override disconnectedCallback(): void {
		this._formObserver?.disconnect()
		this._formObserver = undefined
		super.disconnectedCallback()
	}

	private _readFormStatus(): 'idle' | 'submitting' | 'success' | 'error' {
		if (!this._form) return 'idle'
		if (this._form.matches(':state(error)')) return 'error'
		if (this._form.matches(':state(submitting)')) return 'submitting'
		if (this._form.matches(':state(success)')) return 'success'
		return 'idle'
	}

	private _readFormMessage(): string {
		const liveRegion = this._form?.shadowRoot?.querySelector('[role="status"]')
		return liveRegion?.textContent?.trim() ?? ''
	}

	private _readInvalidFields(): Array<{ id: string; label: string; message: string }> {
		if (!this._form) return []
		const result: Array<{ id: string; label: string; message: string }> = []
		for (const el of Array.from(this._form.querySelectorAll('*'))) {
			if (!(el instanceof HTMLElement)) continue
			let isInvalid = false
			try {
				isInvalid = el.matches(':state(invalid)')
			} catch {
				continue
			}
			if (!isInvalid) continue
			const f = el as HTMLElement & {
				label?: string
				name?: string
				validationMessage?: string
			}
			result.push({
				id: f.id,
				label: f.label || f.name || '(field)',
				message: f.validationMessage || 'Invalid value',
			})
		}
		return result
	}

	render() {
		// Read everything fresh from the DOM each render — no @state cache, no
		// re-render loops. The MutationObserver bumps `_bump` to trigger this
		// render; `_bump` itself is never read here.
		void this._bump

		const status = this._readFormStatus()
		if (status !== 'error') return nothing

		const formMessage = this._readFormMessage()
		const invalid = this._readInvalidFields()
		const count = invalid.length
		const heading =
			this.heading ??
			(count === 0
				? 'There is a problem with this form'
				: `There ${count === 1 ? 'is' : 'are'} ${count} problem${count === 1 ? '' : 's'} with this form`)

		return html`
			<div role="alert" aria-labelledby="schmancy-form-summary-heading">
				<h2 id="schmancy-form-summary-heading">${heading}</h2>
				${formMessage ? html`<p>${formMessage}</p>` : nothing}
				${count > 0
					? html`
						<ul>
							${invalid.map(
								f => html`
									<li>
										<a
											href="#${f.id}"
											@click=${(e: MouseEvent) => this._jumpToField(e, f.id)}
										>${f.label}: ${f.message}</a>
									</li>
								`,
							)}
						</ul>
					`
					: nothing}
			</div>
		`
	}

	private _jumpToField(e: MouseEvent, fieldId: string): void {
		e.preventDefault()
		const target = this._form?.querySelector(`#${CSS.escape(fieldId)}`) as HTMLElement | null
		target?.focus()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-form-summary': SchmancyFormSummary
	}
}
