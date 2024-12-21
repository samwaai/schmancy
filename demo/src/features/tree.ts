import { $LitElement } from '@mixins/index'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-tree')
export class DemoTree extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-tree>
					<schmancy-list-item slot="root"> root</schmancy-list-item>
					<schmancy-list>
						<schmancy-list-item active>Item 1.1</schmancy-list-item>
						<schmancy-list-item>Item 1.2</schmancy-list-item>
						<schmancy-list-item>Item 1.3</schmancy-list-item>
					</schmancy-list>
				</schmancy-tree>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-tree': DemoTree
	}
}
