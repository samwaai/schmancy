import { $LitElement } from '@mixins/index'
import '@schmancy/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

import '@lit-labs/virtualizer'
import { area, lazy } from '@schmancy/area'
import { createCompoundSelector, createContext, select } from '@schmancy/index'
import '../../src/boat/boat'
import '../../src/navigation-rail/navigation-rail'
import '../../src/navigation-rail/navigation-rail-item'
import { DemoAreaDemos } from './features/area/area-demos'
import './features/index'
// Key Features
import { DemoContext } from './features/context'
import { ThemeServiceDemo } from './features/theme-service-demo'

// Core Components (these will be loaded via lazy loading now)
import { DemoChips } from './features/chips'
import { DemoMap } from './features/map'

// Layout & Navigation
import { DemoBoat } from './features/boat'
import { DemoSteps } from './features/steps'

// Other Components
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
	connectedCallback(): void {
		super.connectedCallback()

		setTimeout(() => {
			UserContext.$.next({
				name: 'Momooooo',
			})
		}, 5000)
	}

	private navigate(demo: { name: string; component: CustomElementConstructor; value: string }) {
		// Update active component for highlighting
		this.activeComponent = demo.value

		// Simple navigation - just use area.push with the component
		area.push({
			area: 'main',
			component: demo.component
		})
	}


	render() {
		// Define icons for each demo item
		const sections = [
			{
				title: 'Key Features',
				demos: [
					{ name: 'Context', component: DemoContext, icon: 'hub', value: 'context' },
					{ name: 'Area', component: DemoAreaDemos as any, icon: 'view_carousel', value: 'area' },
					{ name: 'Theme Service', component: ThemeServiceDemo, icon: 'palette', value: 'theme' },
				]
			},
			{
				title: 'Core',
				demos: [
					{ name: 'Chips', component: DemoChips, icon: 'label', value: 'chips' },
					{ name: 'Details', component: DetailsShowcase, icon: 'expand_more', value: 'details' },
					{ name: 'Map', component: DemoMap, icon: 'map', value: 'map' },
					{ name: 'Mailbox', component: DemoMailbox, icon: 'mail', value: 'mailbox' },
				]
			},
			{
				title: 'Components',
				demos: [
					{ name: 'Forms', component: lazy(() => import('./features/forms-demos')) as any, icon: 'edit_note', value: 'forms' },
					{ name: 'Navigation', component: lazy(() => import('./features/navigation-demos')) as any, icon: 'navigation', value: 'navigation' },
					{ name: 'Data Display', component: lazy(() => import('./features/data-display-demos')) as any, icon: 'table_chart', value: 'data-display' },
					{ name: 'Overlays', component: lazy(() => import('./features/overlays-demos')) as any, icon: 'layers', value: 'overlays' },
				]
			},
			{
				title: 'Layout',
				demos: [
					{ name: 'Boat', component: DemoBoat, icon: 'sailing', value: 'boat' },
					{ name: 'Steps', component: DemoSteps, icon: 'linear_scale', value: 'steps' },
				]
			},
		]

		return html`
			<schmancy-theme root .color=${this.theme.color} .scheme=${this.theme.scheme}>
				<!-- Flex container for navigation rail and content -->
				<div class="flex h-screen">
					<!-- Navigation rail on the left -->
					<schmancy-navigation-rail
						label-visibility="selected"
						.activeValue=${this.activeComponent}
						@navigate=${(e: CustomEvent<string>) => {
							const demo = sections.flatMap(s => s.demos).find(d => d.value === e.detail)
							if (demo) this.navigate(demo)
						}}
					>
						<!-- Header with Schmancy branding -->
						<div slot="header" class="p-4 text-center">
							<schmancy-typography type="headline" token="sm" class="mb-1">
								Schmancy
							</schmancy-typography>
							<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
								Web Components
							</schmancy-typography>
						</div>

						<!-- Navigation items grouped by section -->
						${repeat(
							sections,
							section => section.title,
							section => {
								return html`
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
										`
									)}

									<!-- Add divider between sections -->
									${section !== sections[sections.length - 1] ? html`
										<schmancy-divider></schmancy-divider>
									` : ''}
								`
							}
						)}
					</schmancy-navigation-rail>

					<!-- Main content area - flex-1 to take remaining space, overflow-auto for scrolling -->
					<div class="flex-1 overflow-auto">
						<schmancy-surface type="container" fill="all" class="h-full">
							<schmancy-area name="main" .default=${DemoAreaDemos}>
								<schmancy-route when="area" .component=${DemoAreaDemos}></schmancy-route>
							</schmancy-area>
						</schmancy-surface>
					</div>
				</div>
				<sch-notification-container></sch-notification-container>
			</schmancy-theme>


		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}
