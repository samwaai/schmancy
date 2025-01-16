import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-typewriter-demo')
export class SchmancyTypewriterDemo extends $LitElement() {
	render() {
		return html`
			<schmancy-typewriter .speed=${10} .cursor=${true} .cursorChar=${'|'} .autoStart=${true}>
				Hello, world!
				<span action="pause" value="1000"></span>
				Welcome to <strong>Schmancy</strong>.
				<span action="delete" value="9"></span>
				Lit Components!
			</schmancy-typewriter>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typewriter-demo': SchmancyTypewriterDemo
	}
}
