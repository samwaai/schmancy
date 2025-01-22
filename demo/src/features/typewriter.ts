import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-typewriter-demo')
export class SchmancyTypewriterDemo extends $LitElement() {
	render() {
		return html`
			<schmancy-delay delay="0">
				<schmancy-grid class="w-full text-center">
					<schmancy-delay>
						<schmancy-typewriter .speed=${10} .cursor=${true} .cursorChar=${'|'} .autoStart=${true}>
							Hello, world!
							<span action="pause" value="1000"></span>
							Welcome to <strong>Schmancy</strong>.
							<span action="delete" value="2"></span>
							Lit Components!
						</schmancy-typewriter>
					</schmancy-delay>
					<schmancy-delay .delay=${1000}>
						<schmancy-divider grow="both"></schmancy-divider>
					</schmancy-delay>
					<schmancy-delay .delay=${1000}>
						<schmancy-typewriter .speed=${30} cursorChar="|">
							We empower organizations to operate
							<p>Efficiently, Seamlessly, and Affordably</p>
							<p>Through digital transformation.</p>
						</schmancy-typewriter>
					</schmancy-delay>
				</schmancy-grid>
			</schmancy-delay>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typewriter-demo': SchmancyTypewriterDemo
	}
}
