import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import Layout from '../layout/layout'

@customElement('sch-grid')
export class SchmancyGridV2 extends Layout {
	static styles = [
		Layout.styles,
		css`
			:host {
				display: block;
			}
		`,
	]

	/**
	 * Display mode: 'grid' or 'inline-grid'.
	 */
	@property({ type: String, reflect: true })
	display: 'grid' | 'inline-grid' = 'grid'

	/**
	 * Grid template columns.
	 * Examples: '1', '2', '3', 'none', 'subgrid', '[200px_minmax(900px,_1fr)_100px]'
	 */
	@property({ type: String, reflect: true })
	columns: string = 'none'

	/**
	 * Grid template rows.
	 * Examples: '1', '2', '3', 'none', 'subgrid', '[200px_minmax(900px,_1fr)_100px]'
	 */
	@property({ type: String, reflect: true })
	rows: string = 'none'

	/**
	 * Grid auto flow.
	 * Options: 'row', 'column', 'dense', 'row-dense', 'column-dense'
	 */
	@property({ type: String, reflect: true })
	flow: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense' = 'row'

	/**
	 * Gap between grid items.
	 * Examples: '0', '1', '2', '4', '8', '16', '32', '64'
	 */
	@property({ type: String, reflect: true })
	gap: string = '0'

	/**
	 * Gap between columns.
	 * Overrides the general gap if specified.
	 */
	@property({ type: String, reflect: true })
	gapX?: string

	/**
	 * Gap between rows.
	 * Overrides the general gap if specified.
	 */
	@property({ type: String, reflect: true })
	gapY?: string

	/**
	 * Responsive variants.
	 * Example: { sm: 'grid-cols-2', md: 'grid-cols-4' }
	 */
	@property({ type: Object })
	responsive: { [key: string]: string } = {}

	render() {
		const classes = [
			this.display === 'inline-grid' ? 'inline-grid' : 'grid',
			this.columns !== 'none' ? `grid-cols-${this.columns}` : '',
			this.rows !== 'none' ? `grid-rows-${this.rows}` : '',
			`grid-flow-${this.flow}`,
			this.gap ? `gap-${this.gap}` : '',
			this.gapX ? `gap-x-${this.gapX}` : '',
			this.gapY ? `gap-y-${this.gapY}` : '',
			...Object.entries(this.responsive).map(([breakpoint, utility]) => `${breakpoint}:${utility}`),
		]
			.filter(Boolean)
			.join(' ')

		return html`<div class="${classes}"><slot></slot></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-grid': SchmancyGridV2
	}
}
