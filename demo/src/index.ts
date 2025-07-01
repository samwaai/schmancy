import { $LitElement } from '@mixins/index'
import '@schmancy/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@lit-labs/virtualizer'
import { createCompoundSelector, createContext, select } from '@schmancy/index'
import { fullHeight } from '../../src/directives/height'
import './features/index'
import '../../src/boat/boat'

type Theme = {
	color: string
	scheme: 'dark' | 'light' | 'auto'
}
const ThemeContext = createContext<Theme>(
	{
		color: '#4479e1',
		scheme: 'auto',
	},
	'memory',
	'theme',
)

type User = {
	name: string
}
const UserContext = createContext<User>({ name: 'mo' }, 'memory', 'user-context')

const compoundSelector = createCompoundSelector([ThemeContext, UserContext], [a => a, b => b], (_theme, user) => ({
	name: user.name,
}))
@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement(css`
	:root {
		font-family: var(--schmancy-font-family);
	}
`) {
	@select(ThemeContext)
	theme!: Theme

	@select(compoundSelector)
	user!: {
		name: string
	}
	connectedCallback(): void {
		super.connectedCallback()

		setTimeout(() => {
			UserContext.$.next({
				name: 'Momooooo',
			})
		}, 5000)
	}

	render() {
		console.log(this.theme)
		console.log(this.user)
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
								<schmancy-area name="main"></schmancy-area>
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
