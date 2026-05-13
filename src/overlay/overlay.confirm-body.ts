import { SchmancyElement } from '@mixins/index'
import { css, html, type TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { choose } from 'lit/directives/choose.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { gravity } from '../directives/gravity'
import type SchmancyInput from '../form/fields/input/input'

import '../icons/icon'
import '../form/fields/input/input'
import '../typography/typography'
import '../button/button'

/**
 * Internal body component used by the `confirm()` / `prompt()` sugar.
 *
 * `overlay.service.ts` lazy-imports this body via `await import('./overlay.confirm-body')`
 * so by mount time `schmancy-button`, `schmancy-input`, `schmancy-typography`,
 * and `schmancy-icon` are all registered.
 *
 * Emits a `close` CustomEvent with the typed result; the overlay picks
 * that up as the primary return channel. For custom-styled confirms,
 * callers pass their own component to `show()`.
 */
@customElement('schmancy-overlay-prompt-body')
export class SchmancyOverlayPromptBody extends SchmancyElement {
	static styles = [css`
		:host {
			display: block;
			min-width: 280px;
			max-width: 480px;
			padding: 1.5rem;
		}
	`]

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

	@query('schmancy-input') private _schmancyInput?: SchmancyInput

	override firstUpdated(): void {
		if (this.mode === 'prompt') {
			this._schmancyInput?.focus()
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
			if (this._schmancyInput && !this._schmancyInput.reportValidity()) return
			this.dismiss(this._schmancyInput?.value ?? '')
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
				<div class="flex flex-col gap-3">
					${when(
						this.variant === 'danger',
						() => html`
							<schmancy-icon
								${gravity({ delay: 0, mass: 0.7 })}
								class="text-error-default"
								style="font-size:32px"
							>error_outline</schmancy-icon>
						`,
					)}

					${when(
						this.heading,
						() => html`
							<schmancy-typography
								${gravity({ delay: 0, mass: 0.8 })}
								type="headline"
								token="sm"
							>${this.heading}</schmancy-typography>
						`,
					)}

					${when(
						this.subtitle,
						() => html`
							<schmancy-typography
								${gravity({ delay: 60, mass: 0.9 })}
								type="body"
								token="md"
								class="opacity-70"
							>${this.subtitle}</schmancy-typography>
						`,
					)}

					${choose(
						this.mode,
						[
							[
								'prompt',
								() => html`
									<schmancy-input
										${gravity({ delay: 120, mass: 1.0 })}
										.label=${this.label ?? ''}
										.value=${this.defaultValue}
										.type=${this.inputType}
										placeholder=${ifDefined(this.placeholder)}
										pattern=${ifDefined(this.pattern)}
										.required=${this.required}
									></schmancy-input>
									${when(
										this.message,
										() => html`
											<schmancy-typography
												${gravity({ delay: 180, mass: 1.0 })}
												type="body"
												token="sm"
												class="opacity-70"
											>${this.message}</schmancy-typography>
										`,
									)}
								`,
							],
						],
						() => html`
							${when(
								this.message,
								() => html`
									<schmancy-typography
										${gravity({ delay: 60, mass: 0.9 })}
										type="body"
										token="md"
										class="opacity-70"
									>${this.message}</schmancy-typography>
								`,
							)}
						`,
					)}
				</div>

				<div ${gravity({ delay: 180, mass: 1.0 })} class="flex justify-end gap-2 mt-6">
					<schmancy-button
						type="button"
						variant="text"
						@click=${this.handleCancel}
					>${this.cancelText}</schmancy-button>
					<schmancy-button
						type="submit"
						variant="filled"
						color=${this.variant === 'danger' ? 'error' : 'primary'}
					>${this.confirmText}</schmancy-button>
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
