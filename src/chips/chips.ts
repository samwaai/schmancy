import { $LitElement } from '@mixins/index'
import { css, html, PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { BehaviorSubject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import type { FilterChipChangeEvent as SchmancyChipChangeEvent } from './filter-chip'
import { SchmancyFilterChip as SchmancyChip } from './filter-chip'

@customElement('schmancy-chips')
export default class SchmancyChips extends $LitElement(css`
	:host {
		display: block;
	}

	:host([wrap]) section {
		flex-wrap: wrap;
	}

	:host(:not([wrap])) section {
		overflow-x: auto;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	:host(:not([wrap])) section::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}

	section {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
`) {
	// RxJS state streams
	private value$ = new BehaviorSubject<string>('')
	private values$ = new BehaviorSubject<string[]>([])

	private _value: string = ''
	private _values: string[] = []
	private _multi: boolean = false

	/**
	 * @deprecated Use .values for multi-selection or .value for single-selection instead.
	 * The mode is now automatically determined based on which property is used.
	 */
	@property({ type: Boolean, reflect: true })
	get multi(): boolean {
		return this._multi
	}
	set multi(value: boolean) {
		this._multi = value
	}

	private get mode(): 'multi' | 'single' | 'none' {
		if (this._values.length > 0 || this.hasAttribute('values')) return 'multi'
		if (this._value || this.hasAttribute('value')) return 'single'
		if (this._multi) return 'multi'
		return 'none'
	}

	@property({ type: Array, reflect: true })
	get values(): string[] {
		return this._values
	}
	set values(value: string[]) {
		this._values = value || []
		this.values$.next(this._values)
	}

	@property({ type: String, reflect: true })
	get value(): string {
		return this._value
	}
	set value(value: string) {
		this._value = value || ''
		this.value$.next(this._value)
	}

	@queryAssignedElements({
		selector: 'schmancy-chip, schmancy-filter-chip, schmancy-assist-chip, schmancy-input-chip, schmancy-suggestion-chip',
		flatten: true,
	})
	chips!: (SchmancyChip | HTMLElement)[]

	@property({ type: Boolean, reflect: true })
	wrap: boolean = false

	connectedCallback() {
		super.connectedCallback()
		this.value$.next(this._value)
		this.values$.next(this._values)

		const mode = this.mode
		if (mode === 'multi') {
			this.values$.pipe(
				distinctUntilChanged((p, c) => p.length === c.length && p.every((v, i) => v === c[i])),
				debounceTime(0),
				takeUntil(this.disconnecting)
			).subscribe(v => this.updateChipStates(v))
		} else if (mode === 'single') {
			this.value$.pipe(
				distinctUntilChanged(),
				debounceTime(0),
				takeUntil(this.disconnecting)
			).subscribe(v => this.updateChipStates(v))
		}
	}

	private updateChipStates(selection: string | string[]) {
		if (!this.chips) return

		const mode = this.mode
		if (mode === 'none') return

		this.chips.forEach(chip => {
			if (!('value' in chip && 'selected' in chip)) return
			const fc = chip as SchmancyChip
			if (mode === 'multi') {
				const vals = selection as string[]
				fc.selected = vals.length > 0 && vals.includes(fc.value)
			} else {
				fc.selected = selection !== '' && selection === fc.value
			}
		})
	}

	change(e: CustomEvent<SchmancyChipChangeEvent>) {
		e.preventDefault()
		e.stopPropagation()
		const mode = this.mode
		if (mode === 'none') return

		const { value, selected } = e.detail
		if (mode === 'multi') {
			this._values = selected
				? [...new Set([...this._values, value])]
				: this._values.filter(v => v !== value)
			this.values$.next(this._values)
		} else {
			this._value = selected ? value : ''
			this.value$.next(this._value)
		}

		this.dispatchEvent(
			new CustomEvent<SchmancyChipsChangeEvent>('change', {
				detail: mode === 'multi' ? this._values : this._value,
				bubbles: true,
			})
		)
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties)
		const mode = this.mode
		if (mode === 'multi') this.updateChipStates(this._values)
		else if (mode === 'single') this.updateChipStates(this._value)
	}

	protected render(): unknown {
		return html`
			<section @change=${this.change}>
				<slot @slotchange=${() => {
					const mode = this.mode
					if (mode === 'multi') this.updateChipStates(this._values)
					else if (mode === 'single') this.updateChipStates(this._value)
				}}></slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chips': SchmancyChips
	}
}
export type SchmancyChipsChangeEvent = string | Array<string>
