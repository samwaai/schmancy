import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import { Observable, combineLatestWith, map } from 'rxjs'
import { $newSchmancyTheme, $schmancyTheme } from './$schmancyTheme'
import { formateTheme } from './theme.format'

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const colorScheme$ = new Observable<string>(subscriber => {
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

$newSchmancyTheme
	.pipe(map(color => color || generateRandomColor()))
	.pipe(combineLatestWith(colorScheme$.pipe(map(colorScheme => colorScheme === 'dark'))))
	.pipe(
		map(([color, isDark]) => {
			return { theme: themeFromSourceColor(argbFromHex(color)), isDark }
		}),
		map(data => formateTheme(data.theme, data.isDark)),
	)
	.subscribe(theme => {
		$schmancyTheme.next(theme)
	})

function generateRandomColor() {
	// Generates a random hexadecimal color code
	const randomColor = Math.floor(Math.random() * 16777215).toString(16)
	// Pad with leading zeros if necessary to ensure 6 characters
	return '#' + randomColor.padStart(6, '0')
}
