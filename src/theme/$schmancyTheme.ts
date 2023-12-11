import { Subject, startWith } from 'rxjs'
import { defaultTheme } from './defaultTheme'
import merge from 'deepmerge'
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
		// register the css variable
		try {
			window.CSS.registerProperty({
				name: `--${prefix}-${path}`,
				syntax: '<color>',
				inherits: false,
				initialValue: value,
			})
		} catch (error) {
			// update the css property
			document.documentElement.style.setProperty(`--${prefix}-${path}`, value)
		}
		return undefined
	}
}

const $schmancyTheme = new Subject<Partial<TSchmancyTheme>>()

$schmancyTheme.pipe(startWith(defaultTheme)).subscribe(theme => {
	registerThemeValues('schmancy', '', merge(defaultTheme, theme))
})

export { $schmancyTheme }
