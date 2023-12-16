import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-nav')
export class DemoNav extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md" justify="center">
				<img class="inline-block h-[80px] w-[80px] rounded-full" src="schmancy.jpg" alt="Schmancy Logo" />
				<schmancy-list type="container">
					<schmancy-list-item rounded selected> Books </schmancy-list-item>
					<schmancy-list-item
						rounded
						@click=${e => {
							e.target.selected = true
						}}
					>
						Songs
					</schmancy-list-item>
					<schmancy-list-item
						@click=${e => {
							e.target.selected = true
						}}
						rounded
					>
						Movies
					</schmancy-list-item>
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
