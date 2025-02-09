import { computePosition, flip, offset, shift, size } from '@floating-ui/dom'
import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, query, queryAssignedElements, state } from 'lit/decorators.js'
import { filter, from, fromEvent, switchMap, takeUntil, tap } from 'rxjs'

@customElement('schmancy-menu')
export default class SchmancyMenu extends TailwindElement(css`
	:host {
		position: relative;
		display: inline-block;
	}
`) {
	@state() open = false

	@queryAssignedElements({ flatten: true, slot: 'button' })
	buttonElement!: Array<HTMLElement>

	// The element to be positioned by Floating UI remains identified by the id "menu"
	@query('#menu') menuElement!: HTMLElement

	openMenu() {
		this.open = true
		this.positionMenu()

		// Approx. "easeInQuad" with a cubic-bezier:
		const animation = this.menuElement.animate(
			[
				{ opacity: 0, transform: 'scale(0.95)' },
				{ opacity: 1, transform: 'scale(1)' },
			],
			{
				duration: 100,
				easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
			},
		)

		return new Promise<void>(resolve => {
			animation.onfinish = () => resolve()
		})
	}

	closeMenu(e?: Event) {
		if (e && e instanceof Event) {
			e.preventDefault()
			e.stopPropagation()
		}

		const animation = this.menuElement.animate(
			[
				{ opacity: 1, transform: 'scale(1)' },
				{ opacity: 0, transform: 'scale(0.95)' },
			],
			{
				duration: 75,
				easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
			},
		)

		return new Promise<void>(resolve => {
			animation.onfinish = () => {
				this.open = false
				resolve()
			}
		})
	}

	async positionMenu() {
		if (this.buttonElement.length && this.menuElement) {
			const { x, y } = await computePosition(this.buttonElement[0], this.menuElement, {
				placement: 'bottom-start',
				middleware: [
					offset(5),
					flip(),
					shift({ padding: 5 }),
					// Use size() to set the maxHeight based on available viewport space
					size({
						apply({ availableHeight, elements }) {
							// Limit the menu’s maximum height to the available height on the viewport
							elements.floating.style.maxHeight = `${availableHeight}px`
						},
					}),
				],
			})

			Object.assign(this.menuElement.style, {
				left: `${x}px`,
				top: `${y}px`,
				position: 'absolute',
			})
		}
	}

	protected firstUpdated(): void {
		// When the button is clicked, open the menu
		fromEvent(this.buttonElement, 'click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
				switchMap(() => from(this.openMenu())),
			)
			.subscribe()

		// When an item inside the menu is clicked, close the menu
		fromEvent(this, 'schmancy-menu-item-click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
				switchMap(() => from(this.closeMenu())),
			)
			.subscribe()

		// When clicking anywhere outside of this component, close the menu
		fromEvent(document, 'click')
			.pipe(
				// Only proceed if the click target is not inside this component
				filter((e: Event) => {
					const path = e.composedPath()
					return !path.includes(this)
				}),
				takeUntil(this.disconnecting),
				tap(() => {
					if (this.open) {
						this.closeMenu()
					}
				}),
			)
			.subscribe()
	}

	render() {
		return html`
			<slot name="button">
				<schmancy-icon-button> more_vert</schmancy-icon-button>
			</slot>
			<ul
				id="menu"
				.hidden=${!this.open}
				class="absolute z-50 border-outlineVariant rounded-md min-w-[160px] max-w-[320px] w-max bg-surface-default max-h-[90vh] shadow-1 overflow-y-auto"
				role="menu"
				aria-orientation="vertical"
				aria-labelledby="options-menu-4-button"
			>
				<slot></slot>
			</ul>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-menu': SchmancyMenu
	}
}
