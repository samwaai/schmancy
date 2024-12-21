import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import { ChipSet } from '@material/web/chips/internal/chip-set'
import { $LitElement } from '@mixins/lit'
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
			const { value, selected } = e.detail
			this.value = selected ? value : ''
			const chip = this.chips.find(c => c.value === value)
			if (selected) chip.selected = selected
			else chip.selected = false
			// deselect all other chips
			this.chips.forEach(c => {
				if (this.value && this.value === c.value) c.selected = true
				else c.selected = false
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
		this.hydrateTabs()
	}

	// when value changes, update the selected chip
	// protected updated(_changedProperties: PropertyValues): void {
	// 	super.updated(_changedProperties)
	// 	if (_changedProperties.has('value')) {
	// 		this.chips.forEach(chip => {
	// 			chip.selected = chip.value === this.value
	// 			if (chip.selected) chip.setAttribute('selected', '')
	// 			else chip.removeAttribute('selected')
	// 		})
	// 	}
	// }

	// attribute changes
	// when values change, update the selected chips
	attributeChangedCallback(name: string, old: string, value: string): void {
		super.attributeChangedCallback(name, old, value)
		if (name === 'values') {
			this.hydrateTabs()
		} else if (name === 'value') {
			this.hydrateTabs()
		}
	}

	hydrateTabs() {
		this.chips.forEach(chip => {
			if (this.multi) {
				if (this.values.includes(chip.value)) chip.selected = true
				else chip.selected = false
			} else {
				if (this.value === chip.value) chip.selected = true
				else chip.selected = false
			}
		})
	}

	protected render(): unknown {
		return html` <md-chip-set @change=${this.change}>
			<slot @slotchange=${() => this.hydrateTabs()}></slot>
		</md-chip-set>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chips': SchmancyChips
	}
}
export type SchmancyChipsChangeEvent = string | Array<string>
