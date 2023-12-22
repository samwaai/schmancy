import { $LitElement } from '@mhmo91/lit-mixins/src'
import { schmancyDrawer } from '@schmancy/drawer'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-nav')
export class DemoNav extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	toggle(e) {
		e.target.selected = !e.target.selected
		schmancyDrawer.close(this)
	}
	render() {
		return html`
			<schmancy-grid gap="md" justify="center">
				<img class="inline-block h-[80px] w-[80px] rounded-full" src="schmancy.jpg" alt="Schmancy Logo" />
				<schmancy-list type="container">
					<schmancy-list-item rounded selected @click=${this.toggle}> Books </schmancy-list-item>
					<schmancy-list-item rounded @click=${this.toggle}> Songs </schmancy-list-item>
					<schmancy-list-item rounded @click=${this.toggle}> Movies </schmancy-list-item>
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
