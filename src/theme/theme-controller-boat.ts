import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { SchmancyThemeController } from './theme-controller'

/**
 * BOAT UX theme controller - Wraps the base theme controller in a schmancy-boat component.
 * Provides a floating, draggable container for theme controls.
 *
 * @element schmancy-theme-controller-boat
 *
 * @extends SchmancyThemeController
 *
 * @example
 * ```html
 * <schmancy-theme-controller-boat></schmancy-theme-controller-boat>
 *
 * <!-- With custom colors -->
 * <schmancy-theme-controller-boat
 *   .customColors="${[
 *     { name: 'Brand', value: '#FF5722', category: 'primary' }
 *   ]}"
 * ></schmancy-theme-controller-boat>
 * ```
 */
@customElement('schmancy-theme-controller-boat')
export class SchmancyThemeControllerBoat extends SchmancyThemeController {
	render() {
		return html`
			<schmancy-boat id="schmancy-theme-component">
				<schmancy-icon slot="header">palette</schmancy-icon>

				<div class="p-4">
					${super.render()}
				</div>
			</schmancy-boat>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme-controller-boat': SchmancyThemeControllerBoat
	}
}