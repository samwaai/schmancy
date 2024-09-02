import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import { ChipSet } from '@material/web/chips/internal/chip-set'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { html, PropertyValues } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import SchmancyChip, { SchmancyChipChangeEvent } from './chip'

@customElement('schmancy-chips')
export default class SchmancyChips extends $LitElement() {
	@query('md-chip-set') chipSet!: ChipSet

	@property({
		type: Boolean,
		reflect: true,
	})
	multi = false

	@property({
		type: Array,
		reflect: true,
	})
	values: string[] = []

	@property({
		type: String,
		reflect: true,
	})
	value: string = ''

	@queryAssignedElements({
		selector: 'schmancy-chip',
		flatten: true,
	})
	chips!: SchmancyChip[]

	async change(e: CustomEvent<SchmancyChipChangeEvent>) {
		e.preventDefault()
		e.stopPropagation()
		const target = e.target as SchmancyChip
		const { value, selected } = e.detail
		if (this.multi) {
			if (selected) {
				this.values = [...this.values, value]
				// find the chip that was selected
				const chip = this.chips.find(c => c.value === value)
				// if it exists, select it
				if (chip) chip.selected = true
			} else {
				this.values = this.values.filter(v => v !== value)
				// find the chip that was deselected
				const chip = this.chips.find(c => c.value === value)
				// if it exists, deselect it
				if (chip) chip.selected = false
			}
			this.requestUpdate()
		} else {
			this.value = target.value
			this.chips.forEach(c => {
				if (c.value === target.value) c.selected = true
				else c.removeAttribute('selected')
			})
			this.requestUpdate()
		}
		this.dispatchEvent(
			new CustomEvent<SchmancyChipsChangeEvent>('change', {
				detail: this.multi ? this.values : this.value,
				bubbles: true,
			}),
		)
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties)
		this.chips.forEach(chip => {
			if (this.multi) {
				if (this.values.includes(chip.value)) chip.selected = true
			} else {
				if (this.value === chip.value) chip.selected = true
			}
		})
	}

	protected render(): unknown {
		return html` <md-chip-set @change=${this.change}>
			<slot></slot>
		</md-chip-set>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chips': SchmancyChips
	}
}
export type SchmancyChipsChangeEvent = string | Array<string>
