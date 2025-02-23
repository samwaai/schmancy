import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceFill } from '@schmancy/surface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListTypeContext } from './context'
import { classMap } from 'lit/directives/class-map.js' // Import classMap

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

	render() {
		const ulClasses = {
			'overflow-auto': this.scroller,
			relative: this.scroller,
			'contain-[size_layout]': this.scroller,
			//Add any classes, when the scroll is active, you can style this as a scroll
			'scroll-smooth': this.scroller,
		}

		return html`
			<schmancy-surface .fill=${this.fill} type=${this.surface}>
				<ul class="${classMap(ulClasses)}">
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
