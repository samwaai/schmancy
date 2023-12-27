import { $LitElement } from '@mhmo91/lit-mixins/src'
import { schmancyContentDrawer } from '@schmancy/content-drawer'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { DemoButton } from './button'
import { DemoInput } from './input'
import DemoTypography from './typography'

@customElement('demo-content-drawer')
export class DemoContentDrawer extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-content-drawer minWidth="700">
				<schmancy-content-drawer-main>
					<schmancy-list>
						<schmancy-list-item
							rounded
							selected
							@click=${e => {
								schmancyContentDrawer.render(this, new DemoButton())
							}}
						>
							Buttons
						</schmancy-list-item>
						<schmancy-list-item
							@click=${() => {
								schmancyContentDrawer.render(this, new DemoInput())
							}}
							rounded
						>
							Input
						</schmancy-list-item>
						<schmancy-list-item
							@click=${() => {
								schmancyContentDrawer.render(this, new DemoTypography(), 'Typography')
							}}
							rounded
						>
							Typography
						</schmancy-list-item>
					</schmancy-list>
				</schmancy-content-drawer-main>
				<schmancy-content-drawer-sheet>
					<section slot="placeholder">
						<schmancy-typography> Placeholder </schmancy-typography>
					</section>
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
