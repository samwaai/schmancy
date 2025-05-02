import { $LitElement } from '@mixins/index'
import { SchmancySheetPosition, sheet } from '@schmancy/sheet'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import DemoTypography from '../typography'
import DemoForm from './form'
import { $dialog } from '@schmancy/dialog'

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
					@click=${(e: MouseEvent) => {
						// Basic message dialog
						// $dialog.ask('Are you sure you want to delete this item?')

						// Using a custom component with Lit
						$dialog.component(
							html`
								<schmancy-form class="p-4">
									<schmancy-typography type="body"> This is a custom component inside a dialog! </schmancy-typography>
									<schmancy-input required label="Enter your name" class="mt-4"></schmancy-input>
								</schmancy-form>
							`,
							{
								position: e,
							},
						)
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
