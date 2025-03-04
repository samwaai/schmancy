import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-sheet-header')
export default class SchmancySheetHeader extends TailwindElement(css``) {
	render() {
		return html`
			<sch-flex class="absolute top-0 left-0 md:left-[unset] md:right-0">
				<div class="block md:hidden flex-1 justify-start items-start">
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
				</div>

				<div class="hidden md:block flex-1 justify-end items-end">
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
				</div>
			</sch-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet-header': SchmancySheetHeader
	}
}
