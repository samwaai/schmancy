import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-sheet-header')
export default class SchmancySheetHeader extends TailwindElement() {
	@property() title: string
	render() {
		const classes = {
			absolute: this.title.length === 0,
			relative: this.title.length > 0,
		}
		return html`
			<schmancy-surface elevation="1">
				<schmancy-grid class="${this.classMap(classes)}" align="center" justify="stretch" cols="auto 1fr auto">
					<slot name="back">
						<schmancy-button
							@click=${() => {
								this.dispatchEvent(
									new CustomEvent('dismiss', {
										bubbles: true,
										composed: true,
									}),
								)
							}}
						>
							<span class="text-[24px]">&#8592; </span>
						</schmancy-button>
					</slot>
					<schmancy-typography transform="capitalize" type="headline" token="lg"> ${this.title} </schmancy-typography>
					<slot name="actions">
						<schmancy-icon-button
							@click=${() => {
								this.dispatchEvent(
									new CustomEvent('dismiss', {
										bubbles: true,
										composed: true,
									}),
								)
							}}
						>
							close
						</schmancy-icon-button>
					</slot>
				</schmancy-grid>
			</schmancy-surface>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet-header': SchmancySheetHeader
	}
}
