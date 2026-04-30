import { SchmancyElement } from '@mixins/index'
import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type SchmancySwitchChangeEvent = CustomEvent<{ value: boolean }>

/**
 * Binary on/off control. Form-associated, keyboard-accessible, semantically a
 * switch (ARIA role="switch"). Distinct from `schmancy-checkbox`: a switch
 * represents an immediate state change, a checkbox represents a selection in
 * a form to be submitted.
 *
 * @element schmancy-switch
 * @fires change - `CustomEvent<{ value: boolean }>` when the state changes.
 * @attr checked - Initial checked state (also reflected via `value`).
 * @attr disabled - Disables interaction.
 * @attr required - Requires the switch to be on for form validity.
 * @attr name - Form field name for submission.
 * @csspart track - The background track.
 * @csspart thumb - The moving thumb.
 */
@customElement('schmancy-switch')
export class SchmancySwitch extends SchmancyElement {
	static styles = [css`
	:host {
		display: inline-block;
	}
	:host([disabled]) {
		opacity: 0.38;
		pointer-events: none;
	}
	button {
		appearance: none;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		font: inherit;
	}
	.track {
		width: 2.25rem;
		height: 1.25rem;
		border-radius: 999px;
		background: var(--schmancy-sys-color-surface-containerHighest, #e0e0e0);
		border: 1px solid var(--schmancy-sys-color-outline, #79747e);
		position: relative;
		transition: background 150ms ease, border-color 150ms ease;
	}
	:host(:state(checked)) .track {
		background: var(--schmancy-sys-color-primary-default, #6750a4);
		border-color: var(--schmancy-sys-color-primary-default, #6750a4);
	}
	.thumb {
		position: absolute;
		top: 50%;
		left: 0.125rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 999px;
		background: var(--schmancy-sys-color-outline, #79747e);
		transform: translateY(-50%);
		transition: transform 150ms ease, background 150ms ease, width 150ms ease, height 150ms ease;
	}
	:host(:state(checked)) .thumb {
		transform: translate(1rem, -50%);
		width: 1rem;
		height: 1rem;
		background: var(--schmancy-sys-color-primary-on, #ffffff);
	}
	button:focus-visible .track {
		outline: 2px solid var(--schmancy-sys-color-primary-default, #6750a4);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.track, .thumb { transition: none; }
	}
`];
	static formAssociated = true
	private internals: ElementInternals | undefined

	@property({ type: Boolean, reflect: true }) checked = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: String }) name = ''
	@property({ type: String }) value = 'on'
	@property({ type: String }) label = ''

	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}

	constructor() {
		super()
		try {
			this.internals = this.attachInternals()
		} catch {
			this.internals = undefined
		}
	}

	get form(): HTMLFormElement | null {
		return this.internals?.form ?? null
	}

	protected updated(changed: Map<string, unknown>) {
		super.updated?.(changed)
		if (changed.has('checked') || changed.has('value') || changed.has('name')) {
			this.internals?.setFormValue(this.checked ? this.value : null)
			if (this.checked) this.internals?.states.add('checked')
			else this.internals?.states.delete('checked')
		}
		if (changed.has('required') || changed.has('checked')) {
			if (this.required && !this.checked) {
				this.internals?.setValidity({ valueMissing: true }, 'This switch is required.')
			} else {
				this.internals?.setValidity({})
			}
		}
	}

	formResetCallback() {
		this.checked = this.hasAttribute('checked')
	}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
	}

	public checkValidity(): boolean {
		return this.internals?.checkValidity() ?? true
	}

	public reportValidity(): boolean {
		return this.internals?.reportValidity() ?? true
	}

	private _toggle = () => {
		if (this.disabled) return
		this.checked = !this.checked
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value: this.checked },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private _onKeydown = (e: KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault()
			this._toggle()
		}
	}

	render() {
		return html`
			<button
				type="button"
				role="switch"
				aria-checked=${this.checked ? 'true' : 'false'}
				aria-label=${this.label || nothing}
				aria-required=${this.required ? 'true' : 'false'}
				?disabled=${this.disabled}
				@click=${this._toggle}
				@keydown=${this._onKeydown}
			>
				<span part="track" class="track">
					<span part="thumb" class="thumb"></span>
				</span>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-switch': SchmancySwitch
	}
}
