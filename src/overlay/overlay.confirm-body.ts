import { $LitElement } from '@mixins/index'
import { css, html, type TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { choose } from 'lit/directives/choose.js'
import { ifDefined } from 'lit/directives/if-defined.js'

/**
 * Internal body component used by the `confirm()` / `prompt()` sugar.
 *
 * Minimal, dependency-free — plain HTML buttons / input so this file
 * doesn't need to import schmancy-form / schmancy-button (avoids the
 * risk of circular module graphs during early imports of $overlay).
 *
 * Emits a `close` CustomEvent with the typed result; the overlay picks
 * that up as the primary return channel. For custom-styled confirms,
 * callers pass their own component to `show()`.
 */
@customElement('schmancy-overlay-prompt-body')
export class SchmancyOverlayPromptBody extends $LitElement(css`
	:host {
		display: block;
		padding: 20px 24px;
		min-width: 280px;
		max-width: 480px;
		color: var(--schmancy-sys-color-on-surface, #1a1a1a);
		background: var(--schmancy-sys-color-surface, #ffffff);
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
	}
	:host([variant='danger']) .cta-confirm {
		background: var(--schmancy-sys-color-error, #b3261e);
		color: var(--schmancy-sys-color-on-error, #ffffff);
	}
`) {
	@property({ type: String }) heading?: string
	@property({ type: String }) subtitle?: string
	@property({ type: String }) message?: string
	@property({ type: String, attribute: 'confirm-text' }) confirmText = 'Confirm'
	@property({ type: String, attribute: 'cancel-text' }) cancelText = 'Cancel'
	@property({ type: String, reflect: true }) variant: 'default' | 'danger' = 'default'

	/** Presence of `mode` switches between confirm (boolean) and prompt (string). */
	@property({ type: String }) mode: 'confirm' | 'prompt' = 'confirm'
	@property({ type: String }) label?: string
	@property({ type: String, attribute: 'default-value' }) defaultValue = ''
	@property({ type: String }) placeholder?: string
	@property({ type: String, attribute: 'input-type' })
	inputType:
		| 'text'
		| 'email'
		| 'password'
		| 'tel'
		| 'url'
		| 'number'
		| 'search'
		| 'date'
		| 'time'
		| 'datetime-local' = 'text'
	@property({ type: String }) pattern?: string
	@property({ type: Boolean }) required = false

	@query('input') private _input?: HTMLInputElement

	override firstUpdated(): void {
		// Focus the confirm button in confirm mode; focus the input in prompt mode.
		if (this.mode === 'prompt') {
			queueMicrotask(() => this._input?.focus())
		}
	}

	private dismiss(value: boolean | string | null): void {
		this.dispatchEvent(
			new CustomEvent('close', {
				detail: value,
				bubbles: true,
				composed: true,
			}),
		)
	}

	private handleCancel = (): void => {
		this.dismiss(this.mode === 'prompt' ? null : false)
	}

	private handleConfirm = (): void => {
		if (this.mode === 'prompt') {
			const input = this._input
			if (input && !input.reportValidity()) return
			this.dismiss(input?.value ?? '')
		} else {
			this.dismiss(true)
		}
	}

	private handleSubmit = (e: Event): void => {
		e.preventDefault()
		this.handleConfirm()
	}

	protected render(): TemplateResult {
		return html`
			<form @submit=${this.handleSubmit}>
				${when(
					this.heading,
					() => html`<h2 class="text-lg font-semibold mb-1">${this.heading}</h2>`,
				)}
				${when(
					this.subtitle,
					() => html`<p class="text-sm opacity-70 mb-2">${this.subtitle}</p>`,
				)}
				${choose(
					this.mode,
					[
						[
							'prompt',
							() => html`
								${when(this.label, () => html`<label class="block text-sm mb-1">${this.label}</label>`)}
								<input
									type=${this.inputType}
									.value=${this.defaultValue}
									placeholder=${ifDefined(this.placeholder)}
									pattern=${ifDefined(this.pattern)}
									?required=${this.required}
									class="w-full px-3 py-2 rounded-md border border-outline-variant text-base mb-2"
								/>
								${when(
									this.message,
									() => html`<p class="text-sm mb-3">${this.message}</p>`,
								)}
							`,
						],
					],
					() => html`${when(this.message, () => html`<p class="text-sm mb-4">${this.message}</p>`)}`,
				)}

				<div class="flex justify-end gap-2 mt-4">
					<button
						type="button"
						@click=${this.handleCancel}
						class="px-4 py-2 rounded-md border border-outline-variant bg-transparent cursor-pointer"
					>
						${this.cancelText}
					</button>
					<button
						type="submit"
						class="cta-confirm px-4 py-2 rounded-md border-0 bg-primary text-on-primary cursor-pointer font-medium"
					>
						${this.confirmText}
					</button>
				</div>
			</form>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-overlay-prompt-body': SchmancyOverlayPromptBody
	}
}
