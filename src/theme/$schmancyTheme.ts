import { Subject } from 'rxjs'
import { TSchmancyTheme } from './theme.interface'

function registerThemeValues(prefix = 'schmancy', path: string, value: Partial<TSchmancyTheme>): string | undefined {
	// if the value is an object
	if (typeof value === 'object') {
		// generate the code for each property of the object
		return Object.keys(value)
			.map(key => {
				// if the path is empty, don't add a dash
				return registerThemeValues(
					prefix,
					path + `${path ? '-' : ''}` + key,
					// @ts-ignore
					value[key],
				)
			})
			.join('\n')
	} else {
		document.documentElement.style.setProperty(`--${prefix}-${path}`, value)

		return
	}
}

const $newSchmancyTheme = new Subject<string | undefined>()

const $schmancyTheme = new Subject<Partial<TSchmancyTheme>>()

$schmancyTheme.pipe().subscribe(theme => {
	registerThemeValues('schmancy', '', theme)
})

export { $newSchmancyTheme, $schmancyTheme }
