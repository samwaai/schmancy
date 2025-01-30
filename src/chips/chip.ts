import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import { ChipSet } from '@material/web/chips/internal/chip-set'
import { $LitElement } from '@mixins/index'
import { html, LitElement } from 'lit'
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

	constructor() {
		super()
		try {
			this.internals = this.attachInternals()
		} catch {
			this.internals = undefined
		}
	}
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}
	static formAssociated = true
	// private internals
	internals: ElementInternals | undefined
	get form() {
		return this.internals?.form
	}

	protected render(): unknown {
		return html`
			<md-filter-chip
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
