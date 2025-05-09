import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-list')
export class DemoList extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-typography type="title">Standard list items</schmancy-typography>
				<schmancy-list surface="surfaceDim" class="rounded-full">
					<schmancy-list-item>
						<schmancy-icon>book_online</schmancy-icon>

						<div></div>
						Be the change that you wish to see in the world.
						<schmancy-menu>
							<schmancy-menu-item>Bookings</schmancy-menu-item>
							<schmancy-menu-item>Rooms</schmancy-menu-item>
							<schmancy-menu-item>Locks</schmancy-menu-item>
						</schmancy-menu>
					</schmancy-list-item>

					<schmancy-list-item>
						“If you want to know what a man's like, <br />take a good look at how he treats his inferiors, not his
						equals.”
					</schmancy-list-item>
				</schmancy-list>

				<schmancy-divider orientation="horizontal"></schmancy-divider>

				<schmancy-typography type="title">Rounded list items</schmancy-typography>
				<schmancy-list>
					<schmancy-list-item rounded selected>
						<schmancy-icon slot="leading">book_online</schmancy-icon>
						Bookings
					</schmancy-list-item>
					<schmancy-list-item rounded> Rooms </schmancy-list-item>
					<schmancy-list-item rounded> locks </schmancy-list-item>
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
