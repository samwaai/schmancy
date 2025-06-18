import { html, unsafeCSS } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, startWith, takeUntil } from 'rxjs'
import Layout from '../layout'
import style from './grid.scss?inline'

/**
 * @deprecated Use Tailwind CSS grid classes directly instead of this component.
 * This component will be removed in a future version.
 * 
 * Migration guide:
 * - Replace <schmancy-grid> with <div class="grid ...">
 * - Use Tailwind's grid utilities: grid-cols-*, gap-*, items-*, justify-items-*, etc.
 * 
 * @element schmancy-grid
 */
@customElement('schmancy-grid')
export class SchmancyGrid extends Layout {
	static styles = [Layout.styles, unsafeCSS(style)]
	layout = true
	@property({ type: String }) flow: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense' = 'row'
	@property({ type: String }) align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'stretch'
	@property({ type: String }) justify: 'start' | 'center' | 'end' | 'stretch' = 'stretch'
	@property({ type: String }) content: 'start' | 'center' | 'end' | 'stretch' | 'around' | 'evenly' | 'between' =
		'stretch'
	@property({ type: String }) gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' = 'none'

	@property({ type: String }) cols?: string
	@property({ type: String }) rows?: string
	@property({ type: Object }) rcols?: {
		xs?: string | number
		sm?: string | number
		md?: string | number
		lg?: string | number
		xl?: string | number
		'2xl'?: string | number
	}

	@property({ type: Boolean }) wrap = false

	@queryAssignedElements() assignedElements!: HTMLElement[]

	firstUpdated() {
		if (this.rcols)
			fromEvent<CustomEvent>(window, 'resize')
				.pipe(
					map(event => event.target as Window),
					startWith(1),
					map(() => (this.clientWidth ? this.clientWidth : window.innerWidth)),
					distinctUntilChanged(),
					takeUntil(this.disconnecting),
					debounceTime(10),
					map(w => {
						let cols
						if (this.rcols?.['2xl'] && w >= 1536) cols = this.rcols?.['2xl']
						else if (this.rcols?.xl && w >= 1280) cols = this.rcols?.xl
						else if (this.rcols?.lg && w >= 1024) cols = this.rcols?.lg
						else if (this.rcols?.md && w >= 768) cols = this.rcols?.md
						else if (this.rcols?.sm && w >= 640) cols = this.rcols?.sm
						else if (this.rcols?.xs && w < 640) cols = this.rcols?.xs
						return cols
					}),
				)
				.subscribe(cols => {
					this.cols = cols
				})
	}

	render() {
		const classes = {
			'h-full': true,
			'grid flex-1': true,
			// flow classes: https://tailwindcss.com/docs/grid-auto-flow
			'grid-flow-row auto-rows-max': this.flow === 'row',
			'grid-flow-col auto-cols-max': this.flow === 'col',
			'grid-flow-row-dense': this.flow === 'row-dense',
			'grid-flow-col-dense': this.flow === 'col-dense',
			'grid-flow-dense': this.flow === 'dense',

			'justify-center': this.content === 'center',
			'justify-end': this.content === 'end',
			'justify-start': this.content === 'start',
			'justify-stretch': this.content === 'stretch',
			'justify-between': this.content === 'between',
			'justify-around': this.content === 'around',
			'justify-evenly': this.content === 'evenly',

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
