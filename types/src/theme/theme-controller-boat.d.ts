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
export declare class SchmancyThemeControllerBoat extends SchmancyThemeController {
	render(): import('lit').TemplateResult
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme-controller-boat': SchmancyThemeControllerBoat
	}
}