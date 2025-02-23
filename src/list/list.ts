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

	:host(.scroller) {
		position: relative;
		contain: size layout;
		overflow: auto;
		scroll-behavior: smooth; /* Additional scroll-related styles can be added here */
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
	 * When set to true, the component is rendered with scrollable behavior.
	 * This is achieved by toggling the 'scroller' CSS class.
	 *
	 * @attr scroller
	 * @type {boolean}
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	scroller: boolean = false // New property: 'scroller'

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
	 * Lifecycle method called when component properties are updated.
	 * Monitors changes to the `scroller` property and toggles the corresponding CSS class.
	 *
	 * @param changedProperties A map of the properties that have changed.
	 */
	updated(changedProperties: Map<string | number | symbol, unknown>): void {
		if (changedProperties.has('scroller')) {
			if (this.scroller) {
				this.classList.add('scroller') // Add the 'scroller' class for scrollable behavior.
			} else {
				this.classList.remove('scroller') // Remove the 'scroller' class.
			}
		}
	}

	/**
	 * Renders the component's template.
	 * The list content is wrapped inside a `<schmancy-surface>` element to apply consistent styling.
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
