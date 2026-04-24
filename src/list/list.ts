import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceFill } from '@schmancy/surface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListTypeContext } from './context'

/**
 * Wrapped list container — holds schmancy-list-item children on a themed surface. Optionally scrollable.
 *
 * @element schmancy-list
 * @summary Use for vertical lists of similarly-shaped items: settings entries, menu items, contact lists, notification lists. Pair with schmancy-list-item children.
 * @example
 * <schmancy-list surface="container" scroller>
 *   <schmancy-list-item>First</schmancy-list-item>
 *   <schmancy-list-item>Second</schmancy-list-item>
 *   <schmancy-list-item>Third</schmancy-list-item>
 * </schmancy-list>
 * @platform ul - Styled list container. Degrades to a plain ul/div if the tag never registers.
 * @slot - The default slot for list items.
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
			<schmancy-surface .elevation=${this.elevation} .fill=${this.fill} type=${this.surface}>
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
