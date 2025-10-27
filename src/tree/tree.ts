import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { fromEvent, merge, switchMap, takeUntil, tap, zip } from 'rxjs'

/**
 * @element schmancy-tree
 * @slot root - The root element of the tree
 * @slot - The children of the tree
 */
@customElement('schmancy-tree')
export class SchmancyTree extends TailwindElement(css`
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
	/**
	 * Whether the tree’s children are visible
	 */
	@property({ type: Boolean }) open = false

	@query('#toggler') toggler!: HTMLSlotElement
	@query('slot:not([name="root"])') defaultSlot!: HTMLSlotElement

	// Since it's actually a <schmancy-button>, use HTMLElement or a custom type
	@query('#chevron') chevron!: HTMLElement

	firstUpdated() {
		// Hide or show the slot initially based on `open`
		if (!this.open) {
			this.defaultSlot.hidden = true
		}

		// Root toggler
		const toggleClick$ = fromEvent<MouseEvent>(this.toggler, 'click').pipe(
			takeUntil(this.disconnecting),
			tap(e => {
				e.preventDefault()
				e.stopPropagation()
				this.dispatchEvent(new CustomEvent('toggle', { bubbles: true, composed: true }))
			}),
		)

		// Chevron (the schmancy-button) click
		const chevronClick$ = fromEvent<MouseEvent>(this.chevron, 'click')

		merge(toggleClick$, chevronClick$)
			.pipe(
				switchMap(() => {
					// 1. Animate the chevron rotation
					//    If `open` is true, rotate from 180 -> 0; if false, from 0 -> 180
					const fromDeg = this.open ? 180 : 0
					const toDeg = this.open ? 0 : 180
					const chevronAnimation = this.chevron.animate(
						[{ transform: `rotate(${fromDeg}deg)` }, { transform: `rotate(${toDeg}deg)` }],
						{
							duration: 150,
							easing: 'ease-in',
							fill: 'forwards',
						},
					)

					// 2. Animate the slot’s height + opacity
					if (!this.open) {
						// We are about to open, so remove `hidden` to measure scrollHeight
						this.defaultSlot.hidden = false
					}

					const fromOpacity = this.open ? 1 : 0
					const toOpacity = this.open ? 0 : 1

					const slotAnimation = this.defaultSlot.animate([{ opacity: fromOpacity }, { opacity: toOpacity }], {
						duration: 150,
						easing: 'ease-out',
						fill: 'forwards',
					})

					// Hide the slot if we just closed it
					slotAnimation.onfinish = () => {
						if (this.open) {
							this.defaultSlot.hidden = true
						} else {
							this.defaultSlot.style.height = 'auto'
							this.defaultSlot.style.opacity = '1'
						}
					}

					// Return an Observable that completes when both animations finish
					return zip(fromEvent(chevronAnimation, 'finish'), fromEvent(slotAnimation, 'finish')).pipe(
						takeUntil(this.disconnecting),
					)
				}),
				tap(() => {
					// Flip the open state
					this.open = !this.open
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	render() {
		return html`
			<div class="flex content-center items-center justify-between">
				<!-- Root toggler content -->
				<slot id="toggler" name="root"></slot>

				<!-- The chevron or arrow symbol -->
				<!-- Stop propagation on the schmancy-button itself just to avoid double triggers -->
				<schmancy-button slot="trailing" id="chevron" @click=${(e: Event) => e.stopPropagation()}> ⌅ </schmancy-button>
			</div>

			<!-- The default slot: tree children -->
			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tree': SchmancyTree
	}
}
