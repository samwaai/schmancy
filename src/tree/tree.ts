import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import anime from 'animejs'
import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'

/**
 * @element schmancy-tree
 * @slot root - The root element of the tree
 * @slot - The children of the tree
 */
@customElement('schmancy-tree')
export default class SchmancyTree extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
		background-color: var(--schmancy-sys-color-surface-default);
	}
	::slotted([slot='root']) {
		width: 100%;
		text-align: left;
	}
	::slotted([slot='root'] + *) {
		margin-top: 0.5rem;
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
		return html`
			<div class="flex content-center items-center justify-between">
				<slot id="toggler" name="root"> </slot>
				<schmancy-button
					slot="trailing"
					@click=${e => {
						e.stopPropagation()
					}}
					id="chevron"
					>⌅
				</schmancy-button>
			</div>

			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tree': SchmancyTree
	}
}
