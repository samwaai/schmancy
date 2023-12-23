import { $LitElement } from '@mhmo91/lit-mixins/src'
import { schmancyContentDrawer } from '@schmancy/content-drawer'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { DemoButton } from './button'
import { DemoInput } from './input'

@customElement('demo-content-drawer')
export class DemoContentDrawer extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-content-drawer>
				<schmancy-content-drawer-main>
					<schmancy-list>
						<schmancy-list-item
							rounded
							selected
							@click=${() => {
								schmancyContentDrawer.render(this, DemoButton)
							}}
						>
							Bookings
						</schmancy-list-item>
						<schmancy-list-item
							@click=${() => {
								schmancyContentDrawer.render(this, DemoInput)
							}}
							rounded
						>
							Rooms
						</schmancy-list-item>
						<schmancy-list-item rounded> locks </schmancy-list-item>
					</schmancy-list>
				</schmancy-content-drawer-main>
				<schmancy-content-drawer-sheet>
					<demo-sheet slot="placeholder"></demo-sheet>
				</schmancy-content-drawer-sheet>
			</schmancy-content-drawer>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-content-drawer': DemoContentDrawer
	}
}
