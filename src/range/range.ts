import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { SchmancyFormField } from '@mixins/index'

export type SchmancyRangeChangeEvent = CustomEvent<{ value: number }>

/**
 * @element schmancy-range
 * Range input (numeric slider).
 * @fires change - Fires on value change with `{ value: number }`.
 */
@customElement('schmancy-range')
export class SchmancyRange extends SchmancyFormField(css`
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: linear-gradient(
			to right,
			var(--color-primary, #6750a4) 0%,
			var(--color-primary, #6750a4) var(--range-progress, 0%),
			color-mix(in srgb, var(--color-primary, #6750a4) 30%, transparent) var(--range-progress, 0%),
			color-mix(in srgb, var(--color-primary, #6750a4) 30%, transparent) 100%
		);
		outline: none;
		cursor: pointer;
	}
	input[type='range']:disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-primary, #6750a4);
		cursor: pointer;
		transition: box-shadow 0.1s ease;
	}
	input[type='range']::-webkit-slider-thumb:hover {
		box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-primary, #6750a4) 12%, transparent);
	}
	input[type='range']::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		background: var(--color-primary, #6750a4);
		cursor: pointer;
	}
`) {
	// `formAssociated`, `internals`, `name`, `disabled`, `required`, `id`,
	// `label`, `error`, `validationMessage`, `validateOn`, touched/dirty/submitted,
	// `markTouched/markSubmitted`, `formResetCallback`, FIELD_CONNECT_EVENT
	// dispatch — all from the mixin.

	@property({ type: Number }) min: number = 0
	@property({ type: Number }) max: number = 1
	@property({ type: Number }) step: number = 0.01

	/** Numeric value — narrowed override of the mixin's wide value union. */
	@property({ type: Number, reflect: true })
	override value: number = 0

	private get progress(): string {
		return `${((this.value - this.min) / (this.max - this.min)) * 100}%`
	}

	override willUpdate(changed: PropertyValues): void {
		super.willUpdate(changed)
		if (changed.has('value') || changed.has('name')) {
			this.internals?.setFormValue(String(this.value))
		}
	}

	/** FormData contributes the value as a string (native range input convention). */
	override toFormEntries(): Array<[string, FormDataEntryValue]> {
		if (!this.name || this.disabled) return []
		return [[this.name, String(this.value)]]
	}

	render() {
		return html`
			<div class="flex flex-col gap-1 w-full">
				${when(
					this.label,
					() => html`
						<div class="flex justify-between items-center">
							<schmancy-typography type="label" token="sm" class="text-surface-on">${this.label}</schmancy-typography>
							<schmancy-typography type="label" token="sm" class="text-surface-on opacity-60">${this.value}</schmancy-typography>
						</div>
					`,
				)}
				<input
					type="range"
					.min=${String(this.min)}
					.max=${String(this.max)}
					.step=${String(this.step)}
					.value=${String(this.value)}
					?disabled=${this.disabled}
					style="--range-progress: ${this.progress}"
					@input=${(e: Event) => {
						this.value = Number((e.target as HTMLInputElement).value)
						this.markTouched()
						this.emitChange({ value: this.value })
					}}
				/>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-range': SchmancyRange
	}
}
