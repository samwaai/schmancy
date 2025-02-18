import { $LitElement } from '@mixins/index'
import { SchmancySheetPosition, sheet } from '@schmancy/sheet'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { DemoButton } from '../button'
import DemoTypography from '../typography'
import DemoForm from './form'

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
							component: new DemoButton(),
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
							component: new DemoTypography(),
							header: 'hidden',
						})
					}}
				>
					Side Sheet
				</schmancy-button>
				<!-- demo -->
				<schmancy-button
					variant="elevated"
					@click=${() => {
						sheet.open({
							component: new DemoForm(),
							header: 'visible',
							position: SchmancySheetPosition.Side,
						})
					}}
				>
					Side Sheet
				</schmancy-button>
				<schmancy-button
					variant="elevated"
					@click=${() => {
						sheet.open({
							component: new SheetDemoExample(),
							header: 'visible',
						})
					}}
				>
					Bottom Sheet
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
			<schmancy-grid gap="md" flow="row">
				<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
				<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
				<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
				<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
				<schmancy-input id="name" label="Name" .value=${'John Doe'}></schmancy-input>
			</schmancy-grid>
		`
	}
}

//
