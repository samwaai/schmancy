import { $LitElement } from '@mhmo91/lit-mixins/src'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter } from 'rxjs'
import { DemoButton } from './button'
import { DemoCard } from './card'
import { DemoContentDrawer } from './drawer-content'
import { DemoInput } from './input'
import { DemoList } from './list'
import { DemoSheet } from './sheet'
import { DemoTree } from './tree'
import DemoTypography from './typography'
import { DemoTabs } from './tabs'
import { DemoSurface } from './surface'

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
	]

	connectedCallback(): void {
		super.connectedCallback()
		area.$current.pipe(filter(r => r.area === 'main')).subscribe(r => {
			this.activeTab = r.component.toLowerCase().replaceAll('-', '')
		})
	}
	render() {
		return html`
			<schmancy-grid gap="md" justify="center">
				<img class="inline-block h-[80px] w-[80px] rounded-full" src="schmancy.jpg" alt="Schmancy Logo" />
				<schmancy-list>
					${repeat(
						this.Demos,
						d => d.name,
						d =>
							html` <schmancy-list-item
								rounded
								.selected=${this.activeTab === d.component.name.toLowerCase()}
								@click=${() => {
									schmancyNavDrawer.close(this)
									area.push({
										area: 'main',
										component: d.component,
									})
								}}
							>
								${d.name}
							</schmancy-list-item>`,
					)}
				</schmancy-list>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-nav': DemoNav
	}
}
