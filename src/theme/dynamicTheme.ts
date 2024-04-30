import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import { Observable, catchError, combineLatestWith, map, of, startWith, tap } from 'rxjs'
import { $newSchmancyTheme, $schmancyTheme } from './$schmancyTheme'
import { formateTheme } from './theme.format'

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

export type ThemeStorage = { color: string; scheme: 'light' | 'dark' | 'auto' }

$newSchmancyTheme
	.pipe(
		startWith(safeJSONParse<ThemeStorage>(localStorage.getItem('schmancy-theme'))),
		map(theme => {
			try {
				argbFromHex(theme.color)
				if (!theme) {
					return { color: generateRandomColor(), scheme: 'auto' }
				} else return theme
			} catch (error) {
				return { color: generateRandomColor(), scheme: 'auto' }
			}
		}),
		catchError(() => of({ color: generateRandomColor(), scheme: 'auto' })),
		tap(color => localStorage.setItem('schmancy-theme', JSON.stringify(color))),
	)
	.pipe(combineLatestWith($colorScheme.pipe(map(colorScheme => colorScheme === 'dark'))))
	.pipe(
		map(([color, isDark]) => {
			return {
				theme: themeFromSourceColor(argbFromHex(color.color)),
				isDark: color.scheme === 'dark' ? true : color.scheme === 'light' ? false : isDark,
			}
		}),
		map(data => formateTheme(data.theme, data.isDark)),
	)
	.subscribe(theme => {
		$schmancyTheme.next(theme)
	})

export function generateRandomColor() {
	// Generates a random hexadecimal color code
	const randomColor = Math.floor(Math.random() * 16777215).toString(16)
	// Pad with leading zeros if necessary to ensure 6 characters
	return '#' + randomColor.padStart(6, '0')
}

function safeJSONParse<T>(json: string): T | undefined {
	try {
		return JSON.parse(json)
	} catch (e) {
		return undefined
	}
}
