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
	@property({ type: String }) gap: 'none' | 'sm' | 'md' | 'lg' = 'none'
	@property({ type: Number }) cols?: number
	@property({ type: String }) templateCol?: string
	@property({ type: Number }) rows?: number
	@property({ type: String }) templateRow?: string
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
			'gap-2': this.gap === 'sm',
			'gap-4': this.gap === 'md',
			'gap-8': this.gap === 'lg',
			'flex-nowrap': this.wrap,
			'flex-wrap': !this.wrap,
		}
		const style = {
			gridTemplateRows: this.templateCol ? this.templateCol : undefined,
			gridTemplateColumns: this.templateRow ? this.templateRow : undefined,
		}
		if (typeof this.cols === 'number') style['grid-template-columns'] = `repeat(${this.cols}, minmax(0, 1fr))`
		if (typeof this.rows === 'number') style['grid-template-rows'] = `repeat(${this.rows}, minmax(0, 1fr))`
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
