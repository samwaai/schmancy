import anime from 'animejs/lib/anime.es.js'
import { html, unsafeCSS } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import Layout from '../layout/layout'
import style from './grid.scss?inline'

@customElement('schmancy-grid')
export class SchmancyGrid extends Layout {
	static styles = [Layout.styles, unsafeCSS(style)]
	layout = true
	@property({ type: String }) flow: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense' = 'row'
	@property({ type: String }) align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'stretch'
	@property({ type: String }) justify: 'start' | 'center' | 'end' | 'stretch' = 'stretch'
	@property({ type: String }) gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' = 'none'
	@property({ type: String }) cols?: string
	@property({ type: String }) rows?: string
	@property({ type: Object }) anime: anime.AnimeParams = {}
	@property({ type: Boolean }) wrap = false

	@queryAssignedElements() assignedElements!: HTMLElement[]

	firstUpdated() {
		anime({
			targets: this.assignedElements,
			...this.anime,
		})
	}

	render() {
		const classes = {
			'h-full': true,
			'grid flex-1': true,
			// flow classes: https://tailwindcss.com/docs/grid-auto-flow
			'grid-flow-row': this.flow === 'row',
			'grid-flow-col': this.flow === 'col',
			'grid-flow-row-dense': this.flow === 'row-dense',
			'grid-flow-col-dense': this.flow === 'col-dense',
			'grid-flow-dense': this.flow === 'dense',

			'justify-items-center': this.justify === 'center',
			'justify-items-end': this.justify === 'end',
			'justify-items-start': this.justify === 'start',
			'justify-items-stretch': this.justify === 'stretch',
			'items-center': this.align === 'center',
			'items-end': this.align === 'end',
			'items-start': this.align === 'start',
			'items-stretch': this.align === 'stretch',
			'items-baseline': this.align === 'baseline',
			'gap-0': this.gap === 'none',
			'gap-1': this.gap === 'xs',
			'gap-2': this.gap === 'sm',
			'gap-4': this.gap === 'md',
			'gap-8': this.gap === 'lg',
			'flex-nowrap': this.wrap,
			'flex-wrap': !this.wrap,
		}
		const style = {
			gridTemplateRows: this.rows ? this.rows : undefined,
			gridTemplateColumns: this.cols ? this.cols : undefined,
		}
		return html`
			<section class="${this.classMap(classes)}" style=${this.styleMap(style)}>
				<slot> </slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-grid': SchmancyGrid
	}
}
