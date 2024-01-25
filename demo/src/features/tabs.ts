import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
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
	}[] = []

	connectedCallback(): void {
		super.connectedCallback()
		timer(0).subscribe({
			next: () => {
				this.tabs = [
					{ label: 'Card', value: 'card' },
					{ label: 'Inputs', value: 'inputs' },
					{ label: 'Typography', value: 'typography' },
					{ label: 'Sheet', value: 'sheet' },
					{ label: 'Content Drawer', value: 'content-drawer' },
				]

				this.requestUpdate()
			},
		})
	}

	render() {
		return html`<schmancy-tab-group
			@tab-changed=${() => {
				console.log('click')
			}}
		>
			${this.tabs.map(tab => html`<schmancy-tab value=${tab.value} label=${tab.label}> Hello</schmancy-tab>`)}
		</schmancy-tab-group>`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'demo-tabs': DemoTabs
	}
}
