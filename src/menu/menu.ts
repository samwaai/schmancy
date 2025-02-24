import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom'
import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, query, queryAssignedElements } from 'lit/decorators.js'
import { filter, fromEvent, takeUntil, tap } from 'rxjs'

@customElement('schmancy-menu')
export default class SchmancyMenu extends TailwindElement(css`
	:host {
		position: relative;
		display: inline-block;
	}

	#menu {
		display: none;
	}

	#menu[data-show='true'] {
		display: block;
	}
`) {
	@queryAssignedElements({ flatten: true, slot: 'button' })
	buttonElement!: Array<HTMLElement>

	@query('#menu') menuElement!: HTMLElement

	private cleanup?: any

	private getMiddleware() {
		return [
			offset(5),
			flip(),
			shift({ padding: 5 }),
			size({
				apply({ availableHeight, elements }) {
					elements.floating.style.maxHeight = `${availableHeight}px`
				},
			}),
		]
	}

	async updatePosition() {
		if (!this.buttonElement[0] || !this.menuElement) {
			return
		}

		await computePosition(this.buttonElement[0], this.menuElement, {
			placement: 'bottom-start',
			middleware: this.getMiddleware(),
		}).then(({ x, y }) => {
			Object.assign(this.menuElement.style, {
				left: `${x}px`,
				top: `${y}px`,
			})
		})
	}

	private showMenu() {
		if (!this.buttonElement[0] || !this.menuElement) return

		this.menuElement.dataset.show = 'true'

		this.cleanup = autoUpdate(this.buttonElement[0], this.menuElement, () => {
			computePosition(this.buttonElement[0], this.menuElement, {
				placement: 'bottom-start',
				middleware: this.getMiddleware(),
			}).then(({ x, y, strategy }) => {
				Object.assign(this.menuElement.style, {
					left: `${x}px`,
					top: `${y}px`,
					position: strategy,
				})
			})
		})

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

		animation.onfinish = () => {}
	}

	private async hideMenu() {
		// Make hideMenu async
		if (this.cleanup) {
			await this.cleanup() // Await the cleanup!
			this.cleanup = undefined
		}
		this.menuElement.dataset.show = 'false'

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
		animation.onfinish = () => {} // No need for a promise now
	}

	firstUpdated(): void {
		fromEvent(this.buttonElement, 'click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				this.showMenu()
			})

		fromEvent(this, 'schmancy-menu-item-click')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				this.hideMenu()
			})

		fromEvent(document, 'click')
			.pipe(
				filter((e: Event) => !this.contains(e.target as Node)),
				takeUntil(this.disconnecting),
				tap(() => {
					if (this.menuElement.dataset.show === 'true') {
						this.hideMenu()
					}
				}),
			)
			.subscribe()
	}

	render() {
		return html`
			<slot name="button">
				<schmancy-icon-button> more_vert </schmancy-icon-button>
			</slot>
			<ul
				id="menu"
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
