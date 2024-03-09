import { color } from '@schmancy/directives'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
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
	@property({ type: Boolean }) rounded = true

	@property({ type: String, reflect: true }) activeTab: string
	@queryAssignedElements({
		flatten: true,
	})
	private tabsElements!: Array<SchmancyTab>

	@state()
	private tabs: Array<SchmancyTab> = []

	hydrateTabs() {
		this.tabs = this.tabsElements
		if (!this.activeTab && this.tabsElements[0]) {
			this.activeTab = this.tabsElements[0].value
			this.tabsElements[0].active = true
		} else {
			// this.tabsElements.find(tab => tab.value === this.activeTab)?.active = true
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
		const surface = {
			flex: true,
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
				${color({
					bgColor: SchmancyTheme.sys.color.surface.default,
					color: SchmancyTheme.sys.color.surface.on,
				})}
				class="${this.classMap(surface)}"
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
			<schmancy-divider class="mx-6"></schmancy-divider>
			<slot @slotchange="${() => this.hydrateTabs()}"></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab-group': SchmancyTabGroup
	}
}
