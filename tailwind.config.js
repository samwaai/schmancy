/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts, html}', './demo/**/*.{js,ts, html}'],
	theme: {
		container: {
			center: true,
		},
	},
	plugins: [require('daisyui'), require('@tailwindcss/container-queries')],
	daisyui: {
		themes: ['light'],
	},
}
