import { $LitElement } from '@mhmo91/lit-mixins/src'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter } from 'rxjs'
import { DemoAnimatedText } from './features/animated-text'
import { DemoBusy } from './features/busy'
import { DemoButton } from './features/button'
import { DemoCard } from './features/card'
import { DemoContentDrawer } from './features/drawer-content'
import { DemoIcons } from './features/icons'
import { DemoInput } from './features/input'
import { DemoList } from './features/list'
import { DemoRouter } from './features/router'
import { DemoSheet } from './features/sheet'
import { DemoSurface } from './features/surface'
import { DemoTabs } from './features/tabs'
import { DemoTree } from './features/tree'
import DemoTypography from './features/typography'

@customElement('demo-nav')
export class DemoNav extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() activeTab: string

	Demos: Array<{
		name: string
		component: CustomElementConstructor
	}> = [
		{
			name: 'Busy',
			component: DemoBusy,
		},
		{
			name: 'Icons',
			component: DemoIcons,
		},
		{
			name: 'Typography',
			component: DemoTypography,
		},
		{
			name: 'Button',
			component: DemoButton,
		},
		{
			name: 'Card',
			component: DemoCard,
		},
		{
			name: 'Input',
			component: DemoInput,
		},
		{
			name: 'List',
			component: DemoList,
		},

		{
			name: 'Sheet',
			component: DemoSheet,
		},
		{
			name: 'Tree',
			component: DemoTree,
		},
		{
			name: 'Content Drawer',
			component: DemoContentDrawer,
		},
		{
			name: 'Tabs',
			component: DemoTabs,
		},
		{
			name: 'Surface',
			component: DemoSurface,
		},
		{
			name: 'Animated text',
			component: DemoAnimatedText,
		},
		{
			name: 'Router',
			component: DemoRouter,
		},
	]

	connectedCallback(): void {
		super.connectedCallback()
		area.$current.pipe(filter(r => r.area === 'main')).subscribe(r => {
			this.activeTab = r.component?.toLowerCase().replaceAll('-', '')
		})
	}
	render() {
		return html`
			<schmancy-grid class="max-h-[90vh]" gap="md" justify="center">
				<img class="inline-block h-[80px] w-[80px] rounded-full sticky top-0" src="schmancy.jpg" alt="Schmancy Logo" />
				<schmancy-list>
					${repeat(
						this.Demos,
						d => d.name,
						d =>
							html` <schmancy-list-item
								rounded
								.selected=${this.activeTab?.toLowerCase()?.replaceAll('-', '') === d.component.name?.toLowerCase()}
								@click=${() => {
									schmancyNavDrawer.close(this)
									area.push({
										area: 'main',
										component: d.component,
										state: { id: 'ajdkfkadsjflsa' },
										clearQueryParams: ['id'],
									})
								}}
							>
								${d.name}
							</schmancy-list-item>`,
					)}
				</schmancy-list>
				<div class="sticky bottom-0 ">
					<schmancy-theme-button></schmancy-theme-button>
				</div>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-nav': DemoNav
	}
}
