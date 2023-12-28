import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-surface')
export class DemoSurface extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid cols="auto auto" gap="md">
				<schmancy-surface class="p-4" rounded="all" elevation="1" type="surface">
					<div class="h-[320px] w-[320px]">
						<schmancy-typography type="title">Surface default</schmancy-typography>
					</div>
				</schmancy-surface>
				<schmancy-surface rounded="all" elevation="1" type="container">
					<div class="h-[320px] w-[320px]">
						<schmancy-typography type="title">Surface container</schmancy-typography>
					</div>
				</schmancy-surface>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-surface': DemoSurface
	}
}
