import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { TailwindElement } from '@mixins/index'
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

	@queryAssignedElements({ flatten: true, slot: 'button' })
	buttonElement!: Array<HTMLElement>

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
				middleware: [offset(5), flip(), shift({ padding: 5 })],
			})

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
			.subscribe()
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
				class="absolute z-50 border-outlineVariant rounded-md 
          min-w-[160px] max-w-[320px] w-max bg-surface-default"
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
