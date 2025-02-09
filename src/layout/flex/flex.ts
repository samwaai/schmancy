import { html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import Layout from '../layout/layout'
import style from './flex.scss?inline'

@customElement('schmancy-flex')
export class SchmancyFlex extends Layout {
	// Optionally, keep your global Layout styles plus this component's SCSS
	static styles = [Layout.styles, unsafeCSS(style)]

	// You mentioned "layout = true" in your base class; keep if needed
	layout = true

	/**
	 * The flex direction property:
	 *  - "row" | "row-reverse" | "col" | "col-reverse"
	 */
	@property({ type: String, reflect: true })
	flow: 'row' | 'row-reverse' | 'col' | 'col-reverse' = 'col'

	/**
	 * The flex-wrap property:
	 *  - "wrap" | "nowrap" | "wrap-reverse"
	 */
	@property({ type: String, reflect: true })
	wrap: 'wrap' | 'nowrap' | 'wrap-reverse' = 'wrap'

	/**
	 * Align-items property:
	 *  - "start" (flex-start), "center", "end" (flex-end), "stretch", "baseline"
	 */
	@property({ type: String, reflect: true })
	align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'start'

	/**
	 * Justify-content property:
	 *  - "start", "center", "end", "between"
	 *  (Note: "stretch" doesn't exist as a Tailwind justify- class;
	 *  for horizontal stretching, you typically rely on width or gap.)
	 */
	@property({ type: String, reflect: true })
	justify: 'start' | 'center' | 'end' | 'between' = 'start'

	/**
	 * Gap sizes:
	 *  - "none" (0), "sm" (2), "md" (4), "lg" (8)
	 *  (Feel free to add more if your Tailwind config has them.)
	 */
	@property({ type: String, reflect: true })
	gap: 'none' | 'sm' | 'md' | 'lg' = 'none'

	render() {
		// Build the Tailwind class map
		const classes = {
			// Always use "flex"
			flex: true,

			// Flow (direction)
			'flex-row': this.flow === 'row',
			'flex-row-reverse': this.flow === 'row-reverse',
			'flex-col': this.flow === 'col',
			'flex-col-reverse': this.flow === 'col-reverse',

			// Wrap
			'flex-wrap': this.wrap === 'wrap',
			'flex-nowrap': this.wrap === 'nowrap',
			'flex-wrap-reverse': this.wrap === 'wrap-reverse',

			// Align-items
			'items-start': this.align === 'start',
			'items-center': this.align === 'center',
			'items-end': this.align === 'end',
			'items-stretch': this.align === 'stretch',
			'items-baseline': this.align === 'baseline',

			// Justify-content
			'justify-start': this.justify === 'start',
			'justify-center': this.justify === 'center',
			'justify-end': this.justify === 'end',
			'justify-between': this.justify === 'between',
			// (No standard Tailwind "justify-stretch".)

			// Gap
			'gap-0': this.gap === 'none',
			'gap-2': this.gap === 'sm',
			'gap-4': this.gap === 'md',
			'gap-8': this.gap === 'lg',
		}

		// You can use styleMap for inline style overrides if needed
		const inlineStyles = {}

		return html`
			<section class=${this.classMap(classes)} style=${styleMap(inlineStyles)}>
				<slot></slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-flex': SchmancyFlex
	}
}
