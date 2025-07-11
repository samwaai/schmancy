/** @type {import('tailwindcss').Config} */
module.exports = {
	// The 'content' key tells Tailwind where to scan for class names.
	content: [
		// If you're using JS/TS files
		'./demo/**/*.{js,ts,jsx,tsx}',
		"./src/**/*.{html,js,ts,jsx,tsx}", // Adjust this to your project's file structure
	],
	theme: {
		extend: {
			colors: {
				// Surface colors
				'surface': 'var(--schmancy-sys-color-surface-default)',
				'surface-dim': 'var(--schmancy-sys-color-surface-dim)',
				'surface-bright': 'var(--schmancy-sys-color-surface-bright)',
				'surface-container': 'var(--schmancy-sys-color-surface-container)',
				'surface-low': 'var(--schmancy-sys-color-surface-low)',
				'surface-high': 'var(--schmancy-sys-color-surface-high)',
				'surface-highest': 'var(--schmancy-sys-color-surface-highest)',
				'surface-lowest': 'var(--schmancy-sys-color-surface-lowest)',
				'surface-on': 'var(--schmancy-sys-color-surface-on)',
				'surface-onVariant': 'var(--schmancy-sys-color-surface-onVariant)',
				
				// Primary colors
				'primary-default': 'var(--schmancy-sys-color-primary-default)',
				'primary-on': 'var(--schmancy-sys-color-primary-on)',
				'primary-container': 'var(--schmancy-sys-color-primary-container)',
				'primary-onContainer': 'var(--schmancy-sys-color-primary-onContainer)',
				
				// Secondary colors
				'secondary-default': 'var(--schmancy-sys-color-secondary-default)',
				'secondary-on': 'var(--schmancy-sys-color-secondary-on)',
				'secondary-container': 'var(--schmancy-sys-color-secondary-container)',
				'secondary-onContainer': 'var(--schmancy-sys-color-secondary-onContainer)',
				
				// Tertiary colors
				'tertiary-default': 'var(--schmancy-sys-color-tertiary-default)',
				'tertiary-on': 'var(--schmancy-sys-color-tertiary-on)',
				'tertiary-container': 'var(--schmancy-sys-color-tertiary-container)',
				'tertiary-onContainer': 'var(--schmancy-sys-color-tertiary-onContainer)',
				
				// Error colors
				'error-default': 'var(--schmancy-sys-color-error-default)',
				'error-on': 'var(--schmancy-sys-color-error-on)',
				'error-container': 'var(--schmancy-sys-color-error-container)',
				'error-onContainer': 'var(--schmancy-sys-color-error-onContainer)',
				
				// Success colors
				'success-default': 'var(--schmancy-sys-color-success-default)',
				'success-on': 'var(--schmancy-sys-color-success-on)',
				'success-container': 'var(--schmancy-sys-color-success-container)',
				'success-onContainer': 'var(--schmancy-sys-color-success-onContainer)',
				
				// Other colors
				'outline': 'var(--schmancy-sys-color-outline)',
				'outlineVariant': 'var(--schmancy-sys-color-outlineVariant)',
				'scrim': 'var(--schmancy-sys-color-scrim)',
			},
		},
	},
	plugins: [require("@tailwindcss/nesting")],
}
