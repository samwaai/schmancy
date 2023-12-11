import { color } from '@schmancy/directives'
import TailwindElement from '@mhmo91/lit-mixins/src/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { SchmancyTheme } from '..'

@customElement('schmancy-container')
export class SchmancyContainer extends TailwindElement() {
	protected render(): unknown {
		return html`
			<div
				class="w-full h-full"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
				})}
			>
				<slot></slot>
			</div>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-container': SchmancyContainer
	}
}
