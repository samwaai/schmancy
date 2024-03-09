import { $LitElement } from '@mhmo91/lit-mixins/src'
import { PropertyValueMap, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { timer } from 'rxjs'

@customElement('demo-tabs')
export class DemoTabs extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() tabs: {
		label: string
		value: string
	}[] = [
		{ label: 'Card', value: 'card' },
		{ label: 'Inputs', value: 'inputs' },
		{ label: 'Typography', value: 'typography' },
		{ label: 'Sheet', value: 'sheet' },
		{ label: 'Content Drawer', value: 'content-drawer' },
	]

	render() {
		return html` <schmancy-flex justify="center">
			<schmancy-tab-group
				.activeTab=${'inputs'}
				@tab-changed=${v => {
					console.log('tab change', v)
				}}
			>
				${this.tabs.map(tab => html`<schmancy-tab value=${tab.value} label=${tab.label}> Hello</schmancy-tab>`)}
			</schmancy-tab-group>
		</schmancy-flex>`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'demo-tabs': DemoTabs
	}
}
