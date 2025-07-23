import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-chip')
export default class SchmancyChip extends TailwindElement(css`
	/* Allow content to be styled with Tailwind classes */
	:host {
		display: inline-block;
	}
`) {
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
				@click=${() => {
					if (this.readOnly) {
						return
					}
					// Toggle selection and dispatch a change event
					this.selected = !this.selected
					this.dispatchEvent(
						new CustomEvent('change', {
							detail: { value: this.value, selected: this.selected },
							bubbles: true,
						}),
					)
				}}
				?selected=${this.selected}
				?disabled=${this.disabled}
			>
				<slot></slot>
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
