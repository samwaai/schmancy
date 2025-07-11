import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-busy')
export default class SchmancyBusy extends TailwindElement(css`
	:host {
		display: inline;
		position: absolute;
		inset: 0;
		--tw-gradient-from-position:  ;
		--tw-gradient-via-position:  ;
		--tw-gradient-to-position:  ;
	}
`) {
	protected render(): unknown {
		return html`
			<div class="absolute inset-0 flex justify-center items-center z-[9999999]">
				<!-- Apple visionOS-style glass effect with multiple layers -->
				<div
					class="absolute transform-gpu inset-0 rounded-[inherit] flex align-middle justify-center items-center 
						   backdrop-blur-2xl backdrop-saturate-150 bg-white/10 dark:bg-black/10
						   shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] 
						   border border-white/20 dark:border-white/10"
				>
					<!-- Additional subtle inner glow for depth -->
					<div class="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/5 to-transparent"></div>
					
					<!-- Content slot with subtle animation -->
					<div class="relative animate-pulse">
						<slot></slot>
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
