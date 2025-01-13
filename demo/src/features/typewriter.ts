import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-typewriter-demo')
export class SchmancyTypewriterDemo extends $LitElement() {
	render() {
		return html`
			<schmancy-typography type="display">
				<schmancy-typewriter
					.actions=${[
						'Event-driven Typewriter.',
						{
							action: 'pause',
							value: 1000,
						},
						{ action: 'delete', value: 1 },

						{
							action: 'pause',
							value: 1000,
						},
						' Listening to Events!',
					]}
				></schmancy-typewriter>
			</schmancy-typography>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typewriter-demo': SchmancyTypewriterDemo
	}
}
