import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-list')
export class List extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`<ul class="py-[8px] bg-surface-default px-[12px]">
			<slot></slot>
		</ul>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list': List
	}
}
