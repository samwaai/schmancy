import { provide } from '@lit/context'
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Observable, of, switchMap, fromEvent, takeUntil } from 'rxjs'
import { themeContext } from './context'
import { formateTheme } from './theme.format'
import { TSchmancyTheme } from './theme.interface'
import style from './theme.style.css?inline'

// Theme discovery events
export type ThemeWhereAreYouEvent = CustomEvent<void>
export const ThemeWhereAreYou = 'theme-where-are-you'

export type ThemeHereIAmEvent = CustomEvent<{
	theme: HTMLElement
}>
export const ThemeHereIAm = 'theme-here-i-am'
export const tailwindStyles = unsafeCSS(style)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const $colorScheme = new Observable<string>(subscriber => {
	const handler = (e: MediaQueryListEvent) => {
		const newColorScheme = e.matches ? 'dark' : 'light'
		subscriber.next(newColorScheme)
	}
	mediaQuery.addEventListener('change', handler)

	// Emit the initial value
	const initialColorScheme = mediaQuery.matches ? 'dark' : 'light'

	subscriber.next(initialColorScheme)

	// On unsubscribe, remove the event listener
	return () => mediaQuery.removeEventListener('change', handler)
})

@customElement('schmancy-theme')
export class SchmancyThemeComponent extends TailwindElement(tailwindStyles) {
	@property({ type: String, reflect: true })
	color: string
	@property({ type: String }) scheme: 'dark' | 'light' | 'auto' = 'auto'
	@property({ type: Boolean }) root = false

	@provide({
		context: themeContext,
	})
	@property({ type: Object })
	theme: Partial<TSchmancyTheme> = {}

	connectedCallback(): void {
		super.connectedCallback()
		if (!this.color) this.color = this.generateRandomColor()
		// Trigger any other effects you have

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
			})

		// Listen for generic theme discovery events
		fromEvent<ThemeWhereAreYouEvent>(this, ThemeWhereAreYou)
		.pipe(
			takeUntil(this.disconnecting)
		)
		.subscribe(() => {
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
	registerTheme() {
		let theme = formateTheme(
			themeFromSourceColor(argbFromHex(this.color)),
			this.scheme === 'dark' ? true : false,
			argbFromHex('#34B334'),
		)
		theme = { ...theme, ...this.theme }

		this.registerThemeValues('schmancy', '', theme)
		
		// Set the color-scheme CSS property on the host element
		const hostElement = this.root ? document.body : (this.shadowRoot.host as HTMLElement)
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
