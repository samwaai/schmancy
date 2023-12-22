import { provide } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, startWith, takeUntil, tap } from 'rxjs'
import {
	SchmancyDrawerSidebarMode,
	SchmancyDrawerSidebarState,
	TSchmancyDrawerSidebarMode,
	TSchmancyDrawerSidebarState,
} from './context'

/**
 * @element schmancy-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
@customElement('schmancy-drawer')
export class SchmancyDrawer extends $LitElement(css`
	:host {
		display: block;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		position: relative;
		inset: 0;
	}
`) {
	@provide({ context: SchmancyDrawerSidebarMode })
	@state()
	mode: TSchmancyDrawerSidebarMode

	@property({ type: Number })
	minWidth: number = 768

	@provide({ context: SchmancyDrawerSidebarState })
	@state()
	open: TSchmancyDrawerSidebarState

	connectedCallback(): void {
		super.connectedCallback()

		fromEvent<CustomEvent>(window, 'resize')
			.pipe(
				map(event => event.target as Window),
				startWith(window),
				map(window => window.innerWidth),
				map(width => width >= this.minWidth),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
				debounceTime(100),
			)
			.subscribe(lgScreen => {
				if (lgScreen) {
					this.mode = 'push'
					this.open = 'open'
				} else {
					this.open = 'close'
					this.mode = 'overlay'
				}
			})

		fromEvent<CustomEvent>(this, 'SchmancytoggleSidebar')
			.pipe(
				tap(event => {
					event.stopPropagation()
				}),
				map(event => event.detail.state),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(state => {
				this.open = state
			})
	}

	protected render() {
		return html`
			<schmancy-grid cols="auto 1fr" rows="1fr" flow="col" justify="stretch" align="stretch" class="flex h-[100%]">
				<slot></slot>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-drawer': SchmancyDrawer
	}
}
