import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import { $LitElement } from '@mixins/index'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-chip')
export default class SchmancyChip extends $LitElement() {
	// Removed unused query for md-chip-set

	@property({ type: String, reflect: true })
	label: string = ''

	@property({ type: String, reflect: true })
	value: string = ''

	@property({ type: Boolean, reflect: true })
	selected: boolean = false

	@property({ type: String, reflect: true })
	icon: string = ''

	@property({ type: Boolean, reflect: true })
	readOnly: boolean = false

	@property({ type: Boolean, reflect: true })
	disabled: boolean = false
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
	internals: ElementInternals | undefined
	get form() {
		return this.internals?.form
	}

	protected render(): unknown {
		return html`
			<md-filter-chip
				.disabled=${this.disabled}
				label="${this.label}"
				@click=${(_e: Event) => {
					if (this.readOnly) {
						return
					}
					// Toggle selection and dispatch a change event
					this.selected = !this.selected
					this.dispatchEvent(
						new CustomEvent<SchmancyChipChangeEvent>('change', {
							detail: { value: this.value, selected: this.selected },
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
