import { $LitElement } from '@mixins/index'
import { SchmancySheetPosition, sheet } from '@schmancy/sheet'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { DemoInput } from './input'

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
							component: new DemoInput(),
							position: SchmancySheetPosition.Bottom,
							title: 'Bottom Sheet',
							header: 'visible',
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
							header: 'hidden',
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
				<schmancy-grid gap="md" flow="col">
					<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
					<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
					<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
					<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
					<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
				</schmancy-grid>
				<demo-list class="p-4"></demo-list>
			</schmancy-surface>
		`
	}
}
