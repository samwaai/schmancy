import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import anime from 'animejs'
import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'

@customElement('schmancy-tree')
export default class SchmancyTree extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
	}
`) {
	@property({ type: Boolean }) open: boolean = false
	@property({ type: Boolean }) active: boolean = false
	@query('#toggler') toggler!: HTMLSlotElement
	@query('slot:not([name="root"])') defaultSlot!: HTMLSlotElement
	@query('#chevron') chevron!: HTMLSpanElement
	firstUpdated() {
		this.defaultSlot.style.display = this.open ? 'block' : 'none'
		merge(
			fromEvent(this.toggler, 'click').pipe(
				takeUntil(this.disconnecting),
				tap(e => {
					e.preventDefault()
					e.stopPropagation()
					this.dispatchEvent(
						new CustomEvent('toggle', {
							bubbles: true,
							composed: true,
						}),
					)
				}),
			),
			fromEvent(this.chevron, 'click'),
		).subscribe({
			next: () => {
				anime({
					targets: this.chevron,
					rotate: this.open ? [0, 180] : [180, 0],
					easing: 'easeInQuad',
					duration: 150,
				})
				if (this.open) {
					this.defaultSlot.style.display = 'none'
				} else {
					this.defaultSlot.style.display = 'block'
				}
				this.open = !this.open
			},
		})
	}
	render() {
		const classes = {
			'bg-gray-800 text-white': this.active,
			'text-gray-400 hover:text-white hover:bg-gray-800': !this.active,
			'w-full group flex justify-between items-center  rounded-md p-2 text-sm leading-6 font-semibold': true,
		}
		return html`
			<li class="w-full" id="toggler">
				<button class="${this.classMap(classes)} ">
					<slot name="root"></slot>
					<span
						@click=${e => {
							e.stopPropagation()
						}}
						id="chevron"
						class="rotate-180 flex items-center transition-all duration-100 w-[34px] h-[34px] hover:bg-gray-100 hover:bg-opacity-10 hover:scale-110   hover:rounded-full p-2 text-xl font-bold"
						>⌅
					</span>
				</button>
			</li>
			<slot></slot>
		`
	}
}
