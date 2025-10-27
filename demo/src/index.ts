import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

import { area, lazy } from '@mhmo91/schmancy/area'
import { createCompoundSelector, createContext, select } from '@mhmo91/schmancy/index'
import '@mhmo91/schmancy/boat'
import '@mhmo91/schmancy/navigation-rail'
import '@mhmo91/schmancy/layout'

// All demo components are now lazy-loaded via the area router
// No direct imports needed - components load on-demand when navigating

type Theme = {
	color: string
	scheme: 'dark' | 'light' | 'auto'
}
const ThemeContext = createContext<Theme>(
	{
		color: '#4479e1',
		scheme: 'dark',
	},
	'memory',
	'theme',
)

type User = {
	name: string
}
const UserContext = createContext<User>({ name: 'mo' }, 'memory', 'user-context')

const compoundSelector = createCompoundSelector([ThemeContext, UserContext], [a => a, b => b], (_theme, user) => ({
	name: user.name,
}))

// Demo item type - component can be either a string tag name or a lazy-loaded component
type DemoItem = {
	name: string
	component: string | ReturnType<typeof lazy>
	icon: string
	value: string
}

@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	@select(ThemeContext)
	theme!: Theme

	@select(compoundSelector)
	user!: {
		name: string
	}

	@state() activeComponent: string = ''

	connectedCallback(): void {
		super.connectedCallback()

		setTimeout(() => {
			UserContext.$.next({
				name: 'Momooooo',
			})
		}, 5000)
	}

	private navigate(demo: DemoItem) {
		// Update active component for highlighting
		this.activeComponent = demo.value

		// Navigate using area.push - component must be either:
		// 1. A string tag name (e.g., 'demo-core-buttons')
		// 2. A lazy-loaded component from lazy(() => import('./file'))
		area.push({
			area: 'main',
			component: demo.component,
		})
	}

	render() {
		const sections: Array<{
			title: string
			demos: Array<DemoItem>
		}> = [
			{
				title: 'Core',
				demos: [
					{ name: 'Button', component: lazy(() => import('./core/buttons')), icon: 'smart_button', value: 'button' },
					{ name: 'Typography', component: lazy(() => import('./core/typography')), icon: 'text_fields', value: 'typography' },
					{ name: 'Card', component: lazy(() => import('./core/cards')), icon: 'dashboard', value: 'card' },
					{ name: 'Surface', component: lazy(() => import('./core/surfaces')), icon: 'layers', value: 'surface' },
					{ name: 'Icon', component: lazy(() => import('./core/icons')), icon: 'palette', value: 'icon' },
				],
			},
			{
				title: 'Forms',
				demos: [
					{ name: 'Text Input', component: lazy(() => import('./forms/text-inputs')), icon: 'text_fields', value: 'text-input' },
					{ name: 'Autocomplete', component: lazy(() => import('./forms/autocomplete')), icon: 'search', value: 'autocomplete' },
					{ name: 'Form Validation', component: lazy(() => import('./forms/validation')), icon: 'fact_check', value: 'validation' },
				],
			},
			{
				title: 'Navigation',
				demos: [
					{ name: 'Navigation Bar', component: lazy(() => import('./navigation/navigation-bar')), icon: 'navigation', value: 'navbar' },
					{ name: 'Tabs', component: lazy(() => import('./navigation/tabs')), icon: 'tab', value: 'tabs' },
					{ name: 'Navigation Rail', component: lazy(() => import('./navigation/rail')), icon: 'view_sidebar', value: 'nav-rail' },
					{ name: 'Drawer', component: lazy(() => import('./navigation/drawer')), icon: 'menu', value: 'drawer' },
					{ name: 'Menu', component: lazy(() => import('./navigation/menu')), icon: 'more_vert', value: 'menu' },
				],
			},
			{
				title: 'Data',
				demos: [
					{ name: 'Table', component: lazy(() => import('./data/tables')), icon: 'table_chart', value: 'table' },
					{ name: 'List', component: lazy(() => import('./data/lists')), icon: 'list', value: 'list' },
					{ name: 'Tree View', component: lazy(() => import('./data/trees')), icon: 'account_tree', value: 'tree' },
					{ name: 'Chips', component: lazy(() => import('./data/chips')), icon: 'label', value: 'chips' },
				],
			},
			{
				title: 'Feedback',
				demos: [
					{ name: 'Progress', component: lazy(() => import('./feedback/progress')), icon: 'pending', value: 'progress' },
					{ name: 'Loading', component: lazy(() => import('./feedback/loading')), icon: 'hourglass_empty', value: 'loading' },
					{ name: 'Notification', component: lazy(() => import('./feedback/notifications')), icon: 'notifications', value: 'notification' },
				],
			},
			{
				title: 'Overlays',
				demos: [
					{ name: 'Dialog', component: lazy(() => import('./overlays/dialog-showcase')), icon: 'web_asset', value: 'dialog' },
					{ name: 'Sheet', component: lazy(() => import('./overlays/sheet')), icon: 'vertical_split', value: 'sheet' },
					{ name: 'Details', component: lazy(() => import('./overlays/details-showcase')), icon: 'expand_more', value: 'details' },
				],
			},
			{
				title: 'Layout',
				demos: [
					{ name: 'Boat', component: lazy(() => import('./layout/boat')), icon: 'sailing', value: 'boat' },
					{ name: 'Steps', component: lazy(() => import('./layout/steps')), icon: 'linear_scale', value: 'steps' },
					{ name: 'Content Drawer', component: lazy(() => import('./layout/content-drawer-users')), icon: 'view_sidebar', value: 'content-drawer' },
				],
			},
			{
				title: 'Advanced',
				demos: [
					{ name: 'Context State', component: lazy(() => import('./advanced/context')), icon: 'hub', value: 'context' },
					{ name: 'Theme Service', component: lazy(() => import('./advanced/theme-service-demo')), icon: 'palette', value: 'theme' },
					{ name: 'Area Router', component: lazy(() => import('./advanced/area/area-demos')), icon: 'view_carousel', value: 'area' },
					{ name: 'Map', component: lazy(() => import('./advanced/map')), icon: 'map', value: 'map' },
					{ name: 'Mailbox', component: lazy(() => import('./advanced/mailbox')), icon: 'mail', value: 'mailbox' },
				],
			},
		]

		const allDemos = sections.flatMap(s => s.demos)

		return html`
			<schmancy-theme root>
				<!-- Flex container for navigation rail and content -->
				<div class="grid grid-cols-[auto_1fr] h-screen">
					<!-- Navigation rail on the left -->
					<schmancy-navigation-rail
					class="overflow-y-auto border-r"
						.activeValue=${this.activeComponent}
						@navigate=${(e: CustomEvent<string>) => {
							const demo = allDemos.find(d => d.value === e.detail)
							if (demo) this.navigate(demo)
						}}
					>
						<!-- Header with Schmancy branding -->
						<div slot="header" class="animate-pulse mt-3">
							<img .src=${'./logo-dark.png'} class="max-w-12" />
						</div>

						<!-- Navigation items with minimal section labels -->
						${repeat(
							sections,
							section => section.title,
							section => {
								return html`
									<!-- Small section label -->
									<div class="px-3 py-1 opacity-60">
										<schmancy-typography type="label" token="sm">${section.title}</schmancy-typography>
									</div>

									${repeat(
										section.demos,
										demo => demo.value,
										demo => html`
											<schmancy-navigation-rail-item
												.icon=${demo.icon}
												.label=${demo.name}
												.value=${demo.value}
												?active=${this.activeComponent === demo.value}
											></schmancy-navigation-rail-item>
										`,
									)}
								`
							},
						)}
					</schmancy-navigation-rail>

					<!-- Main content area - flex-1 to take remaining space, overflow-auto for scrolling -->
					<div class="flex-1 overflow-auto">
						<schmancy-surface type="container" fill="all" class="h-full">
							<schmancy-area name="main" .default=${'demo-core-buttons'}></schmancy-area>
						</schmancy-surface>
					</div>
				</div>

				<sch-notification-container></sch-notification-container>

				<!-- Floating Theme Controls -->

				<schmancy-theme-controller-boat></schmancy-theme-controller-boat>
			</schmancy-theme>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}
