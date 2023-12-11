import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, queryAssignedElements, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import SchmancyTab from './tab'
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'

@customElement('schmancy-tab-group')
export default class SchmancyTabGroup extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@state() private activeTab!: string

	@queryAssignedElements({
		flatten: true,
	})
	private tabsElements!: Array<SchmancyTab>

	@state()
	private tabs: Array<SchmancyTab> = []

	protected firstUpdated(): void {
		this.tabs = this.tabsElements
		this.activeTab = this.tabs.find(tab => tab.active)?.label ?? this.tabs[0].label
	}

	tabChanged() {
		this.tabsElements.forEach(tab => {
			if (tab.label === this.activeTab) tab.active = true
			else tab.active = false
		})
	}

	protected render(): unknown {
		const surface = {
			'hidden sm:grid grid-flow-col-dense': true,
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
			<div class="sm:hidden">
				<label for="tabs" class="sr-only">Select a tab</label>
				<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
				<select
					id="tabs"
					name="tabs"
					class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#C6A059] focus:outline-none focus:ring-[#C6A059] sm:text-sm"
					@change=${(e: Event) => {
						this.activeTab = (e.target as HTMLSelectElement).value
						this.tabChanged()
					}}
				>
					${repeat(
						this.tabs,
						tab => tab.label,
						tab => html` <option selected>${tab.label}</option> `,
					)}
				</select>
			</div>

			<nav
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
								this.activeTab = tab.label
								this.tabChanged()
							}}
							aria-current="page"
						>
							<div
								class="${this.activeTab === tab.label ? this.classMap(activeTab) : this.classMap(inactiveTab)} h-full"
							>
								<schmancy-typography class="h-full align-middle flex" type="title" token="sm" weight="medium">
									${tab.label}
								</schmancy-typography>
								<div
									.hidden=${this.activeTab != tab.label}
									class="border-primary-default mt-[-4px]  border-2 rounded-t-full"
								></div>
							</div>
						</schmancy-button>
					`,
				)}
			</nav>
			<schmancy-divider></schmancy-divider>

			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab-group': SchmancyTabGroup
	}
}
