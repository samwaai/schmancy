import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import anime from 'animejs'
import { css, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { fromEvent } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { SchmancyTheme, color } from '..'
import {
	TSchmancyDrawerSidebarMode,
	SchmancyDrawerSidebarState,
	TSchmancyDrawerSidebarState,
	SchmancyDrawerSidebarMode,
} from './context'
@customElement('schmancy-drawer-sidebar')
export class SchmancyDrawerSidebar extends $LitElement(css`
	/* :host {
		max-width: 360px;
		background-color: var(--schmancy-sys-color-surface-container);
		padding-left: 16px;
		padding-right: 16px;
		padding-top: 16px;
	} */
`) {
	@consume({ context: SchmancyDrawerSidebarMode, subscribe: true })
	@state()
	mode: TSchmancyDrawerSidebarMode

	@consume({ context: SchmancyDrawerSidebarState, subscribe: true })
	@state()
	private state: TSchmancyDrawerSidebarState

	@query('#sidebar') private _sidebar!: HTMLElement

	connectedCallback() {
		super.connectedCallback()

		fromEvent<CustomEvent>(window, 'SchmancytoggleSidebar')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				console.log(event.detail.open)
				if (event.detail.open) this.openSidebar()
				else this.closeSidebar()
			})
	}

	openSidebar() {
		anime({
			targets: [this._sidebar],
			translateX: ['-100%', 0],
			duration: 300,
			easing: 'cubicBezier(0.5, 0.01, 0.25, 1)',
		})
	}

	closeSidebar() {
		anime({
			targets: [this._sidebar],
			translateX: [0, '-100%'],
			duration: 300,
			easing: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			complete: () => {
				this.state = 'close'
			},
		})
	}

	protected render() {
		const sidebarClasses = {
			'p-[16px] max-w-[360px]': true,
			'transition-all': true,
			block: this.mode === 'push',
			'fixed inset-0 z-50': this.mode === 'overlay',
			'min-w-[360px]': this.mode === 'overlay' && this.state === 'open',
			'translate-x-[-100%]': this.mode === 'overlay' && this.state === 'close',
		}
		const overlayClass = {
			'fixed inset-0 opacity-[0.4] z-[49]': true,
			hidden: this.mode === 'push' || this.state === 'close',
		}

		return html`
			<nav
				class="${this.classMap(sidebarClasses)}"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
				})}
			>
				<div id="sidebar">
					<slot></slot>
				</div>
			</nav>
			<div
				${color({
					bgColor: SchmancyTheme.sys.color.scrim,
				})}
				@click=${() => {
					this.dispatchEvent(
						new CustomEvent('SchmancytoggleSidebar', {
							detail: { open: false },
							bubbles: true,
							composed: true,
						}),
					)
				}}
				class="${this.classMap(overlayClass)}"
			></div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-drawer-sidebar': SchmancyDrawerSidebar
	}
}
