import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-busy')
export default class SchmancyBusy extends TailwindElement(css`
	:host {
		display: inline;
		position: absolute;
		inset: 0;
		pointer-events: all;
		z-index: 50;
	}
`) {
	protected render(): unknown {
		return html`
			<!-- Clean overlay with subtle backdrop -->
			<div class="absolute inset-0 flex items-center justify-center bg-surface-container/60 backdrop-blur-sm rounded-[inherit]">
				<!-- Content container with clean surface -->
				<div class="relative flex items-center justify-center p-4">
					<!-- Optional background card for content -->
					<div class="absolute inset-0 bg-surface rounded-2xl shadow-sm"></div>
					
					<!-- Content slot -->
					<div class="relative z-10">
						<slot>
							<!-- Default spinner if no content provided -->
							<schmancy-spinner size="32px"></schmancy-spinner>
						</slot>
					</div>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-busy': SchmancyBusy
	}
}