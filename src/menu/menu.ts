import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { animate } from '@juliangarnierorg/anime-beta'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, query, queryAssignedElements, state } from 'lit/decorators.js'
import { from, fromEvent, switchMap, takeUntil, tap } from 'rxjs'

@customElement('schmancy-menu')
export default class SchmancyMenu extends TailwindElement(css`
	:host {
		position: relative;
		display: inline-block;
	}
`) {
	@state() open = false
	@queryAssignedElements({ flatten: true, slot: 'button' }) buttonElement!: Array<HTMLElement>
	@query('#menu') menuElement!: HTMLElement

	openMenu() {
		return animate(this.menuElement, {
			targets: [],
			opacity: [0, 1],
			scale: [0.95, 1],
			duration: 100,
			easing: 'easeInQuad',
			onBegin: () => {
				this.open = true
				this.positionMenu()
			},
		})
	}

	closeMenu(e?: Event) {
		if (e && e instanceof Event) {
			e.preventDefault()
			e.stopPropagation()
		}
		return animate(this.menuElement, {
			opacity: [1, 0],
			scale: [1, 0.95],
			duration: 75,
			easing: 'easeInQuad',
			onComplete: () => {
				this.open = false
			},
		})
	}

	async positionMenu() {
		if (this.buttonElement.length && this.menuElement) {
			// Compute the position of the menu relative to the button
			const { x, y } = await computePosition(this.buttonElement[0], this.menuElement, {
				placement: 'bottom-start', // Initial placement
				middleware: [
					offset(5), // Optional: Adds space between the button and the menu
					flip(), // Automatically flips the menu if there's not enough space
					shift({ padding: 5 }), // Adjusts the position to stay within the viewport
				],
			})

			// Apply the computed styles
			Object.assign(this.menuElement.style, {
				left: `${x}px`,
				top: `${y}px`,
				position: 'absolute',
			})
		}
	}

	protected firstUpdated(): void {
		fromEvent(this.buttonElement, 'click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
				switchMap(() => from(this.openMenu())),
			)
			.subscribe()

		fromEvent(this, 'schmancy-menu-item-click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
				switchMap(() => from(this.closeMenu())),
			)
			.subscribe({
				next: () => {},
			})
	}

	render() {
		return html`
			<slot name="button">
				<schmancy-icon-button> more_vert</schmancy-icon-button>
			</slot>
			<div class="fixed inset-0 z-50" .hidden=${!this.open} @click=${this.closeMenu}></div>
			<schmancy-list
				id="menu"
				.hidden=${!this.open}
				class="absolute z-50 elevation-2 rounded-md 
					min-w-[160px] max-w-[320px] bg-surface-default"
				role="menu"
				aria-orientation="vertical"
				aria-labelledby="options-menu-4-button"
			>
				<slot></slot>
			</schmancy-list>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-menu': SchmancyMenu
	}
}
