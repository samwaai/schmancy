/** @type {import('tailwindcss').Config} */
import { Config } from 'tailwindcss'
import { SchmancyTheme } from './src/theme/theme.interface'
const tailwindTheme: Config = {
	content: ['./index.html', './src/**/*.{js,ts, html}', './demo/**/*.{js,ts, html}'],
	theme: {
		container: {
			center: true,
		},
		extend: {
			boxShadow: {
				...SchmancyTheme.sys.elevation,
			},
			colors: { ...SchmancyTheme.sys.color },
			borderWidth: { ...SchmancyTheme.sys.outline },
		},
	},
	plugins: [require('@tailwindcss/container-queries')],
	daisyui: {
		themes: ['light'],
	},
}

export default tailwindTheme
