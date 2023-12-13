import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-list')
export class DemoList extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-list>
					<schmancy-list-item>
						<div slot="leading"><img src="house.svg" /></div>
						Mahatma Gandhi
						<div slot="support">Be the change that you wish to see in the world.</div>
						<div slot="trailing"><img src="telephone.svg" /></div>
					</schmancy-list-item>
					<schmancy-list-item>
						<div slot="leading"><img src="house.svg" /></div>
						J.K. Rowling
						<div slot="support">
							“If you want to know what a man's like, </br> take a good look at how he treats his inferiors, not his equals.”
						</div>
					</schmancy-list-item>
				</schmancy-list>


				<schmancy-list>
					<schmancy-list-item active>
						Bookings
					</schmancy-list-item>
					<schmancy-list-item>
						Rooms
					</schmancy-list-item>
					<schmancy-list-item>
						locks
					</schmancy-list-item>
					
				</schmancy-list>

			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-list': DemoList
	}
}
