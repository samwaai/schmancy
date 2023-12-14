import { ColorConfig, color } from '@schmancy/directives'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'
import { SchmancyTheme } from '@schmancy/theme'

@customElement('demo-layout')
export class DemoLayout extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		const colors: ColorConfig = {
			bgColor: SchmancyTheme.sys.color.primary.default,
		}
		return html`
			<schmancy-grid cols="1fr auto 1fr" ${color(colors)} gap="md">
				<demo-typography> </demo-typography>
				<demo-list> </demo-list>
				<schmancy-button>Something</schmancy-button>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-layout': DemoLayout
	}
}
