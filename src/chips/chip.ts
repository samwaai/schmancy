import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import { ChipSet } from '@material/web/chips/internal/chip-set'
import { $LitElement } from '@mixins/lit'
import { html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('schmancy-chip')
export default class SchmancyChip extends $LitElement() {
	@query('md-chip-set') chipSet!: ChipSet
	@property({
		type: String,
		reflect: true,
	})
	label: string = ''

	@property({
		type: String,
		reflect: true,
	})
	value: string = ''

	@property({
		type: Boolean,
		reflect: true,
	})
	selected: boolean = false

	@property({
		type: String,
		reflect: true,
	})
	icon: string = ''

	protected render(): unknown {
		return html`
			<md-filter-chip
				id="done"
				label="${this.label}"
				@click=${() => {
					this.selected = !this.selected
					this.dispatchEvent(
						new CustomEvent<SchmancyChipChangeEvent>('change', {
							detail: {
								value: this.value,
								selected: this.selected,
							},
							bubbles: true,
						}),
					)
				}}
				?selected=${this.selected}
			>
				${this.icon}
			</md-filter-chip>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-chip': SchmancyChip
	}
}
export type SchmancyChipChangeEvent = { value: string; selected: boolean }
