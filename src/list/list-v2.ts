import '@lit-labs/virtualizer' // uncomment this line to use lit-virtualizer
import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceFill } from '@schmancy/surface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyListTypeContext } from './context'

/**
 * `<sch-list>` component.
 *
 * A list component that wraps its content within a customizable surface.
 * It allows you to set the surface type and fill style, and can optionally
 * enable scrolling behavior by delegating the scroller attribute to the surface.
 *
 * @element sch-list
 * @slot - The default slot for list items.
 *
 * @example
 * <sch-list surface="container">
 *   <sch-list-item>List Item 1</sch-list-item>
 * </sch-list>
 */
@customElement('sch-list')
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

	@property({ type: Array })
	items: any[] = []

	/**
	 * Renders the component's template.
	 * The list content is wrapped inside a `<schmancy-surface>` element.
	 *
	 * @returns The HTML template for the component.
	 */
	render() {
		return html`
			<schmancy-surface .elevation=${this.elevation} .fill=${this.fill} type=${this.surface}>
				<schmancy-surface fill="all" type="container" rounded="all" elevation="2">
					<lit-virtualizer
						class="h-full w-full"
						scroller
						.items=${this.items}
						.renderItem=${() => html`<slot></slot>` as TemplateResult}
					></lit-virtualizer>
				</schmancy-surface>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-list': List
	}
}
