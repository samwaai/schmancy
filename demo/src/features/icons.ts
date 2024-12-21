import { $LitElement } from '@mixins/index'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-icons')
export class DemoIcons extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-icon size="80px">delete</schmancy-icon>
				<schmancy-icon size="40px">delete</schmancy-icon>
				<schmancy-icon>delete</schmancy-icon>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-icons': DemoIcons
	}
}
