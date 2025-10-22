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

				// M3 surface names (for compatibility)
				'surface-container-low': 'var(--schmancy-sys-color-surface-low)',
				'surface-container-lowest': 'var(--schmancy-sys-color-surface-lowest)',
				'surface-container-high': 'var(--schmancy-sys-color-surface-high)',
				'surface-container-highest': 'var(--schmancy-sys-color-surface-highest)',

				// Primary colors
				'primary': 'var(--schmancy-sys-color-primary-default)',
				'primary-default': 'var(--schmancy-sys-color-primary-default)',
				'primary-on': 'var(--schmancy-sys-color-primary-on)',
				'primary-container': 'var(--schmancy-sys-color-primary-container)',
				'primary-onContainer': 'var(--schmancy-sys-color-primary-onContainer)',
				'primary-fixed': 'var(--schmancy-sys-color-primary-fixed)',
				'primary-fixedDim': 'var(--schmancy-sys-color-primary-fixedDim)',
				'primary-onFixed': 'var(--schmancy-sys-color-primary-onFixed)',
				'primary-onFixedVariant': 'var(--schmancy-sys-color-primary-onFixedVariant)',

				// Secondary colors
				'secondary': 'var(--schmancy-sys-color-secondary-default)',
				'secondary-default': 'var(--schmancy-sys-color-secondary-default)',
				'secondary-on': 'var(--schmancy-sys-color-secondary-on)',
				'secondary-container': 'var(--schmancy-sys-color-secondary-container)',
				'secondary-onContainer': 'var(--schmancy-sys-color-secondary-onContainer)',
				'secondary-fixed': 'var(--schmancy-sys-color-secondary-fixed)',
				'secondary-fixedDim': 'var(--schmancy-sys-color-secondary-fixedDim)',
				'secondary-onFixed': 'var(--schmancy-sys-color-secondary-onFixed)',
				'secondary-onFixedVariant': 'var(--schmancy-sys-color-secondary-onFixedVariant)',

				// Tertiary colors
				'tertiary': 'var(--schmancy-sys-color-tertiary-default)',
				'tertiary-default': 'var(--schmancy-sys-color-tertiary-default)',
				'tertiary-on': 'var(--schmancy-sys-color-tertiary-on)',
				'tertiary-container': 'var(--schmancy-sys-color-tertiary-container)',
				'tertiary-onContainer': 'var(--schmancy-sys-color-tertiary-onContainer)',
				'tertiary-fixed': 'var(--schmancy-sys-color-tertiary-fixed)',
				'tertiary-fixedDim': 'var(--schmancy-sys-color-tertiary-fixedDim)',
				'tertiary-onFixed': 'var(--schmancy-sys-color-tertiary-onFixed)',
				'tertiary-onFixedVariant': 'var(--schmancy-sys-color-tertiary-onFixedVariant)',

				// Error colors
				'error': 'var(--schmancy-sys-color-error-default)',
				'error-default': 'var(--schmancy-sys-color-error-default)',
				'error-on': 'var(--schmancy-sys-color-error-on)',
				'error-container': 'var(--schmancy-sys-color-error-container)',
				'error-onContainer': 'var(--schmancy-sys-color-error-onContainer)',

				// Success colors
				'success': 'var(--schmancy-sys-color-success-default)',
				'success-default': 'var(--schmancy-sys-color-success-default)',
				'success-on': 'var(--schmancy-sys-color-success-on)',
				'success-container': 'var(--schmancy-sys-color-success-container)',
				'success-onContainer': 'var(--schmancy-sys-color-success-onContainer)',

				// Warning colors (new M3)
				'warning': 'var(--schmancy-sys-color-warning-default)',
				'warning-default': 'var(--schmancy-sys-color-warning-default)',
				'warning-on': 'var(--schmancy-sys-color-warning-on)',
				'warning-container': 'var(--schmancy-sys-color-warning-container)',
				'warning-onContainer': 'var(--schmancy-sys-color-warning-onContainer)',

				// Info colors (new M3)
				'info': 'var(--schmancy-sys-color-info-default)',
				'info-default': 'var(--schmancy-sys-color-info-default)',
				'info-on': 'var(--schmancy-sys-color-info-on)',
				'info-container': 'var(--schmancy-sys-color-info-container)',
				'info-onContainer': 'var(--schmancy-sys-color-info-onContainer)',

				// Inverse colors (new M3)
				'inverse-surface': 'var(--schmancy-sys-color-inverse-surface)',
				'inverse-onSurface': 'var(--schmancy-sys-color-inverse-onSurface)',
				'inverse-primary': 'var(--schmancy-sys-color-inverse-primary)',

				// Surface tint (new M3)
				'surface-tint': 'var(--schmancy-sys-color-surface-tint)',

				// Other colors
				'outline': 'var(--schmancy-sys-color-outline)',
				'outline-variant': 'var(--schmancy-sys-color-outlineVariant)',
				'outlineVariant': 'var(--schmancy-sys-color-outlineVariant)',
				'scrim': 'var(--schmancy-sys-color-scrim)',
			},
			boxShadow: {
				// M3 elevation levels using schmancy elevation system
				'0': 'var(--shadow-0)',
				'1': 'var(--shadow-1)',
				'2': 'var(--shadow-2)',
				'3': 'var(--shadow-3)',
				'4': 'var(--shadow-4)',
				'5': 'var(--shadow-5)',
			},
			animation: {
				// M3 ripple animation
				'ripple': 'ripple 600ms linear',
			},
			keyframes: {
				ripple: {
					'to': {
						transform: 'scale(4)',
						opacity: '0',
					},
				},
			},
			spacing: {
				// M3 4dp grid spacing
				'm3-0': '0',
				'm3-1': '4px',
				'm3-2': '8px',
				'm3-3': '12px',
				'm3-4': '16px',
				'm3-5': '20px',
				'm3-6': '24px',
				'm3-7': '28px',
				'm3-8': '32px',
				'm3-9': '36px',
				'm3-10': '40px',
				'm3-11': '44px',
				'm3-12': '48px',
			},
			borderRadius: {
				// M3 shape tokens
				'shape-none': '0',
				'shape-xs': '4px',
				'shape-sm': '8px',
				'shape-md': '12px',
				'shape-lg': '16px',
				'shape-xl': '28px',
				'shape-full': '9999px',
			},
			opacity: {
				// M3 state layers
				'hover': '0.08',
				'focus': '0.12',
				'pressed': '0.12',
				'dragged': '0.16',
				'disabled': '0.38',
			},
			transitionDuration: {
				// M3 motion durations
				'short': '200ms',
				'medium': '300ms',
				'long': '500ms',
			},
			transitionTimingFunction: {
				// M3 standard easing (emphasis decelerate)
				'material-standard': 'cubic-bezier(0.2, 0, 0, 1)',
				// M3 standard accelerate
				'material-accelerate': 'cubic-bezier(0.3, 0, 1, 1)',
				// M3 standard decelerate
				'material-decelerate': 'cubic-bezier(0, 0, 0, 1)',
				// M3 emphasized easing
				'material-emphasized': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
			},
		},
	},
	plugins: [require("@tailwindcss/nesting")],
}
