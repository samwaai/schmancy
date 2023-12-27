import { $LitElement } from '@mhmo91/lit-mixins/src'
import { SchmancySheetPosition, sheet } from '@schmancy/sheet'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-sheet')
export class DemoSheet extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-button
					variant="elevated"
					@click=${() => {
						sheet.open({
							component: new SheetDemoExample(),
							position: SchmancySheetPosition.Bottom,
							title: 'Bottom Sheet',
						})
					}}
				>
					Bottom Sheet
				</schmancy-button>

				<schmancy-button
					variant="elevated"
					@click=${() => {
						sheet.open({
							component: new SheetDemoExample(),
							position: SchmancySheetPosition.Side,
							title: 'Side Sheet',
						})
					}}
				>
					Side Sheet
				</schmancy-button>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-sheet': DemoSheet
	}
}

@customElement('sheet-demo-example')
class SheetDemoExample extends $LitElement() {
	render() {
		return html`
			<schmancy-surface type="surface" rounded="all">
				<demo-list class="p-4"></demo-list>
			</schmancy-surface>
		`
	}
}
