import { $LitElement } from '@mixins/index'
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
				<schmancy-grid
					.rcols=${{
						sm: '1fr',
						md: '1fr 1fr',
						lg: '1fr 1fr 1fr',
						xl: '1fr 1fr 1fr 1fr',
					}}
					class="p-[32px]"
					gap="md"
				>
					<schmancy-card type="outlined">
						<schmancy-card-media
							fit="contain"
							src="https://www.imigrantesbebidas.com.br/img/bebida/images/products/full/1884-refrigerante-coca-cola-2l.jpg?fm=webp&s=f8f15fd600bf0d5e660b1f178060ddf2"
						>
						</schmancy-card-media>
						<schmancy-card-content>
							<span slot="headline">Elbert Hubbard </span>
							<span slot="subhead"> 86573 likes</span>
							A friend is someone who knows all about you and still loves you.
						</schmancy-card-content>
						<schmancy-card-action>
							<schmancy-button variant="filled">Click me</schmancy-button>
						</schmancy-card-action>
					</schmancy-card>

					<schmancy-card type="elevated">
						<schmancy-card-content>
							<span slot="headline">Elbert Hubbard </span>
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
