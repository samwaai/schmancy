import { provide } from '@lit/context'
import { color } from '@schmancy/directives'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, fromEvent, map, tap, throttleTime } from 'rxjs'
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

	@query('#tabs') navElement!: HTMLElement

	@state()
	private tabs: Array<SchmancyTab> = []

	connectedCallback(): void {
		super.connectedCallback()
		fromEvent(window, 'scroll')
			.pipe(
				filter(() => this.mode === 'scroll'),
				throttleTime(100, undefined, { leading: true, trailing: false }),
				tap(console.log),

				map(() => {
					let closestDiv = null
					let closestDistance = Infinity
					this.tabsElements.forEach(div => {
						const distance =
							div.getBoundingClientRect().top -
							this.navElement.clientHeight +
							Math.max(document.body.scrollHeight, document.body.offsetHeight) / 1.6

						if (distance < closestDistance && distance > 0) {
							closestDistance = distance
							closestDiv = div
						}
					})
					return closestDiv
				}),
			)
			.subscribe({
				next: (el: SchmancyTab) => {
					this.activeTab = el.value
					console.log('el', el.value)
				},
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
	}

	tabChanged(selectedTab: { label: string; value: string }) {
		this.tabsElements.forEach(tab => {
			if (tab.value === selectedTab.value) tab.active = true
			else tab.active = false
		})
		this.activeTab = selectedTab.value
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
				id="tabs"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.default,
					color: SchmancyTheme.sys.color.surface.on,
				})}
				class="${this.classMap(tabs)}"
				aria-label="Tabs"
			>
				${repeat(
					this.tabs,
					tab => tab.label,
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
			<slot @slotchange=${() => this.hydrateTabs()}></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab-group': SchmancyTabGroup
	}
}
