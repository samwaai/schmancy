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
				<schmancy-typography type="title">Normal</schmancy-typography>
				<schmancy-button variant="elevated">elevated</schmancy-button>
				<schmancy-button variant="filled">filled</schmancy-button>
				<schmancy-button variant="filled tonal">filled tonal</schmancy-button>
				<schmancy-button variant="text">text</schmancy-button>
				<schmancy-button variant="outlined">outlined</schmancy-button>

				<schmancy-typography type="title">Disable variants</schmancy-typography>
				<schmancy-button disabled variant="elevated">elevated disabled</schmancy-button>
				<schmancy-button disabled variant="filled">filled disabled</schmancy-button>
				<schmancy-button disabled variant="filled tonal">filled tonal disabled</schmancy-button>
				<schmancy-button disabled variant="text">text disabled</schmancy-button>
				<schmancy-button disabled variant="outlined">text disabled</schmancy-button>

				<schmancy-typography type="title">custom variant</schmancy-typography>
				<schmancy-button variant="filled" class="text-white mt-8  h-auto">
					<schmancy-typography class="px-7 py-5" type="headline" token="sm"> Book now </schmancy-typography>
				</schmancy-button>

				<schmancy-typography type="title">Width variant</schmancy-typography>
				<schmancy-button variant="filled" width="full">filled</schmancy-button>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-button': DemoButton
	}
}
