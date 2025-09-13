import { $LitElement } from '@mixins/index'
import '@schmancy/index'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, map } from 'rxjs'

import '@lit-labs/virtualizer'
import { createCompoundSelector, createContext, select } from '@schmancy/index'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { fullHeight } from '../../src/directives/height'
import './features/index'
import '../../src/boat/boat'
import { DemoAreaDemos } from './features/area/area-demos'

// Key Features
import { DemoContext } from './features/context'
import { ThemeServiceDemo } from './features/theme-service-demo'

// Core Components
import { DemoButton } from './features/button'
import { DemoBusy } from './features/busy'
import { DemoCard } from './features/card'
import { DemoChips } from './features/chips'
import { DemoIcons } from './features/icons'
import { DemoInput } from './features/input'
import { DemoSurface } from './features/surface'
import DemoTypography from './features/typography'
import NotificationDemo from './features/notifications'
import { DemoMap } from './features/map'

// Layout & Navigation
import { DemoBoat } from './features/boat'
import { DemoLayout } from './features/layout'
import { DemoSteps } from './features/steps'

// Form Controls
import { DemoAutocomplete } from './features/autocomplete'
import { DemoDateRange } from './features/date-range'
import DemoProgress from './features/progress'
import { DemoRadio } from './features/radio'
import { DemoSelect } from './features/select'
import { DemoSheet } from './features/sheet-demo'
import { DemoSlider } from './features/slider'
import { DemoDateRangeInline } from './features/date-range-inline'
import DetailsShowcase from './features/details-showcase'
import { DemoMailbox } from './features/mailbox'

type Theme = {
	color: string
	scheme: 'dark' | 'light' | 'auto'
}
const ThemeContext = createContext<Theme>(
	{
		color: '#4479e1',
		scheme: 'auto',
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
export default class SchmancyDemo extends $LitElement(css`
	:root {
		font-family: var(--schmancy-font-family);
	}
`) {
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

		// Subscribe to route changes
		area.$current
			.pipe(
				filter(r => r.has('main')),
				map(r => r.get('main')),
			)
			.subscribe(r => {
				if (r?.component) {
					// Convert tag name to class name format
					this.activeComponent = r.component.toLowerCase().replace(/-/g, '')
				}
			})
	}

	private navigate(demo: { name: string; component: CustomElementConstructor }) {
		schmancyNavDrawer.close(this)

		// Simple navigation - just use area.push with the component
		area.push({
			area: 'main',
			component: demo.component
		})
	}

	render() {
		const sections = [
			{
				title: 'Key Features',
				demos: [
					{ name: 'Context', component: DemoContext },
					{ name: 'Area', component: DemoAreaDemos as any },
					{ name: 'Theme Service', component: ThemeServiceDemo },
				]
			},
			{
				title: 'Core',
				demos: [
					{ name: 'Typography', component: DemoTypography },
					{ name: 'Button', component: DemoButton },
					{ name: 'Card', component: DemoCard },
					{ name: 'Chips', component: DemoChips },
					{ name: 'Surface', component: DemoSurface },
					{ name: 'Icons', component: DemoIcons },
					{ name: 'Progress', component: DemoProgress },
					{ name: 'Spinner', component: DemoBusy },
					{ name: 'Notifications', component: NotificationDemo },
					{ name: 'Details', component: DetailsShowcase },
					{ name: 'Map', component: DemoMap },
					{ name: 'Mailbox', component: DemoMailbox },
				]
			},
			{
				title: 'Forms',
				demos: [
					{ name: 'Input', component: DemoInput },
					{ name: 'Autocomplete', component: DemoAutocomplete },
					{ name: 'Date Range', component: DemoDateRange },
					{ name: 'Date Range inline', component: DemoDateRangeInline },
					{ name: 'Radio', component: DemoRadio },
					{ name: 'Select', component: DemoSelect },
					{ name: 'Slider', component: DemoSlider },
				]
			},
			{
				title: 'Layout',
				demos: [
					{ name: 'Layout', component: DemoLayout },
					{ name: 'Boat', component: DemoBoat },
					{ name: 'Steps', component: DemoSteps },
					{ name: 'Sheet', component: DemoSheet }
				]
			},
		]

		return html`
			<schmancy-theme root .color=${this.theme.color} .scheme=${this.theme.scheme}>
				<schmancy-surface ${fullHeight()} type="container">
					<schmancy-nav-drawer>
						<schmancy-nav-drawer-navbar width="220px">
							<div class="flex flex-col h-screen overflow-hidden">
								<div class="p-6 flex-shrink-0">
									<schmancy-typography type="headline" token="sm" class="mb-1">
										Schmancy
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Web Component Library
									</schmancy-typography>
								</div>

								<div class="px-4 overflow-y-auto space-y-4 flex-1 min-h-0">
									${repeat(
										sections,
										section => section.title,
										section => {
											return html`
											<schmancy-divider></schmancy-divider>
												<div class="pt-4">
													<div class="text-xs font-semibold text-primary-default mb-3 mt-6 first:mt-0">${section.title}</div>
													<schmancy-list>
														${repeat(
															section.demos,
															demo => demo.name,
															demo => html`
																<schmancy-list-item
																	rounded
																	class="my-1 cursor-pointer text-sm rounded-lg transition-colors hover:bg-surface-container"
																	.selected=${this.activeComponent === demo.component.name?.toLowerCase().replace(/-/g, '')}
																	@click=${() => this.navigate(demo)}
																>
																	${demo.name}
																</schmancy-list-item>
															`
														)}
													</schmancy-list>
												</div>
											`
										}
									)}
								</div>
							</div>
						</schmancy-nav-drawer-navbar>
						<schmancy-nav-drawer-content class="pl-2">
							<schmancy-scroll>
								<schmancy-area name="main" .default=${DemoAreaDemos}>
									<schmancy-route when="area" .component=${DemoAreaDemos}></schmancy-route>
								</schmancy-area>
							</schmancy-scroll>
						</schmancy-nav-drawer-content>
					</schmancy-nav-drawer>
				</schmancy-surface>
			</schmancy-theme>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}
