import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-animated-text')
export class DemoAnimatedText extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-typography type="display">
					<schmancy-animated-text>Animated Text</schmancy-animated-text>
				</schmancy-typography>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-animated-text': DemoAnimatedText
	}
}
