import { $LitElement } from '@mixins/litElement.mixin'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { debounceTime, Subject, takeUntil, tap, switchMap, of } from 'rxjs'
import type { SchmancyThemeComponent } from './theme.component'

export interface ColorPreset {
	name: string
	value: string
	category?: 'primary' | 'secondary' | 'accent'
}

// Re-export for convenience
export type { ColorPreset as ThemeColorPreset }

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
@customElement('schmancy-theme-controller')
export class SchmancyThemeController extends $LitElement() {
	@state() protected currentScheme: 'dark' | 'light' | 'auto' = 'auto'
	@state() protected currentColor: string = '#6200ee'
	@state() protected resolvedScheme: 'dark' | 'light' = 'light'
	@state() private themeComponent: SchmancyThemeComponent | null = null

	@property({ type: Array }) customColors?: ColorPreset[]

	protected colorInput$ = new Subject<string>()

	protected get presetColors(): ColorPreset[] {
		if (this.customColors) return this.customColors

		return [
			{ name: 'Lavender', value: '#9D8FE8', category: 'primary' },
			{ name: 'Rose', value: '#F48B9D', category: 'accent' },
			{ name: 'Mint', value: '#7ED997', category: 'accent' },
			{ name: 'Amber', value: '#FFC875', category: 'accent' },
			{ name: 'Sky', value: '#6DD5FA', category: 'primary' },
			{ name: 'Coral', value: '#FF9E7C', category: 'secondary' },
			{ name: 'Indigo', value: '#7380E8', category: 'primary' },
			{ name: 'Blush', value: '#FF79A8', category: 'secondary' },
			{ name: 'Aqua', value: '#64E0F0', category: 'accent' },
			{ name: 'Gold', value: '#FFE066', category: 'accent' },
			{ name: 'Slate', value: '#6B7E91', category: 'primary' },
			{ name: 'Onyx', value: '#3D4451', category: 'primary' },
			{ name: 'Plum', value: '#8E6BA8', category: 'secondary' },
			{ name: 'Forest', value: '#5A7A5F', category: 'accent' },
			{ name: 'Navy', value: '#3D5A80', category: 'primary' },
			{ name: 'Burgundy', value: '#994F5E', category: 'accent' },
		]
	}

	connectedCallback() {
		super.connectedCallback()

		// Discover the nearest theme component
		this.discover<SchmancyThemeComponent>('schmancy-theme').pipe(
			switchMap(theme => {
				if (theme) {
					this.themeComponent = theme
					// Set initial values from discovered theme
					this.currentScheme = theme.scheme
					this.currentColor = theme.color

					// Watch for theme property changes
					return new Subject().pipe(
						tap(() => {
							if (this.themeComponent) {
								this.currentScheme = this.themeComponent.scheme
								this.currentColor = this.themeComponent.color
							}
						})
					)
				}
				return of(null)
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Debounced color input
		this.colorInput$.pipe(
			debounceTime(150),
			tap(color => {
				if (this.themeComponent) {
					this.themeComponent.color = color
				}
			}),
			takeUntil(this.disconnecting)
		).subscribe()
	}

	protected setScheme(scheme: 'dark' | 'light' | 'auto') {
		if (this.themeComponent) {
			this.themeComponent.scheme = scheme
			this.currentScheme = scheme
		}
	}

	protected setColor(color: string) {
		if (this.themeComponent) {
			this.themeComponent.color = color
			this.currentColor = color
		}
	}

	protected handleColorInput(e: Event) {
		const input = e.target as HTMLInputElement
		this.colorInput$.next(input.value)
	}

	protected randomColor() {
		const random = this.presetColors[Math.floor(Math.random() * this.presetColors.length)]
		this.setColor(random.value)
	}

	protected triggerColorPicker() {
		const input = this.renderRoot.querySelector('input[type="color"]') as HTMLInputElement
		input?.click()
	}

	render() {
		return html`
			<div class="space-y-4">
				<!-- Color Display -->
				<div class="flex items-center gap-3">
					<div
						class="w-16 h-16 rounded-xl border-2 border-outline cursor-pointer transition-transform hover:scale-105 active:scale-95"
						style="background: ${this.currentColor}"
						@click="${this.triggerColorPicker}"
						title="Click to change color"
					></div>
					<div class="flex-1 min-w-0">
						<schmancy-typography type="body" class="font-mono opacity-60"> ${this.currentColor} </schmancy-typography>
						<div class="flex gap-1 mt-2">
							<schmancy-button
								variant="${this.currentScheme === 'light' ? 'tonal' : 'text'}"
								@click="${() => this.setScheme('light')}"
							>
								<schmancy-icon>light_mode</schmancy-icon>
							</schmancy-button>
							<schmancy-button
								variant="${this.currentScheme === 'dark' ? 'tonal' : 'text'}"
								@click="${() => this.setScheme('dark')}"
							>
								<schmancy-icon>dark_mode</schmancy-icon>
							</schmancy-button>
							<schmancy-button
								variant="${this.currentScheme === 'auto' ? 'tonal' : 'text'}"
								@click="${() => this.setScheme('auto')}"
							>
								<schmancy-icon>contrast</schmancy-icon>
							</schmancy-button>
							<schmancy-button variant="text" @click="${this.randomColor}">
								<schmancy-icon>shuffle</schmancy-icon>
							</schmancy-button>
						</div>
					</div>
				</div>

				<!-- Palette -->
				<div class="flex flex-wrap gap-1.5">
					${this.presetColors.map(
						color => html`
							<button
								class="w-7 h-7 rounded-full transition-all hover:scale-110 active:scale-95 ${this.currentColor ===
								color.value
									? 'ring-2 ring-primary ring-offset-1'
									: ''}"
								style="background: ${color.value}"
								@click="${() => this.setColor(color.value)}"
								title="${color.name}"
							></button>
						`,
					)}
				</div>

				<!-- Hidden Color Input -->
				<input type="color" .value="${this.currentColor}" @input="${this.handleColorInput}" class="hidden" />
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme-controller': SchmancyThemeController
	}
}