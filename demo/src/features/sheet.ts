import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'
import { SchmancySheetPosition, sheet } from '@schmancy/sheet'
import { DemoList } from './list'

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
					@click=${() => {
						sheet.open({
							component: new DemoList(),
							position: SchmancySheetPosition.BottomCenter,
						})
					}}
					>left Side sheet</schmancy-button
				>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-sheet': DemoSheet
	}
}
