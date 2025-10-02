import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../../../src/theme/theme-controller'
import '../../../src/theme/theme-controller-boat'
import type { ColorPreset } from '../../../src/theme/theme-controller'

/**
 * Demo page for testing the refactored theme controller components
 */
@customElement('theme-controller-test')
export class ThemeControllerTest extends LitElement {
	private customBrandColors: ColorPreset[] = [
		{ name: 'Material Blue', value: '#2196F3', category: 'primary' },
		{ name: 'Material Teal', value: '#009688', category: 'secondary' },
		{ name: 'Material Orange', value: '#FF9800', category: 'accent' },
		{ name: 'Material Pink', value: '#E91E63', category: 'accent' },
	]

	render() {
		return html`
			<div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
				<h1 style="margin-bottom: 2rem;">Theme Controller Components Demo</h1>

				<div style="display: grid; gap: 2rem; margin-bottom: 2rem;">
					<!-- Standalone Theme Controller -->
					<section style="padding: 1.5rem; border: 1px solid #e0e0e0; border-radius: 8px;">
						<h2 style="margin-bottom: 1rem;">1. Standalone Theme Controller</h2>
						<p style="margin-bottom: 1rem; color: #666;">
							Base theme controller without any container - can be embedded anywhere:
						</p>
						<schmancy-theme-controller></schmancy-theme-controller>
					</section>

					<!-- Standalone with Custom Colors -->
					<section style="padding: 1.5rem; border: 1px solid #e0e0e0; border-radius: 8px;">
						<h2 style="margin-bottom: 1rem;">2. Standalone with Custom Brand Colors</h2>
						<p style="margin-bottom: 1rem; color: #666;">
							Same controller with custom color palette:
						</p>
						<schmancy-theme-controller
							.customColors="${this.customBrandColors}"
						></schmancy-theme-controller>
					</section>
				</div>

				<!-- BOAT Theme Controllers -->
				<div style="margin-top: 3rem;">
					<h2 style="margin-bottom: 1rem;">3. BOAT UX Theme Controllers (Floating)</h2>
					<p style="margin-bottom: 1rem; color: #666;">
						These are floating, draggable theme controllers. Look for them in the bottom-right corner:
					</p>

					<div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
						<button
							style="padding: 0.5rem 1rem; background: #1976D2; color: white; border: none; border-radius: 4px; cursor: pointer;"
							@click="${() => {
								const defaultBoat = this.shadowRoot?.querySelector('#default-boat') as any
								if (defaultBoat) defaultBoat.state = 'expanded'
							}}"
						>
							Show Default BOAT Controller
						</button>

						<button
							style="padding: 0.5rem 1rem; background: #388E3C; color: white; border: none; border-radius: 4px; cursor: pointer;"
							@click="${() => {
								const customBoat = this.shadowRoot?.querySelector('#custom-boat') as any
								if (customBoat) customBoat.state = 'expanded'
							}}"
						>
							Show Custom Colors BOAT Controller
						</button>
					</div>
				</div>

				<!-- Note about legacy component -->
				<section style="margin-top: 2rem; padding: 1.5rem; background: #E3F2FD; border-radius: 8px;">
					<h2 style="margin-bottom: 1rem;">4. Legacy Component Migration</h2>
					<p style="color: #0D47A1; margin-bottom: 1rem;">
						ℹ️ The original <code>schmancy-theme-controls</code> component has been removed.
						Please use <code>schmancy-theme-controller-boat</code> for a floating theme controller
						or <code>schmancy-theme-controller</code> for an embeddable version.
					</p>
				</section>

				<!-- Floating BOAT Controllers -->
				<schmancy-theme-controller-boat id="default-boat"></schmancy-theme-controller-boat>

				<schmancy-theme-controller-boat
					id="custom-boat"
					.customColors="${this.customBrandColors}"
				></schmancy-theme-controller-boat>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'theme-controller-test': ThemeControllerTest
	}
}