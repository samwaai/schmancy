import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-card')
export class DemoCard extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-surface fill type="surface">
				<schmancy-grid class="p-[32px]" gap="md">
					<schmancy-card type="elevated">
						<schmancy-card-content>
							<span slot="headline">Elbert Hubbard </span>
							<span slot="subhead"> 86573 likes</span>
							A friend is someone who knows all about you and still loves you.
						</schmancy-card-content>
					</schmancy-card>

					<schmancy-card type="outlined">
						<schmancy-card-content>
							<span slot="headline">Elbert Hubbard </span>
							<span slot="subhead"> 86573 likes</span>
							A friend is someone who knows all about you and still loves you.
						</schmancy-card-content>
					</schmancy-card>

					<schmancy-card type="filled">
						<schmancy-card-content>
							<span slot="headline">Elbert Hubbard </span>
							<span slot="subhead"> 86573 likes</span>
							A friend is someone who knows all about you and still loves you.
						</schmancy-card-content>
					</schmancy-card>
				</schmancy-grid>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-card': DemoCard
	}
}
