import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

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
				<schmancy-typography type="display">
					<schmancy-animated-text stagger=${100}>Staggered Animated Text</schmancy-animated-text>
				</schmancy-typography>

				<!-- fast stagger -->
				<schmancy-typography type="display">
					<schmancy-animated-text stagger=${10}>Fast Staggered Animated Text</schmancy-animated-text>
				</schmancy-typography>
				<schmancy-typography type="display">
					<schmancy-animated-text delay=${1000}>Delayed Animated Text</schmancy-animated-text>
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
