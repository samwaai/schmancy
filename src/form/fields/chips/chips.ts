import { SchmancyFormField } from '@mixins/formField.mixin'
import { css, html, nothing, PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { fullWidth } from '../../../directives/layout'
import type { FilterChipChangeEvent as SchmancyChipChangeEvent } from './filter-chip'
import { SchmancyFilterChip as SchmancyChip } from './filter-chip'

export type SchmancyChipsChangeEvent = CustomEvent<{ value: string | string[] }>

@customElement('schmancy-chips')
export default class SchmancyChips extends SchmancyFormField(css`
:host {
	display: block;
	height: fit-content;
	width: fit-content;
}
`) {
	// FACE wiring (formAssociated, internals, attachInternals) comes from
	// SchmancyFormField. Same for: name, required, disabled, validationMessage,
	// validateOn, touched/dirty/pristine/submitted, markTouched/markSubmitted,
	// formResetCallback, formDisabledCallback, FIELD_CONNECT_EVENT dispatch,
	// emitChange(), checkValidity(), reportValidity(), setCustomValidity().

	/** Whether multiple chips can be selected simultaneously. */
	@property({ type: Boolean, reflect: true })
	multi: boolean = false

	// Override `value` with the chips-specific type and a custom getter/setter
	// pair backed by reactive subjects.
	@property({ reflect: false })
	override get value(): string | string[] {
		return this.multi
			? (this.values$?.value ?? [])
			: (this.value$?.value ?? '')
	}
	override set value(v: string | string[]) {
		const old = this.value
		if (this.multi) {
			const arr = Array.isArray(v)
				? v
				: v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []
			this.values$?.next(arr)
		} else {
			this.value$?.next(Array.isArray(v) ? (v[0] ?? '') : String(v ?? ''))
		}
		this.requestUpdate('value', old)
	}

	/** Typed convenience alias for multi-mode consumers. */
	get values(): string[] {
		return [...(this.values$?.value ?? [])]
	}
	set values(v: string[]) {
		this.values$?.next(Array.isArray(v) ? [...v] : [])
	}

	@property({ type: Boolean, reflect: true })
	wrap: boolean = false

	@property({ type: String, reflect: true })
	justify: 'start' | 'center' | 'end' = 'start'

	@queryAssignedElements({
		selector:
			'schmancy-chip, schmancy-filter-chip, schmancy-assist-chip, schmancy-input-chip, schmancy-suggestion-chip',
		flatten: true,
	})
	chips!: (SchmancyChip | HTMLElement)[]

	// Two internal streams — one for single mode, one for multi mode.
	private value$ = new BehaviorSubject<string>('')
	private values$ = new BehaviorSubject<string[]>([])

	protected override willUpdate(changedProps: PropertyValues): void {
		super.willUpdate(changedProps)
		// super handles the string path; fix the array path for multi mode.
		if (changedProps.has('value') && Array.isArray(this.value) && this.name) {
			const fd = new FormData()
			this.value.forEach(v => fd.append(this.name, v))
			this.internals?.setFormValue(fd)
		}
	}

	override checkValidity(): boolean {
		if (this.required && Array.isArray(this.value) && this.value.length === 0) {
			const msg = this.errorMessages?.valueMissing ?? 'This field is required'
			this.internals?.setValidity({ valueMissing: true }, msg)
			if (this.submitted || this.dirty || this.touched || this.validateOn === 'always') {
				this.error = true
				this.validationMessage = msg
			}
			return false
		}
		return super.checkValidity()
	}

	override connectedCallback() {
		super.connectedCallback()

		// Sync BehaviorSubjects with whatever value was set before connection.
		if (this.multi) {
			const cur = this.value
			this.values$.next(Array.isArray(cur) ? cur : [])
		} else {
			const cur = this.value
			this.value$.next(Array.isArray(cur) ? (cur[0] ?? '') : String(cur ?? ''))
		}

		combineLatest([
			this.value$.pipe(distinctUntilChanged()),
			this.values$.pipe(
				distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((v, i) => v === curr[i])),
			),
		])
			.pipe(
				debounceTime(0),
				takeUntil(this.disconnecting),
			)
			.subscribe(([value, values]) => {
				this.updateChipStates(value, values)
			})
	}

	private updateChipStates(value: string, values: string[]) {
		if (!this.chips) return

		this.chips.forEach(chip => {
			if ('value' in chip && 'selected' in chip) {
				const filterChip = chip as SchmancyChip
				if (this.multi) {
					filterChip.selected = values.length > 0 && values.includes(filterChip.value)
				} else {
					filterChip.selected = value !== '' && value === filterChip.value
				}
			}
		})
	}

	async change(e: CustomEvent<SchmancyChipChangeEvent>) {
		e.preventDefault()
		e.stopPropagation()

		const { value: chipValue, selected } = e.detail

		if (this.multi) {
			const old = this.value
			if (selected) {
				if (!this.values$.value.includes(chipValue)) {
					this.values$.next([...this.values$.value, chipValue])
				}
			} else {
				this.values$.next(this.values$.value.filter(v => v !== chipValue))
			}
			this.requestUpdate('value', old)
		} else {
			const old = this.value
			if (selected) {
				this.value$.next(chipValue)
			} else if (!this.required) {
				this.value$.next('')
			} else {
				// Required single-mode: ignore deselection attempt.
				return
			}
			this.requestUpdate('value', old)
		}

		this.emitChange({ value: this.multi ? this.values$.value : this.value$.value })
	}

	override resetForm(): void {
		super.resetForm()
		this.value$.next('')
		this.values$.next([])
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties)
		this.updateChipStates(this.value$.value, this.values$.value)
	}

	protected render(): unknown {
		const classes = {
			'flex flex-nowrap justify-center gap-2': true,
			'flex-wrap': this.wrap,
			'justify-center': this.justify === 'center',
		}
		const wrapperClasses = {
			'rounded-lg transition-all duration-200': true,
			'outline outline-2 outline-offset-4 outline-error-default': this.error,
		}
		return html`
			<div class="${this.classMap(wrapperClasses)}">
				<schmancy-scroll
					hide
					.direction=${this.wrap ? 'vertical' : 'horizontal'}
					class="${this.classMap(classes)}"
					${fullWidth()}
					@change=${this.change}
				>
					<slot
						@slotchange=${() => {
							this.updateChipStates(this.value$.value, this.values$.value)
						}}
					></slot>
				</schmancy-scroll>
			</div>

			${when(
				this.hint || (this.error && this.validationMessage),
				() => html`
					<div
						id="hint-${this.id}"
						class="mt-1 text-sm ${this.error ? 'text-error-default' : 'text-surface-onVariant'}"
						role=${ifDefined(this.error ? 'alert' : undefined)}
						aria-live="polite"
					>
						${this.error && this.validationMessage ? this.validationMessage : this.hint}
					</div>
				`,
				() => nothing,
			)}`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chips': SchmancyChips
	}
}
