import { css, html, LitElement, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyFormField } from '@mixins/index'

export type SchmancySwitchChangeEvent = CustomEvent<{ value: boolean }>

/**
 * Binary on/off control. Form-associated, keyboard-accessible, semantically a
 * switch (ARIA role="switch"). Distinct from `schmancy-checkbox`: a switch
 * represents an immediate state change, a checkbox represents a selection in
 * a form to be submitted.
 *
 * @element schmancy-switch
 * @fires change - `CustomEvent<{ value: boolean }>` when the state changes.
 * @csspart track - The background track.
 * @csspart thumb - The moving thumb.
 */
@customElement('schmancy-switch')
export class SchmancySwitch extends SchmancyFormField(css`
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
`) {
	// `formAssociated`, `internals`, `name`, `disabled`, `required`, `id`,
	// `label`, `error`, `validationMessage`, `validateOn`, touched/dirty/submitted,
	// `markTouched/markSubmitted`, `formResetCallback`, `formDisabledCallback`,
	// FIELD_CONNECT_EVENT dispatch — all from the mixin.

	// Inner <button> is the focusable surface; route host focus to it.
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}

	/**
	 * The string written to FormData when the switch is on. Native
	 * `<input type=checkbox value="...">` semantics. Defaults to `'on'` to
	 * match HTML checkbox conventions.
	 */
	@property({ type: String, reflect: true })
	override value: string = 'on'

	/** Boolean on/off state. Native `<input type=checkbox>.checked` semantics. */
	@property({ type: Boolean, reflect: true })
	checked: boolean = false

	/** Snapshot of `checked` at first render — drives the `dirty` override. */
	private _checkedDefault: boolean = false

	override firstUpdated(changed: PropertyValues): void {
		super.firstUpdated(changed)
		this._checkedDefault = this.checked
	}

	/**
	 * Override the mixin's value-vs-default `dirty` getter — for switch the
	 * meaningful state is `checked`, not the FormData string.
	 */
	override get dirty(): boolean {
		return this.checked !== this._checkedDefault
	}

	override willUpdate(changed: PropertyValues): void {
		super.willUpdate(changed)
		if (changed.has('checked') || changed.has('value') || changed.has('name')) {
			// Switch contributes `value` to FormData when on, nothing when off
			// (native checkbox semantics; overrides the mixin's scalar default).
			this.internals?.setFormValue(this.checked ? this.value : null)
			if (this.checked) this.internals?.states.add('checked')
			else this.internals?.states.delete('checked')
			// Mixin's value-changed branch won't fire `checkValidity` here
			// (validateOn: 'dirty' gate stays closed until checked diverges).
			// Sync platform validity explicitly so `form.checkValidity()` is
			// correct from first render.
			this.checkValidity()
		}
		if (changed.has('required') || changed.has('disabled')) {
			this.checkValidity()
		}
	}

	/** Override — switch validity is `checked === true` when required. */
	override checkValidity(): boolean {
		if (this.disabled) {
			this.internals?.setValidity({})
			return true
		}
		const isValid = !this.required || this.checked
		const message = isValid ? '' : 'This switch is required.'

		this.internals?.setValidity(
			isValid ? {} : { valueMissing: true },
			isValid ? undefined : message,
		)

		if (this._shouldShowError()) {
			this.error = !isValid
			this.validationMessage = message
		}
		return isValid
	}

	/** Override — emit only when the switch is on. */
	override toFormEntries(): Array<[string, FormDataEntryValue]> {
		if (!this.name || this.disabled || !this.checked) return []
		return [[this.name, this.value]]
	}

	override resetForm(): void {
		this.checked = this._checkedDefault
		super.resetForm()
	}

	private _toggle = () => {
		if (this.disabled) return
		this.checked = !this.checked
		this.markTouched()
		this.emitChange({ value: this.checked })
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
