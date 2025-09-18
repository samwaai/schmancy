import { $LitElement } from '@mixins/index'
import { schmancyContentDrawer } from '@schmancy/content-drawer'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
// Temporary imports from core-demos until we refactor
// For now, create instances directly
const DemoButton = class extends $LitElement() {
	render() {
		return html`<div>Button Demo Component</div>`
	}
}

const DemoTypography = class extends $LitElement() {
	render() {
		return html`<div>Typography Demo Component</div>`
	}
}

@customElement('layout-drawer')
export default class LayoutDrawer extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() private buttonDemo = new DemoButton()
	@state() private typographyDemo = new DemoTypography()
	@state() private demoCounter = 0

	render() {
		return html`
			<schmancy-content-drawer>
				<schmancy-content-drawer-main>
					<schmancy-list class="p-0">
						<schmancy-list-item
							headline="Uses new push API"
							supportingText="Same instance with counter: ${this.demoCounter}"
							@click=${() => {
								// Using new push API with same instance
								this.demoCounter++
								schmancyContentDrawer.push(this.buttonDemo)
							}}
						>
							Buttons (Push API)
						</schmancy-list-item>
						<schmancy-list-item
							headline="Uses legacy render API"
							supportingText="Creates new instance each time"
							@click=${() => {
								// Using legacy render API
								schmancyContentDrawer.render(this, new DemoButton())
							}}
						>
							Buttons (Render API)
						</schmancy-list-item>
						<schmancy-divider></schmancy-divider>
						<schmancy-list-item
							@click=${() => {
								schmancyContentDrawer.push(this.typographyDemo)
							}}
						>
							Typography (Push)
						</schmancy-list-item>
						<schmancy-divider></schmancy-divider>
						<schmancy-list-item
							headline="Push with string"
							supportingText="Creates element from tag name"
							@click=${() => {
								schmancyContentDrawer.push('demo-button')
							}}
						>
							String Component
						</schmancy-list-item>
						<schmancy-list-item
							headline="Push with factory"
							supportingText="Uses factory function"
							@click=${() => {
								schmancyContentDrawer.push(() => {
									const demo = new DemoTypography()
									demo.setAttribute('variant', 'special')
									return demo
								})
							}}
						>
							Factory Component
						</schmancy-list-item>
					</schmancy-list>
				</schmancy-content-drawer-main>
				<schmancy-content-drawer-sheet class="px-4">
					<section slot="placeholder">
						<schmancy-typography> Placeholder </schmancy-typography>
					</section>
				</schmancy-content-drawer-sheet>
			</schmancy-content-drawer>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'layout-drawer': LayoutDrawer
	}
}