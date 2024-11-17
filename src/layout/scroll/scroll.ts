import { TailwindElement } from '@mhmo91/lit-mixins/src'

import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-scroll')
export class SchmancyScroll extends TailwindElement(css`
	:host {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-shadow: border-box;
		display: block;
		position: relative;
		inset: 0px;
	}
`) {
	render() {
		return html` <div class="relative inset-0 h-full w-full overscroll-none">
			<div class="h-full w-full inset-0 overflow-x-scroll overflow-y-scroll scroll-smooth overscroll-contain">
				<slot></slot>
			</div>
		</div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-scroll': SchmancyScroll
	}
}
