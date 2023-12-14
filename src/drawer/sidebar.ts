import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { fromEvent } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import mc from './mc.svg?inline'
import mo from './mo.svg?inline'
import { cache } from 'lit/directives/cache.js'
import { SchmancyTheme, color } from '..'
@customElement('schmancy-drawer-sidebar')
export class SchmancyDrawerSidebar extends $LitElement(css`
	:host {
		max-width: 360px;
		background-color: var(--schmancy-sys-color-surface-container);
		padding-left: 16px;
		padding-right: 16px;
	}
`) {
	@state() private lg = false
	@state() private sidebarOpen = false
	private resizeSubscription

	connectedCallback() {
		super.connectedCallback()
		this.manageVisibility()
		this.resizeSubscription = fromEvent(window, 'resize')
			.pipe(
				map(() => window.innerWidth),
				distinctUntilChanged(),
			)
			.subscribe(width => {
				this.manageVisibility(width)
			})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		if (this.resizeSubscription) {
			this.resizeSubscription.unsubscribe()
		}
	}

	manageVisibility(width = window.innerWidth) {
		const tabletWidth = 768 // Adjust as needed
		this.lg = width >= tabletWidth
	}

	protected render() {
		const sidebarClasses = {
			'w-[360px] transition-all duration-[600] fixed inset-y-0 z-50': this.sidebarOpen && !this.lg,
			hidden: !this.lg && !this.sidebarOpen,
		}
		const overlayClass = {
			'fixed inset-0 transition-all duration-[600] opacity-[0.4] z-50': this.sidebarOpen && !this.lg,
			hidden: this.lg,
		}
		const sidebarToggler = {
			'fixed left-[16px] top-[16px] z-50': !this.lg,
			hidden: this.lg,
		}
		return html`
			<div
				${color({
					bgColor: SchmancyTheme.sys.color.scrim,
				})}
				@click=${() => {
					this.sidebarOpen = !this.sidebarOpen
				}}
				class="${this.classMap(overlayClass)}"
			></div>
			<div
				class="${this.classMap(sidebarClasses)}"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
				})}
			>
				<slot></slot>
			</div>

			<div class="${this.classMap(sidebarToggler)}">
				<schmancy-button
					@click=${() => {
						this.sidebarOpen = !this.sidebarOpen
					}}
				>
					${cache(this.sidebarOpen ? html` <object data=${mc}></object> ` : html` <object data=${mo}></object> `)}
				</schmancy-button>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-drawer-sidebar': SchmancyDrawerSidebar
	}
}
