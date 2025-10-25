import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

import { area, lazy } from '@mhmo91/schmancy/area'
import { createCompoundSelector, createContext, select } from '@mhmo91/schmancy/index'
import '@mhmo91/schmancy/boat'
import '@mhmo91/schmancy/navigation-rail'
import '@mhmo91/schmancy/navigation-rail'
import '@mhmo91/schmancy/scroll'

// Import all demo modules to ensure they're registered
import './features/index'
import './demos/buttons'
import './demos/typography'
import './demos/surfaces'
import './demos/icons'
import './demos/cards'

// Direct component imports for non-lazy loaded components
import DemoAreaDemos from './features/area/area-demos'
import { DemoContext } from './features/context'
import { ThemeServiceDemo } from './features/theme-service-demo'
import { DemoChips } from './features/chips'
import { DemoMap } from './features/map'
import { DemoBoat } from './features/boat'
import { DemoSteps } from './features/steps'
import DetailsShowcase from './features/details-showcase'
import { DemoMailbox } from './features/mailbox'

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
@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	@select(ThemeContext)
	theme!: Theme

	@select(compoundSelector)
	user!: {
		name: string
	}

	@state() activeComponent: string = ''
	@state() showGrid: boolean = false
	@state() searchQuery: string = ''

	connectedCallback(): void {
		super.connectedCallback()

		setTimeout(() => {
			UserContext.$.next({
				name: 'Momooooo',
			})
		}, 5000)
	}

	private navigate(demo: { name: string; component: any; value: string }) {
		// Update active component for highlighting
		this.activeComponent = demo.value

		// Simple navigation - just use area.push with the component
		area.push({
			area: 'main',
			component: demo.component,
		})
	}

	render() {
		// All components in a flat, alphabetical structure for easy discovery
		const allDemos = [
			// Core UI Components - Most commonly needed
			{ name: 'Button', component: 'demo-core-buttons', icon: 'smart_button', value: 'button' },
			{ name: 'Typography', component: 'demo-core-typography', icon: 'text_fields', value: 'typography' },
			{ name: 'Card', component: 'demo-core-cards', icon: 'dashboard', value: 'card' },
			{ name: 'Surface', component: 'demo-core-surfaces', icon: 'layers', value: 'surface' },
			{ name: 'Icon', component: 'demo-core-icons', icon: 'palette', value: 'icon' },

			// Input & Forms
			{
				name: 'Text Input',
				component: lazy(() => import('./demos/text-inputs')),
				icon: 'text_fields',
				value: 'text-input',
			},
			{
				name: 'Autocomplete',
				component: lazy(() => import('./demos/autocomplete')),
				icon: 'search',
				value: 'autocomplete',
			},
			{
				name: 'Select/Checkbox',
				component: lazy(() => import('./demos/selection')),
				icon: 'check_box',
				value: 'select',
			},
			{
				name: 'Form Validation',
				component: lazy(() => import('./demos/validation')),
				icon: 'fact_check',
				value: 'validation',
			},

			// Navigation Components
			{
				name: 'Navigation Bar',
				component: lazy(() => import('./demos/navigation-bar')),
				icon: 'navigation',
				value: 'navbar',
			},
			{ name: 'Tabs', component: lazy(() => import('./demos/tabs')), icon: 'tab', value: 'tabs' },
			{
				name: 'Navigation Rail',
				component: lazy(() => import('./demos/rail')),
				icon: 'view_sidebar',
				value: 'nav-rail',
			},
			{
				name: 'Drawer',
				component: lazy(() => import('./demos/drawer')),
				icon: 'menu',
				value: 'drawer',
			},
			{
				name: 'Menu',
				component: lazy(() => import('./demos/menu')),
				icon: 'more_vert',
				value: 'menu',
			},

			// Data & Lists
			{
				name: 'Table',
				component: lazy(() => import('./demos/tables')),
				icon: 'table_chart',
				value: 'table',
			},
			{
				name: 'List',
				component: lazy(() => import('./demos/lists')),
				icon: 'list',
				value: 'list',
			},
			{
				name: 'Tree View',
				component: lazy(() => import('./demos/trees')),
				icon: 'account_tree',
				value: 'tree',
			},
			{ name: 'Chips', component: DemoChips, icon: 'label', value: 'chips' },

			// Feedback & Status
			{
				name: 'Progress',
				component: lazy(() => import('./demos/progress')),
				icon: 'pending',
				value: 'progress',
			},
			{
				name: 'Loading',
				component: lazy(() => import('./demos/loading')),
				icon: 'hourglass_empty',
				value: 'loading',
			},
			{
				name: 'Notification',
				component: lazy(() => import('./demos/notifications')),
				icon: 'notifications',
				value: 'notification',
			},

			// Overlays
			{
				name: 'Dialog',
				component: lazy(() => import('./demos/dialog-showcase')),
				icon: 'web_asset',
				value: 'dialog',
			},
			{
				name: 'Sheet',
				component: lazy(() => import('./demos/sheet')),
				icon: 'vertical_split',
				value: 'sheet',
			},
			{ name: 'Details', component: DetailsShowcase, icon: 'expand_more', value: 'details' },

			// Layout Components
			{ name: 'Boat', component: DemoBoat, icon: 'sailing', value: 'boat' },
			{ name: 'Steps', component: DemoSteps, icon: 'linear_scale', value: 'steps' },
			{
				name: 'Content Drawer',
				component: lazy(() => import('./demos/content-drawer-users')),
				icon: 'view_sidebar',
				value: 'content-drawer',
			},

			// Advanced Features (grouped at bottom)
			{ name: 'Context State', component: DemoContext, icon: 'hub', value: 'context' },
			{ name: 'Theme Service', component: ThemeServiceDemo, icon: 'palette', value: 'theme' },
			{ name: 'Area Router', component: DemoAreaDemos, icon: 'view_carousel', value: 'area' },
			{ name: 'Map', component: DemoMap, icon: 'map', value: 'map' },
			{ name: 'Mailbox', component: DemoMailbox, icon: 'mail', value: 'mailbox' },
		]

		// Optional: Group demos by category for visual organization in the sidebar
		// But still keep all demos visible and accessible
		const sections = [
			{ title: 'Core', demos: allDemos.slice(0, 5) },
			{ title: 'Forms', demos: allDemos.slice(5, 9) },
			{ title: 'Navigation', demos: allDemos.slice(9, 14) },
			{ title: 'Data', demos: allDemos.slice(14, 18) },
			{ title: 'Feedback', demos: allDemos.slice(18, 21) },
			{ title: 'Overlays', demos: allDemos.slice(21, 24) },
			{ title: 'Layout', demos: allDemos.slice(24, 27) },
			{ title: 'Advanced', demos: allDemos.slice(27) },
		]

		return html`
			<schmancy-theme root>
				<!-- Toggle between grid and sidebar view -->
				<div class="absolute top-4 right-4 z-10">
					<schmancy-button variant="filled tonal" @click=${() => (this.showGrid = !this.showGrid)}>
						<schmancy-icon slot="prefix"> ${this.showGrid ? 'view_sidebar' : 'grid_view'} </schmancy-icon>
						${this.showGrid ? 'Sidebar View' : 'Grid View'}
					</schmancy-button>
				</div>

				<!-- Flex container for navigation rail and content -->
				<div class="flex h-screen" style="display: ${this.showGrid ? 'none' : 'flex'}">
					<!-- Navigation rail on the left -->
					<schmancy-navigation-rail
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
							<schmancy-area name="main" .default=${'demo-core-buttons'}>
								<schmancy-route when="area" .component=${DemoAreaDemos}></schmancy-route>
							</schmancy-area>
						</schmancy-surface>
					</div>
				</div>

				<!-- Grid view - shows all components at once -->
				<div class="h-screen flex flex-col" style="display: ${this.showGrid ? 'flex' : 'none'}">
					<schmancy-surface type="container" fill="all" class="flex flex-col h-full">
						<!-- Scrollable content area -->
						<schmancy-scroll class="flex-1">
							<div class="px-6 sm:px-8 pb-8">
								<div class="max-w-7xl mx-auto">
									<!-- Grid of all components -->
									<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
										${repeat(
											allDemos,
											demo => demo.value,
											demo => html`
												<schmancy-surface
													type="containerLow"
													rounded="all"
													class="p-4 cursor-pointer hover:elevation-2 transition-all"
													@click=${() => {
														this.showGrid = false
														this.navigate(demo)
													}}
												>
													<div class="flex flex-col items-center gap-3 text-center">
														<schmancy-icon size="lg" class="text-primary"> ${demo.icon} </schmancy-icon>
														<schmancy-typography type="label" token="lg"> ${demo.name} </schmancy-typography>
													</div>
												</schmancy-surface>
											`,
										)}
									</div>

									<!-- Section divider -->
									<schmancy-divider class="my-8"></schmancy-divider>

									<!-- Grouped by sections for reference -->
									${repeat(
										sections,
										section => section.title,
										section => html`
											<div class="mb-8">
												<schmancy-typography type="headline" token="sm" class="mb-4 block">
													${section.title}
												</schmancy-typography>
												<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
													${repeat(
														section.demos,
														demo => demo.value,
														demo => html`
															<schmancy-button
																variant="outlined"
																class="justify-start"
																@click=${() => {
																	this.showGrid = false
																	this.navigate(demo)
																}}
															>
																<schmancy-icon slot="prefix" size="sm"> ${demo.icon} </schmancy-icon>
																${demo.name}
															</schmancy-button>
														`,
													)}
												</div>
											</div>
										`,
									)}
								</div>
							</div>
						</schmancy-scroll>
					</schmancy-surface>
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
