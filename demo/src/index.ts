import { $LitElement } from '@mixins/index'
import '@schmancy/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@lit-labs/virtualizer'
import { fullHeight } from '../../src/directives/height'
import './features/index'
import { DemoInput } from './features/index'
import { createContext, select } from '@schmancy/index'

type Theme = {
	color: string
	scheme: 'dark' | 'light' | 'auto'
}
const ThemeContext = createContext<Theme>(
	{
		color: '#4479e1',
		scheme: 'dark',
	},
	'memory',
	'theme',
)

@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement(css`
	:root {
		font-family: var(--schmancy-font-family);
	}
`) {
	@select(ThemeContext)
	theme!: Theme
	connectedCallback(): void {
		super.connectedCallback()
		setTimeout(() => {
			ThemeContext.set({
				color: '#228B22',
				scheme: 'light',
			})
		}, 2000)

		ThemeContext.$.subscribe({
			next: () => {
				this.requestUpdate()
			},
		})
	}

	render() {
		console.log(this.theme)
		return html`
			<schmancy-theme root .color=${this.theme.color} .scheme=${this.theme.scheme}>
				<schmancy-surface ${fullHeight()} type="container">
					<schmancy-nav-drawer>
						<schmancy-nav-drawer-navbar width="220px">
							<demo-nav> </demo-nav>
						</schmancy-nav-drawer-navbar>
						<schmancy-nav-drawer-content class="pl-2">
							<schmancy-scroll
								@scroll=${(e: CustomEvent<any>) => {
									console.log('scroll', e)
								}}
							>
								<schmancy-area name="main" .default=${DemoInput}></schmancy-area>
							</schmancy-scroll>
						</schmancy-nav-drawer-content>
					</schmancy-nav-drawer>
				</schmancy-surface>
			</schmancy-theme>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}
