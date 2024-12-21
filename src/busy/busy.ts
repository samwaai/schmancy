import { SchmancyTheme } from '@schmancy/theme'
import { color } from '@schmancy/directives'
import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-busy')
export default class SchmancyBusy extends TailwindElement(css`
	:host {
		display: inline;
		position: absolute;
		inset: 0;
	}
`) {
	protected render(): unknown {
		return html`
			<div class="absolute inset-0 flex justify-center items-center animate-pulse">
				<!-- glass window -->
				<div
					${color({
						bgColor: SchmancyTheme.sys.color.secondary.container,
						color: SchmancyTheme.sys.color.tertiary.onContainer,
					})}
					class="absolute transform-gpu inset-0 rounded-[inherit]   opacity-50 flex align-middle justify-center items-center "
				>
					<slot> </slot>
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
