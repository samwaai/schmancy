import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceFill } from '@schmancy/surface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { SchmancyListTypeContext } from './context'

/**
 * `<schmancy-list>` component.
 *
 * A list component that wraps its content within a customizable surface.
 * It allows you to set the surface type and fill style, and can optionally
 * enable scrolling behavior using the `scroller` property.
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

	/* When the ul element has the "scroller" class, apply scrolling behavior */
	ul.scroller {
		position: relative;
		contain: size layout;
		overflow: auto;
		scroll-behavior: smooth;
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
	 * When set to true, the component renders its list content with scrollable behavior.
	 * This is achieved by conditionally adding the 'scroller' CSS class to the <ul> element.
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
	 * The list content is wrapped inside a `<schmancy-surface>` element for consistent styling.
	 * The <ul> element conditionally receives the "scroller" class based on the `scroller` property.
	 *
	 * @returns The HTML template for the component.
	 */
	render() {
		return html`
			<schmancy-surface .elevation=${this.elevation} .fill=${this.fill} type=${this.surface}>
				<ul class=${classMap({ scroller: this.scroller })}>
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
