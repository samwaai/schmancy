import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceFill } from '@schmancy/surface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListTypeContext } from './context'

/**
 * `<schmancy-list>` component.
 *
 * A list component that wraps its content within a customizable surface.
 * It allows you to set the surface type and fill style, and can optionally
 * enable scrolling behavior by delegating the scroller attribute to the surface.
 *
 * @element schmancy-list
 * @slot - The default slot for list items.
 *
 * @example
 * <schmancy-list surface="container" scroller>
 *   <schmancy-list-item>List Item 1</schmancy-list-item>
 * </schmancy-list>
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
	 * Defines the type or color of the surface used by the component.
	 * This value is provided to descendant components via context.
	 *
	 * @attr surface
	 * @type {TSurfaceColor}
	 * @default 'surface'
	 */
	@provide({ context: SchmancyListTypeContext })
	@property()
	surface: TSurfaceColor

	/**
	 * Determines the fill style of the underlying surface.
	 *
	 * @attr fill
	 * @type {SchmancySurfaceFill}
	 * @default 'auto'
	 */
	@property({ type: String, reflect: true })
	fill: SchmancySurfaceFill = 'auto'

	/**
	 * When set to true, the surface component will handle scrolling behavior.
	 * This is achieved by passing the boolean attribute to <schmancy-surface>.
	 *
	 * @attr scroller
	 * @type {boolean}
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	scroller: boolean = false

	/**
	 * Defines the elevation level of the surface.
	 *
	 * @attr elevation
	 * @type {number}
	 * @default 0
	 */
	@property({ type: Number })
	elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	/**
	 * Renders the component's template.
	 * The list content is wrapped inside a `<schmancy-surface>` element.
	 * The scroller property is delegated to the surface so that it controls
	 * the scrollable behavior.
	 *
	 * @returns The HTML template for the component.
	 */
	render() {
		return html`
			<schmancy-surface .elevation=${this.elevation} .fill=${this.fill} type=${this.surface} ?scroller=${this.scroller}>
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
