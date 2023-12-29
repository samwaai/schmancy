import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import { interval, map } from 'rxjs'
import { $schmancyTheme } from './$schmancyTheme'
import { formateTheme } from './theme.format'

interval(5000)
	.pipe(
		map(generateRandomColor),
		map(color => themeFromSourceColor(argbFromHex(color))),
		map(theme => {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				return formateTheme(theme, true)
			} else {
				return formateTheme(theme)
			}
		})
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
