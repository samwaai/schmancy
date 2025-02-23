import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceFill } from '@schmancy/surface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListTypeContext } from './context'

/**
 * @slot - The default slot.
 */
@customElement('schmancy-list')
export class List extends TailwindElement(css`
	:host {
		display: block;
		padding-top: 8px;
		padding-bottom: 8px;
	}

	:host(.scroller) {
		/*  The host scroller class */
		position: relative;
		contain: size layout;
		overflow: auto;
		scroll-smooth: auto; /*Add other scroll styles here*/
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
	surface: TSurfaceColor

	@property({ type: String, reflect: true })
	fill: SchmancySurfaceFill = 'auto'

	@property({ type: Boolean, reflect: true })
	scroller: boolean = false // New property: 'scroller'

	updated(changedProperties: Map<string | number | symbol, unknown>) {
		if (changedProperties.has('scroller')) {
			if (this.scroller) {
				this.classList.add('scroller') // Add the 'scroller' class
			} else {
				this.classList.remove('scroller') // Remove the 'scroller' class
			}
		}
	}

	render() {
		return html`
			<schmancy-surface .fill=${this.fill} type=${this.surface}>
				<ul>
					<slot></slot>
				</ul>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list': List
	}
}
