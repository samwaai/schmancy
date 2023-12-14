import { provide } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListVariant, SchmancyListContext } from './context'

@customElement('schmancy-list')
export class List extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@provide({ context: SchmancyListContext })
	@property()
	variant: SchmancyListVariant = 'surface'

	render() {
		const classes = {
			'py-[8px]  px-[12px]': true,
			'bg-surface-default': this.variant === 'surface',
			'bg-surface-variant-default': this.variant === 'surfaceVariant',
			'bg-surface-container': this.variant === 'container',
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
