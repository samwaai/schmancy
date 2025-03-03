import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { color } from '../directives/color'
import { SchmancyTheme } from '../theme/theme.interface'
import { SchmancyFormField } from '@mixins/formField.mixin'

/**
 * A simplified input component that works with browser validation.
 *
 * @example
 * ```html
 * <sch-input
 *   label="Email"
 *   name="email"
 *   required
 *   type="email"
 * ></sch-input>
 * ```
 */
@customElement('sch-input')
export default class SchInput extends SchmancyFormField(css`
	:host {
		display: block;
		width: 100%;
	}

	input {
		width: 100%;
		height: var(--sch-input-height, 40px);
		padding: var(--sch-input-padding, 0 12px);
		border-radius: var(--sch-input-radius, 4px);
		font-family: inherit;
		font-size: inherit;
		background-color: var(--schmancy-sys-color-surface-highest);
		color: var(--schmancy-sys-color-surface-on);
		border: 1px solid var(--schmancy-sys-color-surface-onVariant);
	}

	input:focus {
		outline: none;
		border-color: var(--schmancy-sys-color-primary-default);
		box-shadow: 0 0 0 1px var(--schmancy-sys-color-primary-default);
	}

	/* Only show invalid state after the user has interacted with the field */
	input:not(:placeholder-shown):invalid {
		border-color: var(--schmancy-sys-color-error-default);
		box-shadow: 0 0 0 1px var(--schmancy-sys-color-error-default);
	}

	.input-wrapper {
		position: relative;
	}

	label {
		display: block;
		margin-bottom: 4px;
		font-size: 0.875rem;
	}

	.hint {
		font-size: 0.75rem;
		margin-top: 4px;
	}
`) {
	/**
	 * The type of input (text, email, password, etc.)
	 */
	@property({ type: String })
	type: string = 'text'

	/**
	 * Placeholder text
	 */
	@property({ type: String })
	placeholder: string = ''

	/**
	 * Minimum input length
	 */
	@property({ type: Number })
	minlength?: number

	/**
	 * Maximum input length
	 */
	@property({ type: Number })
	maxlength?: number

	/**
	 * Pattern for validation
	 */
	@property({ type: String })
	pattern?: string

	/**
	 * Whether to enable autocomplete
	 */
	@property({ type: String })
	autocomplete: string = 'off'

	/**
	 * Reference to the internal input element
	 */
	private inputRef = createRef<HTMLInputElement>()

	/**
	 * Handle input change
	 */
	private handleInput(e: Event) {
		this.value = (e.target as HTMLInputElement).value
		this.emitChange({ value: this.value })
	}

	/**
	 * Focus the input
	 */
	public override focus(options?: FocusOptions) {
		this.inputRef.value?.focus(options)
	}

	/**
	 * Blur the input
	 */
	public override blur() {
		this.inputRef.value?.blur()
	}

	/**
	 * Let the browser handle validation
	 */
	public override checkValidity(): boolean {
		return this.inputRef.value?.checkValidity() ?? true
	}

	/**
	 * Use the browser's built-in validation UI
	 */
	public override reportValidity(): boolean {
		return this.inputRef.value?.reportValidity() ?? true
	}

	render() {
		return html`
			${when(
				this.label,
				() => html`
					<label
						for=${this.id}
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
					>
						${this.label}
					</label>
				`,
			)}

			<div class="input-wrapper">
				<input
					${ref(this.inputRef)}
					id=${this.id}
					.type=${this.type}
					name=${this.name}
					placeholder=${this.placeholder}
					?required=${this.required}
					?disabled=${this.disabled}
					?readonly=${this.readonly}
					minlength=${this.minlength ?? ''}
					maxlength=${this.maxlength ?? ''}
					pattern=${this.pattern ?? ''}
					.autocomplete=${this.autocomplete}
					aria-invalid=${this.error ? 'true' : 'false'}
					.value=${this.value as string}
					@input=${this.handleInput}
				/>
			</div>

			${when(
				this.hint,
				() => html`
					<div
						class="hint"
						${color({
							color: SchmancyTheme.sys.color.surface.onVariant,
						})}
					>
						${this.hint}
					</div>
				`,
			)}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-input': SchInput
	}
}
