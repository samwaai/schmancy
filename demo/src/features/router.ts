import { $LitElement } from '@schmancy/mixin/lit'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'
import { area } from '@schmancy/area'
import { DemoIcons } from './icons'
import { DemoCard } from './card'

@customElement('demo-router')
export class DemoRouter extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid cols="auto 1fr">
				<schmancy-grid gap="md">
					<schmancy-button
						@click=${() => {
							area.push({
								area: 'subrouter',
								component: DemoIcons,
							})
						}}
						variant="elevated"
						>page 1</schmancy-button
					>
					<schmancy-button
						@click=${() => {
							area.push({
								area: 'subrouter',
								component: DemoCard,
							})
						}}
						variant="elevated"
						>page 2</schmancy-button
					>
				</schmancy-grid>
				<schmancy-area name="subrouter"> </schmancy-area>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-router': DemoRouter
	}
}
