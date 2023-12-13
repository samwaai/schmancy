import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-list')
export class List extends TailwindElement() {
	render() {
		return html`<ul class="py-[8px]">
			<slot></slot>
		</ul>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list': List
	}
}
