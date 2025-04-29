import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { createContext, select } from '@schmancy/store'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, map } from 'rxjs'
import { fullHeight } from '../../src/directives/height'
import { DemoAnimatedText } from './features/animated-text'
import DemoBadges from './features/badges'
import { DemoBusy } from './features/busy'
import { DemoButton } from './features/button'
import { DemoCard } from './features/card'
import { DemoContentDrawer } from './features/drawer-content'
import { DemoIcons } from './features/icons'
import { DemoInput } from './features/input'
import { DemoList } from './features/list'
import NotificationDemo from './features/notifications'
import { DemoRouter } from './features/router'
import { DemoSheet } from './features/sheet/sheet'
import { DemoSurface } from './features/surface'
import { TableDemo } from './features/table'
import { DemoTabs } from './features/tabs'
import { DemoTree } from './features/tree'
import { SchmancyTypewriterDemo } from './features/typewriter'
import DemoTypography from './features/typography'
import { DemoAvatars } from './features/avatar'
const NavContext = createContext<
	Array<{
		name: string
		component: any
	}>
>([], 'session', 'nav')

@customElement('demo-nav')
export class DemoNav extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() activeTab: string

	@select(NavContext, undefined)
	Demos!: Array<{
		name: string
		component: CustomElementConstructor
	}>

	connectedCallback(): void {
		super.connectedCallback()
		area.$current
			.pipe(
				filter(r => r.has('main')),
				map(r => r.get('main')),
			)
			.subscribe(r => {
				this.activeTab = r.component?.toLowerCase().replaceAll('-', '')
			})
		NavContext.replace([
			{ name: 'Avatar', component: DemoAvatars },
			{
				name: 'Badges',
				component: DemoBadges,
			},
			{
				name: 'Table',
				component: TableDemo,
			},
			{
				name: 'Notifications',
				component: NotificationDemo,
			},
			{
				name: 'Typewriter',
				component: SchmancyTypewriterDemo,
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
			{
				name: 'Busy',
				component: DemoBusy,
			},
		])
	}
	render() {
		console.log(this.Demos)
		return html`
			<schmancy-grid ${fullHeight()} gap="md" justify="center">
				<schmancy-typography type="headline" token="lg">
					<schmancy-typewriter> Schmancy </schmancy-typewriter>
				</schmancy-typography>

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
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-nav': DemoNav
	}
}
