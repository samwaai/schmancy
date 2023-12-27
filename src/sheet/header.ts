import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-sheet-header')
export default class SchmancySheetHeader extends TailwindElement(css`
	:host {
		display: block;
		padding-bottom: 16px;
	}
`) {
	render() {
		return html`
			<schmancy-grid align="center" justify="stretch" cols="auto 1fr auto">
				<slot name="back">
					<schmancy-button
						@click=${() => {
							this.dispatchEvent(
								new CustomEvent('sheetDismiss', {
									bubbles: true,
									composed: true,
								}),
							)
						}}
					>
						<span class="text-[24px]">&#8592; </span>
					</schmancy-button>
				</slot>
				<schmancy-typography transform="capitalize" type="headline" token="lg">
					<slot></slot>
				</schmancy-typography>
				<slot name="actions">
					<schmancy-button
						@click=${() => {
							this.dispatchEvent(
								new CustomEvent('sheetDismiss', {
									bubbles: true,
									composed: true,
								}),
							)
						}}
					>
						<span class="text-[24px]">✕</span>
					</schmancy-button>
				</slot>
			</schmancy-grid>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet-header': SchmancySheetHeader
	}
}
