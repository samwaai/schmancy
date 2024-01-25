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

	@state() private activeTab: {
		label: string
		value: string
	}

	@queryAssignedElements({
		flatten: true,
	})
	private tabsElements!: Array<SchmancyTab>

	@state()
	private tabs: Array<SchmancyTab> = []

	hydrateTabs() {
		this.tabs = this.tabsElements
		this.activeTab = this.tabsElements.find(tab => tab.active)
		if (!this.activeTab && this.tabsElements[0]) {
			this.activeTab = {
				label: this.tabsElements[0].label,
				value: this.tabsElements[0].value,
			}
			this.tabsElements[0].active = true
		}
	}

	tabChanged() {
		this.tabsElements.forEach(tab => {
			if (tab.value === this.activeTab.value) tab.active = true
			else tab.active = false
		})
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
								this.activeTab = {
									label: tab.label,
									value: tab.value,
								}
								this.tabChanged()
							}}
							aria-current="page"
						>
							<div
								class="${this.activeTab.value === tab.value
									? this.classMap(activeTab)
									: this.classMap(inactiveTab)} h-full"
							>
								<schmancy-typography class="h-full align-middle flex" type="title" token="sm" weight="medium">
									${tab.label}
								</schmancy-typography>
								<div
									.hidden=${this.activeTab.value !== tab.value}
									class="border-primary-default mt-[-4px]  border-2 rounded-t-full"
								></div>
							</div>
						</schmancy-button>
					`,
				)}
			</section>
			<schmancy-divider></schmancy-divider>
			<slot @slotchange="${() => this.hydrateTabs()}"></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab-group': SchmancyTabGroup
	}
}
