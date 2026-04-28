import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { fromEvent, merge, switchMap, takeUntil, tap, zip } from 'rxjs'

/**
 * Expandable tree node — a recursive disclosure widget. One root slot, one default slot for child nodes. Each node can itself contain schmancy-tree children.
 *
 * @element schmancy-tree
 * @summary Use for hierarchical navigation / file-explorer layouts. Each level is a schmancy-tree with a `root` slot (the parent label) and default slot (the children, which may be more schmancy-trees).
 * @example
 * <schmancy-tree>
 *   <schmancy-list-item slot="root">src/</schmancy-list-item>
 *   <schmancy-tree>
 *     <schmancy-list-item slot="root">components/</schmancy-list-item>
 *     <schmancy-list-item>button.ts</schmancy-list-item>
 *   </schmancy-tree>
 * </schmancy-tree>
 * @platform details toggle - Recursive `<details>`-like disclosure. Degrades to a plain nested list if the tag never registers — loses expand/collapse but stays navigable.
 * @slot root - The root element of the tree
 * @slot - The children of the tree
 * @fires toggle - When the root toggler or chevron is clicked. Fires before the open state flips; the host's `open` property reflects the new state on the next animation frame.
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

	private readonly _a11yId = `schmancy-tree-${Math.random().toString(36).slice(2, 10)}`
	private get _contentId() { return `${this._a11yId}-content` }

	/** ElementInternals — broadcasts `:state(open)` for consumer CSS. */
	private readonly _internals: ElementInternals | undefined = (() => {
		try { return this.attachInternals() } catch { return undefined }
	})()

	updated(changed: Map<string, unknown>) {
		super.updated?.(changed)
		if (changed.has('open')) {
			if (this.open) this._internals?.states.add('open')
			else this._internals?.states.delete('open')
		}
	}

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
				this.dispatchEvent(new CustomEvent('toggle', { bubbles: false, composed: true }))
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
				<schmancy-button
					slot="trailing"
					id="chevron"
					aria-expanded=${this.open ? 'true' : 'false'}
					aria-controls=${this._contentId}
					aria-label=${this.open ? 'Collapse' : 'Expand'}
					@click=${(e: Event) => e.stopPropagation()}
				>
					⌅
				</schmancy-button>
			</div>

			<!-- The default slot: tree children -->
			<slot id=${this._contentId}></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tree': SchmancyTree
	}
}
