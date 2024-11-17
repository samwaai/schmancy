import { animate } from '@juliangarnierorg/anime-beta'
import { TailwindElement } from '@mhmo91/lit-mixins/src'

import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { from, fromEvent, merge, switchMap, takeUntil, tap } from 'rxjs'

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
		background-color: initial;
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
		)
			.pipe(
				switchMap(() =>
					merge(
						from(
							animate(this.chevron, {
								rotate: this.open ? [0, 180] : [180, 0],
								ease: 'easeInQuad',
								duration: 150,
							}),
						),
						from(
							animate(this.defaultSlot, {
								display: { to: this.open ? 'none' : 'block', ease: 'outExpo' },
								opacity: { to: this.open ? 0 : 1, ease: 'outExpo' },
								ease: 'easeInQuad',
								duration: 150,
								onComplete: () => {
									this.open = !this.open
								},
							}),
						),
					),
				),
				takeUntil(this.disconnecting),
			)

			.subscribe()
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
