import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-nav')
export class DemoNav extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	toggle(e) {
		e.target.selected = !e.target.selected
	}
	render() {
		return html`
			<schmancy-grid gap="md" justify="center">
				<img class="inline-block h-[80px] w-[80px] rounded-full" src="schmancy.jpg" alt="Schmancy Logo" />
				<schmancy-list type="container">
					<schmancy-list-item rounded selected @click=${this.toggle}> Books </schmancy-list-item>
					<schmancy-list-item rounded @click=${this.toggle}> Songs </schmancy-list-item>
					<schmancy-list-item @click=${this.toggle} rounded> Movies </schmancy-list-item>
				</schmancy-list>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-nav': DemoNav
	}
}
