import { html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import Layout from '../layout/layout'
import style from './flex.scss?inline'
@customElement('schmancy-flex')
export class SchmancyFlex extends Layout {
	static styles = [Layout.styles, unsafeCSS(style)]
	layout = true
	@property({ type: String, reflect: true }) flow: 'row' | 'row-reverse' | 'col' | 'col-reverse' = 'col'
	@property({ type: String, reflect: true }) wrap: 'wrap' | 'nowrap' | 'wrap-reverse' = 'wrap'
	@property({ type: String, reflect: true }) align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'start'
	@property({ type: String, reflect: true }) justify: 'start' | 'center' | 'end' | 'stretch' = 'start'
	@property({ type: String, reflect: true }) gap: string | undefined

	render() {
		const classes = {
			flex: true,
			// Direction
			'flex-col': this.flow === 'row',
			'flex-col-reverse': this.flow === 'row-reverse',
			'flex-row': this.flow === 'col',
			'flex-row-reverse': this.flow === 'col-reverse',
			// Wrap
			'flex-wrap': this.wrap === 'wrap',
			'flex-wrap-reverse': this.wrap === 'wrap-reverse',
			'flex-nowrap': this.wrap === 'nowrap',
			// Align
			'items-start': this.align === 'start',
			'items-center': this.align === 'center',
			'items-end': this.align === 'end',
			'items-stretch': this.align === 'stretch',
			'justify-baseline': this.align === 'baseline',

			// Justify
			'justify-center': this.justify === 'center',
			'justify-end': this.justify === 'end',
			'justify-start': this.justify === 'start',
			'justify-stretch': this.justify === 'stretch',
		}

		const styles = {
			gap: this.gap,
		}
		return html`
			<section class=${classMap(classes)} style=${styleMap(styles)}>
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
