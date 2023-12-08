import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { repeat } from 'lit/directives/repeat.js'
import SchmancyTab from './tab'

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
		const activeTab = {
			'border-[#C6A059]': true,
			'text-[#C6A059]': true,
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
			<div class="hidden sm:block">
				<div class="border-b border-gray-200">
					<nav class="-mb-px flex space-x-8" aria-label="Tabs">
						${repeat(
							this.tabs,
							tab => tab.label,
							tab => html`
								<a
									@click=${() => {
										this.activeTab = tab.label
										this.tabChanged()
									}}
									href="javascript:void(0)"
									class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${this.activeTab === tab.label
										? classMap(activeTab)
										: classMap(inactiveTab)}}"
									aria-current="page"
									><schmancy-typography type="title" token="small" weight="bold"> ${tab.label} </schmancy-typography>
								</a>
							`,
						)}
					</nav>
				</div>
			</div>
			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab-group': SchmancyTabGroup
	}
}
