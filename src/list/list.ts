import { provide } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListType, SchmancyListTypeContext } from './context'

/**
 * @slot - The default slot.
 */
@customElement('schmancy-list')
export class List extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	/**
	 * The type of list.
	 * @attr type
	 * @type {SchmancyListType}
	 * @default 'surface'
	 */
	@provide({ context: SchmancyListTypeContext })
	@property()
	type: SchmancyListType = 'surface'

	render() {
		const classes = {
			'py-[8px]': true,
			'bg-surface-default': this.type === 'surface',
			'bg-surface-variant-default': this.type === 'surfaceVariant',
			'bg-surface-container': this.type === 'container',
		}
		return html`<ul class="${this.classMap(classes)}">
			<slot></slot>
		</ul>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list': List
	}
}
