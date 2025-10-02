import { $LitElement } from '../mixins/litElement.mixin'

export interface ColorPreset {
	name: string
	value: string
	category?: 'primary' | 'secondary' | 'accent'
}

/**
 * Base theme controller component providing color and scheme controls.
 * Can be used standalone without any specific UI container.
 *
 * @element schmancy-theme-controller
 *
 * @property {ColorPreset[]} customColors - Optional custom color presets
 *
 * @example
 * ```html
 * <schmancy-theme-controller></schmancy-theme-controller>
 *
 * <!-- With custom colors -->
 * <schmancy-theme-controller
 *   .customColors="${[
 *     { name: 'Brand', value: '#FF5722', category: 'primary' }
 *   ]}"
 * ></schmancy-theme-controller>
 * ```
 */
export declare class SchmancyThemeController extends $LitElement {
	protected currentScheme: 'dark' | 'light' | 'auto'
	protected currentColor: string
	protected resolvedScheme: 'dark' | 'light'

	customColors?: ColorPreset[]

	protected get presetColors(): ColorPreset[]

	connectedCallback(): void

	protected setScheme(scheme: 'dark' | 'light' | 'auto'): void
	protected setColor(color: string): void
	protected handleColorInput(e: Event): void
	protected randomColor(): void
	protected triggerColorPicker(): void

	render(): import('lit').TemplateResult
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme-controller': SchmancyThemeController
	}
}