import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { DemoCard } from './card'
import { Constructor } from '@schmancy/mixin'
import { DemoInput } from './input'
import DemoTypography from './typography'
import { DemoSheet } from './sheet'
import { DemoContentDrawer } from './drawer-content'

@customElement('demo-tabs')
export class DemoTabs extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() tabs: {
		label: string
		value: string
		component: Constructor<HTMLElement>
	}[] = [
		{ label: 'Card', value: 'card', component: DemoCard },
		{ label: 'Inputs', value: 'inputs', component: DemoInput },
		{ label: 'Typography', value: 'typography', component: DemoTypography },
		{ label: 'Sheet', value: 'sheet', component: DemoSheet },
		{ label: 'Content Drawer', value: 'content-drawer', component: DemoContentDrawer },
	]

	render() {
		return html`
			<section class="relative inset-0">
				<schmancy-tab-group
					class="sticky top-0 pb-[300px]"
					mode="tabs"
					.activeTab=${'inputs'}
					@tab-changed=${v => {
						console.log('tab change', v)
					}}
				>
					${this.tabs.map(
						tab => html`<schmancy-tab value=${tab.value} label=${tab.label}> ${new tab.component()} </schmancy-tab>`,
					)}
				</schmancy-tab-group>
			</section>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'demo-tabs': DemoTabs
	}
}
