import { provide } from '@lit/context'
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Observable, of, switchMap, fromEvent, takeUntil } from 'rxjs'
import { themeContext } from './context'
import { formateTheme } from './theme.format'
import { TSchmancyTheme } from './theme.interface'
import { theme as themeService } from './theme.service'
import { ThemeHereIAm, ThemeWhereAreYou, ThemeWhereAreYouEvent } from './theme.events'
import style from './theme.style.css?inline'
export const tailwindStyles = unsafeCSS(style)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const $colorScheme = new Observable<string>(subscriber => {
	// Emit the initial value
	const initialColorScheme = mediaQuery.matches ? 'dark' : 'light'
	subscriber.next(initialColorScheme)

	// Subscribe to media query changes using RxJS
	const subscription = fromEvent<MediaQueryListEvent>(mediaQuery, 'change')
		.subscribe(e => {
			const newColorScheme = e.matches ? 'dark' : 'light'
			subscriber.next(newColorScheme)
		})

	// On unsubscribe, unsubscribe from the RxJS subscription
	return () => subscription.unsubscribe()
})

/**
 * SchmancyThemeComponent - Provides theming capabilities for Schmancy components.
 *
 * This component manages color schemes, primary colors, and theme distribution
 * throughout the component tree. It can be used at the root level or nested
 * to provide different themes to different parts of the application.
 *
 * @element schmancy-theme
 *
 * @example
 * ```html
 * <!-- Root theme provider -->
 * <schmancy-theme color="#6200ee" scheme="auto" root>
 *   <your-app></your-app>
 * </schmancy-theme>
 *
 * <!-- Nested theme for specific section -->
 * <schmancy-theme color="#2196f3" scheme="dark">
 *   <div class="dark-section">
 *     <!-- Components here will use blue dark theme -->
 *   </div>
 * </schmancy-theme>
 * ```
 */
@customElement('schmancy-theme')
export class SchmancyThemeComponent extends TailwindElement(tailwindStyles) {
	/**
	 * Primary color for the theme in hex format.
	 * @attr color
	 * @type {string}
	 * @default Random generated color
	 * @example "#6200ee"
	 */
	@property({ type: String, reflect: true })
	color: string

	/**
	 * Color scheme for the theme.
	 * @attr scheme
	 * @type {'dark' | 'light' | 'auto'}
	 * @default 'auto'
	 */
	@property({ type: String }) scheme: 'dark' | 'light' | 'auto' = 'auto'

	/**
	 * Whether this theme should be applied at the root level (document.body).
	 * @attr root
	 * @type {boolean}
	 * @default false
	 */
	@property({ type: Boolean }) root = false

	/**
	 * Theme configuration object containing all theme variables.
	 * @property {Partial<TSchmancyTheme>} theme
	 * @internal
	 */
	@provide({
		context: themeContext,
	})
	@property({ type: Object })
	theme: Partial<TSchmancyTheme> = {}

	connectedCallback(): void {
		super.connectedCallback()
		if (!this.color) this.color = this.generateRandomColor()

		// Register with theme service
		themeService.registerThemeComponent(this)

		of(this.scheme)
			.pipe(
				switchMap(scheme => {
					if (scheme === 'auto') return $colorScheme
					return of(scheme)
				}),
			)
			.subscribe(scheme => {
				this.scheme = scheme as 'dark' | 'light'
				this.registerTheme()
				// Update theme service when scheme changes
				themeService.updateTheme({
					scheme: this.scheme,
					color: this.color,
					theme: this.theme
				})
			})

		// Listen for generic theme discovery events
		fromEvent<ThemeWhereAreYouEvent>(this, ThemeWhereAreYou)
		.pipe(
			takeUntil(this.disconnecting)
		)
		.subscribe((e) => {
			e.stopPropagation()
			e.preventDefault()
			// Respond immediately with this theme container
			window.dispatchEvent(
				new CustomEvent(ThemeHereIAm, {
					detail: { theme: this },
					bubbles: true,
					composed: true,
				})
			)
		})

	}

	updated(changedProperties: Map<string | number | symbol, unknown>): void {
		super.updated(changedProperties)

		// Update theme service when properties change
		if (changedProperties.has('color') || changedProperties.has('scheme') || changedProperties.has('theme')) {
			themeService.updateTheme({
				scheme: this.scheme,
				color: this.color,
				theme: this.theme
			})
		}
	}
	registerTheme() {
		let theme = formateTheme(
			themeFromSourceColor(argbFromHex(this.color)),
			this.scheme === 'dark' ? true : false,
			{
				success: argbFromHex('#34B334'),
				warning: argbFromHex('#FFA726'),
				info: argbFromHex('#29B6F6')
			}
		)
		theme = { ...theme, ...this.theme }

		this.registerThemeValues('schmancy', '', theme)

		// Backward compatibility: Map old variable names to new ones
		const hostElement = this.root ? document.body : (this.shadowRoot.host as HTMLElement)
		const getVar = (name: string) => hostElement.style.getPropertyValue(name)

		// Map old surface container names to new M3 names
		hostElement.style.setProperty('--schmancy-sys-color-surface-low', getVar('--schmancy-sys-color-surface-containerLow'))
		hostElement.style.setProperty('--schmancy-sys-color-surface-high', getVar('--schmancy-sys-color-surface-containerHigh'))
		hostElement.style.setProperty('--schmancy-sys-color-surface-highest', getVar('--schmancy-sys-color-surface-containerHighest'))
		hostElement.style.setProperty('--schmancy-sys-color-surface-lowest', getVar('--schmancy-sys-color-surface-containerLowest'))

		// Set the color-scheme CSS property on the host element
		hostElement.style.colorScheme = this.scheme === 'dark' ? 'dark' : 'light'
	}

	registerThemeValues(prefix = 'schmancy', path: string, value: Partial<TSchmancyTheme>): string | undefined {
		// if the value is an object
		if (typeof value === 'object') {
			// generate the code for each property of the object
			return Object.keys(value)
				.map(key => {
					// if the path is empty, don't add a dash
					return this.registerThemeValues(
						prefix,
						path + `${path ? '-' : ''}` + key,
						// @ts-ignore
						value[key],
					)
				})
				.join('\n')
		} else {
			;(this.root ? document.body : (this.shadowRoot.host as HTMLElement)).style.setProperty(
				`--${prefix}-${path}`,
				value,
			)

			return
		}
	}
	generateRandomColor() {
		// Generates a random hexadecimal color code
		const randomColor = Math.floor(Math.random() * 16777215).toString(16)
		// Pad with leading zeros if necessary to ensure 6 characters
		return '#' + randomColor.padStart(6, '0')
	}

	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme': SchmancyThemeComponent
	}
}
