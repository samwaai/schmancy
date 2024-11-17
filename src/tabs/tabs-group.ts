import { provide } from '@lit/context'
import { color } from '@schmancy/directives'
import { TailwindElement } from '@mhmo91/lit-mixins/src'

import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, fromEvent, interval, map, take, throttleTime } from 'rxjs'
import { SchmancyTabsModeContext, TSchmancyTabsMode } from './context'
import SchmancyTab from './tab'

/**
 * @slot - The content of the tab group
 * @fires tab-changed - The event fired when the tab is changed
 */
@customElement('schmancy-tab-group')
export default class SchmancyTabGroup extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@provide({ context: SchmancyTabsModeContext })
	@property({ type: String })
	mode: TSchmancyTabsMode = 'tabs'

	@property({ type: Boolean }) rounded = true

	@property({ type: String, reflect: true }) activeTab: string
	@queryAssignedElements({
		flatten: true,
	})
	private tabsElements!: Array<SchmancyTab>

	@query('#tabsNavigation') navElement!: HTMLElement
	@query('#tabsContent') tabsContent!: HTMLElement

	@state()
	private tabs: Array<SchmancyTab> = []

	connectedCallback(): void {
		super.connectedCallback()
		fromEvent(window, 'scroll')
			.pipe(
				throttleTime(1000),
				filter(() => this.mode === 'scroll'),
				map(() => {
					let closestDiv = null
					let closestDistance = Infinity
					this.tabsElements.forEach(div => {
						const distance =
							div.getBoundingClientRect().top - this.navElement.clientHeight + document.body.offsetHeight / 3

						if (distance < closestDistance && distance > 0) {
							closestDistance = distance
							closestDiv = div
						}
					})
					return closestDiv
				}),
				filter((el: SchmancyTab | null) => el !== null),
			)
			.subscribe({
				next: (el: SchmancyTab) => {
					this.activeTab = el.value
				},
			})
	}

	firstUpdated() {
		interval(0)
			.pipe(
				filter(() => !!this.navElement.clientHeight),
				take(1),
			)
			.subscribe(() => {
				this.tabsElements.forEach(tab => {
					if (this.mode === 'scroll') tab.style.paddingTop = this.navElement.clientHeight + 'px'
				})
			})
	}

	hydrateTabs() {
		this.tabs = this.tabsElements
		if (!this.activeTab && this.tabsElements[0]) {
			this.activeTab = this.tabsElements[0].value
			this.tabsElements[0].active = true
		} else {
			this.tabsElements.forEach(tab => {
				if (tab.value === this.activeTab) tab.active = true
				else tab.active = false
			})
		}
		const lastTab = this.tabs?.[-1]
		if (lastTab) {
			lastTab.style.paddingBottom = lastTab.offsetHeight + 'px'
		}
	}

	tabChanged(selectedTab: { label: string; value: string }) {
		let activeTabElement: SchmancyTab | undefined
		this.tabsElements.forEach(tab => {
			if (tab.value === selectedTab.value) {
				tab.active = true
				activeTabElement = tab
				// scroll to the tab
				if (this.mode === 'scroll') {
					// Scroll the desired element into view
					activeTabElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
						inline: 'start',
					})
				}
			} else {
				tab.active = false
			}
		})
		this.mode === 'tabs' && (this.activeTab = selectedTab.value)
		this.dispatchEvent(new CustomEvent('tab-changed', { detail: this.activeTab }))
	}

	protected render(): unknown {
		const tabs = {
			'flex z-50': true,
			'sticky top-0 shadow-md': this.mode === 'scroll',
			'rounded-full': this.rounded,
		}

		const activeTab = {
			'text-primary-default': true,
		}

		const inactiveTab = {
			'border-transparent': true,
			'hover:text-gray-700': true,
			'hover:border-gray-300': true,
			'text-gray-500': true,
		}

		return html`
			<section
				id="tabsNavigation"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.default,
					color: SchmancyTheme.sys.color.surface.on,
				})}
				class="${this.classMap(tabs)}"
				aria-label="Tabs"
			>
				${repeat(
					this.tabs,
					tab => tab.value,
					tab => html`
						<schmancy-button
							@click=${() => {
								this.tabChanged({
									label: tab.label,
									value: tab.value,
								})
							}}
							aria-current="page"
							class="h-auto relative"
						>
							<div
								class="px-4 py-3 ${this.activeTab === tab.value
									? this.classMap(activeTab)
									: this.classMap(inactiveTab)}"
							>
								<schmancy-typography class="h-full align-middle flex " type="title" token="md" weight="medium">
									${tab.label}
								</schmancy-typography>
								<div
									.hidden=${this.activeTab !== tab.value}
									class="border-primary-default absolute bottom-0 inset-x-6  border-2 rounded-t-full"
								></div>
							</div>
						</schmancy-button>
					`,
				)}
			</section>
			<schmancy-divider class="px-6"></schmancy-divider>
			<section id="tabsContent">
				<slot @slotchange=${() => this.hydrateTabs()}></slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab-group': SchmancyTabGroup
	}
}
