import { animate } from '@juliangarnierorg/anime-beta'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement, query, queryAssignedElements, state } from 'lit/decorators.js'
import { from, fromEvent, switchMap, takeUntil, tap } from 'rxjs'
import style from './menu.scss?inline'

@customElement('schmancy-menu')
export default class SchmancyMenu extends TailwindElement(style) {
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
			},
		})
	}

	closeMenu() {
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
			<div class="relative flex-none">
				<slot name="button">
					<button
						slot="button"
						type="button"
						class="relative p-2.5 text-[${SchmancyTheme.sys.color.surface.on}] hover:text-[${SchmancyTheme.sys.color
							.primary}] hover:bg-[${SchmancyTheme.sys.color.surface.default}] hover:rounded-full"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
							/>
						</svg>
					</button>
				</slot>
				<div class="fixed inset-0 z-10" .hidden=${!this.open} @click=${this.closeMenu}></div>
				<schmancy-list
					id="menu"
					.hidden=${!this.open}
					class="absolute z-50 bg-surface-default elevation-2 rounded-md"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="options-menu-4-button"
				>
					<slot></slot>
				</schmancy-list>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-menu': SchmancyMenu
	}
}
