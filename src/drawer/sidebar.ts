import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { fromEvent } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { SchmancyTheme, color } from '..'
import {
	SchmancyDrawerSidebarMode,
	SchmancyDrawerSidebarState,
	TSchmancyDrawerSidebarMode,
	TSchmancyDrawerSidebarState,
} from './context'
@customElement('schmancy-drawer-sidebar')
export class SchmancyDrawerSidebar extends $LitElement(css``) {
	@consume({ context: SchmancyDrawerSidebarMode, subscribe: true })
	@state()
	mode: TSchmancyDrawerSidebarMode

	@consume({ context: SchmancyDrawerSidebarState, subscribe: true })
	@state()
	private state: TSchmancyDrawerSidebarState

	connectedCallback() {
		super.connectedCallback()
		fromEvent<CustomEvent>(this, 'SchmancytoggleSidebar')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				const { state } = event.detail
				this.state = state
			})
	}

	protected render() {
		const animate = {
			'transition-all transform-gpu duration-[500ms] ease-[cubicBezier(0.5, 0.01, 0.25, 1)]': true,
		}
		const sidebarClasses = {
			'p-[16px] max-w-[360px] w-fit': true,
			block: this.mode === 'push',
			'fixed inset-0 z-50': this.mode === 'overlay',
			'min-w-[360px]': this.mode === 'overlay' && this.state === 'open',
			'translate-x-[-100%]': this.mode === 'overlay' && this.state === 'close',
		}
		const overlayClass = {
			'fixed inset-0 opacity-[0.4] z-[49]': true,
			'opacity-[0] z-[-1]': this.mode === 'push' || this.state === 'close',
		}

		return html`
			<nav
				class="${this.classMap({ ...sidebarClasses, ...animate })}"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
				})}
			>
				<div>
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
							detail: { state: 'close' },
							bubbles: true,
							composed: true,
						}),
					)
				}}
				class="${this.classMap({ ...overlayClass, ...animate })}"
			></div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-drawer-sidebar': SchmancyDrawerSidebar
	}
}
