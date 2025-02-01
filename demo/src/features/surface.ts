import { $LitElement } from '@mixins/index'
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
			<schmancy-grid gap="md">
				<schmancy-grid cols="auto auto auto" gap="md">
					<schmancy-surface rounded="all" elevation="4" type="surface">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface default</schmancy-typography>
						</div>
					</schmancy-surface>
					<schmancy-surface rounded="all" elevation="1" type="surfaceBright">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface Bright</schmancy-typography>
						</div>
					</schmancy-surface>
					<schmancy-surface rounded="all" elevation="1" type="surfaceDim">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface Dim</schmancy-typography>
						</div>
					</schmancy-surface>
				</schmancy-grid>
				<schmancy-grid cols="auto auto auto" gap="md">
					<schmancy-surface rounded="all" elevation="1" type="container">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface container default</schmancy-typography>
						</div>
					</schmancy-surface>
					<schmancy-surface rounded="all" elevation="1" type="containerHigh">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface container High</schmancy-typography>
						</div>
					</schmancy-surface>

					<schmancy-surface rounded="all" elevation="1" type="containerHighest">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface container highest</schmancy-typography>
						</div>
					</schmancy-surface>

					<schmancy-surface rounded="all" elevation="1" type="containerLow">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface container low</schmancy-typography>
						</div>
					</schmancy-surface>

					<schmancy-surface rounded="all" elevation="1" type="containerLowest">
						<div class="h-[320px] w-[320px] p-4">
							<schmancy-typography type="title">Surface container lowest</schmancy-typography>
						</div>
					</schmancy-surface>
				</schmancy-grid>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-surface': DemoSurface
	}
}
