/** @type {import('tailwindcss').Config} */
import { Config } from 'tailwindcss'
import { SchmancyTheme } from './src/theme/theme.interface'
const tailwindTheme: Config = {
	content: ['./index.html', './src/**/*.{js,ts}', './demo/**/*.{js,ts,html}'],
	theme: {
		container: {
			center: true,
		},
		extend: {
			fontFamily: {
				sans: ['inherit'], // Or a different fallback like 'Arial'
			},
			borderWidth: { ...SchmancyTheme.sys.outline },
		},
	},
	plugins: [require('@tailwindcss/container-queries')],
}

export default tailwindTheme
