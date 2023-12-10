import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-button')
export class DemoButton extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-button variant="elevated">elevated</schmancy-button>
				<schmancy-button variant="filled">filled</schmancy-button>
				<schmancy-button variant="filled tonal">filled tonal</schmancy-button>
				<schmancy-button variant="text">text</schmancy-button>
				<schmancy-button variant="outlined">outlined</schmancy-button>

				<schmancy-button disabled variant="elevated">elevated disabled</schmancy-button>
				<schmancy-button disabled variant="filled">filled disabled</schmancy-button>
				<schmancy-button disabled variant="filled tonal">filled tonal disabled</schmancy-button>
				<schmancy-button disabled variant="text">text disabled</schmancy-button>
				<schmancy-button disabled variant="outlined">text disabled</schmancy-button>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-button': DemoButton
	}
}
