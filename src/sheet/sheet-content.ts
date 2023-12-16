import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-sheet-content')
export default class SchmancySheetContent extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
		inset: 0;
		max-width: 100vw;
		max-height: 100vh;
		overflow: scroll;
	}
`) {
	/**
	 * color of the component
	 * @type {'primary' | 'secondary'}
	 * @attr
	 * @default 'primary'
	 * @description primary: white background, secondary: grey background
	 */
	@property({ type: String }) color: 'primary' | 'secondary' = 'primary'

	render() {
		return html`
			<schmancy-grid align="center" justify="stretch" cols="auto 1fr auto">
				<schmancy-button
					@click=${() => {
						this.dispatchEvent(
							new CustomEvent('bottomSheetCloseRequested', {
								bubbles: true,
								composed: true,
							}),
						)
					}}
				>
					<span class="text-[24px]">&#8592; </span>
				</schmancy-button>
				<schmancy-typography transform="capitalize" type="headline" token="lg">
					<slot name="title">Title</slot>
				</schmancy-typography>
				<schmancy-button
					@click=${() => {
						this.dispatchEvent(
							new CustomEvent('bottomSheetCloseRequested', {
								bubbles: true,
								composed: true,
							}),
						)
					}}
				>
					<span class="text-[24px]">✕</span>
				</schmancy-button>
			</schmancy-grid>

			<div class="overflow-scroll transition-all  p-[24px]" tabindex="0">
				<slot></slot>
			</div>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet-content': SchmancySheetContent
	}
}
