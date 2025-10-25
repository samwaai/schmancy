/**
 * Material Design 3 Theme Definition
 * Complete theme system following Material Design 3 specifications
 * @see https://m3.material.io/foundations/customization
 *
 * @internal
 */
const ThemeDef = {
	sys: {
		// M3 Color System - Complete tonal palette support
		color: {
			// Neutral colors
			scrim: 'var(--schmancy-sys-color-scrim)',
			outline: 'var(--schmancy-sys-color-outline)',
			outlineVariant: 'var(--schmancy-sys-color-outlineVariant)',
			shadow: 'var(--schmancy-sys-color-shadow)',

			// Surface colors with complete tonal values
			surface: {
				default: 'var(--schmancy-sys-color-surface-default)',
				dim: 'var(--schmancy-sys-color-surface-dim)',
				bright: 'var(--schmancy-sys-color-surface-bright)',
				container: 'var(--schmancy-sys-color-surface-container)',
				containerLow: 'var(--schmancy-sys-color-surface-containerLow)',
				containerLowest: 'var(--schmancy-sys-color-surface-containerLowest)',
				containerHigh: 'var(--schmancy-sys-color-surface-containerHigh)',
				containerHighest: 'var(--schmancy-sys-color-surface-containerHighest)',
				on: 'var(--schmancy-sys-color-surface-on)',
				onVariant: 'var(--schmancy-sys-color-surface-onVariant)',
				tint: 'var(--schmancy-sys-color-surface-tint)',
				// Inverse colors
				inverse: 'var(--schmancy-sys-color-inverse-surface)',
				inverseOn: 'var(--schmancy-sys-color-inverse-onSurface)',
				// Deprecated mappings for backward compatibility
				low: 'var(--schmancy-sys-color-surface-containerLow)',
				high: 'var(--schmancy-sys-color-surface-containerHigh)',
				highest: 'var(--schmancy-sys-color-surface-containerHighest)',
				lowest: 'var(--schmancy-sys-color-surface-containerLowest)',
			},

			// Primary color roles with fixed variants
			primary: {
				default: 'var(--schmancy-sys-color-primary-default)',
				on: 'var(--schmancy-sys-color-primary-on)',
				container: 'var(--schmancy-sys-color-primary-container)',
				onContainer: 'var(--schmancy-sys-color-primary-onContainer)',
				fixed: 'var(--schmancy-sys-color-primary-fixed)',
				fixedDim: 'var(--schmancy-sys-color-primary-fixedDim)',
				onFixed: 'var(--schmancy-sys-color-primary-onFixed)',
				onFixedVariant: 'var(--schmancy-sys-color-primary-onFixedVariant)',
				inverse: 'var(--schmancy-sys-color-inverse-primary)',
			},

			// Secondary color roles with fixed variants
			secondary: {
				default: 'var(--schmancy-sys-color-secondary-default)',
				on: 'var(--schmancy-sys-color-secondary-on)',
				container: 'var(--schmancy-sys-color-secondary-container)',
				onContainer: 'var(--schmancy-sys-color-secondary-onContainer)',
				fixed: 'var(--schmancy-sys-color-secondary-fixed)',
				fixedDim: 'var(--schmancy-sys-color-secondary-fixedDim)',
				onFixed: 'var(--schmancy-sys-color-secondary-onFixed)',
				onFixedVariant: 'var(--schmancy-sys-color-secondary-onFixedVariant)',
			},

			// Tertiary color roles with fixed variants
			tertiary: {
				default: 'var(--schmancy-sys-color-tertiary-default)',
				on: 'var(--schmancy-sys-color-tertiary-on)',
				container: 'var(--schmancy-sys-color-tertiary-container)',
				onContainer: 'var(--schmancy-sys-color-tertiary-onContainer)',
				fixed: 'var(--schmancy-sys-color-tertiary-fixed)',
				fixedDim: 'var(--schmancy-sys-color-tertiary-fixedDim)',
				onFixed: 'var(--schmancy-sys-color-tertiary-onFixed)',
				onFixedVariant: 'var(--schmancy-sys-color-tertiary-onFixedVariant)',
			},

			// Error color roles
			error: {
				default: 'var(--schmancy-sys-color-error-default)',
				on: 'var(--schmancy-sys-color-error-on)',
				container: 'var(--schmancy-sys-color-error-container)',
				onContainer: 'var(--schmancy-sys-color-error-onContainer)',
			},

			// Extended color roles - Success
			success: {
				default: 'var(--schmancy-sys-color-success-default)',
				on: 'var(--schmancy-sys-color-success-on)',
				container: 'var(--schmancy-sys-color-success-container)',
				onContainer: 'var(--schmancy-sys-color-success-onContainer)',
			},

			// Extended color roles - Warning
			warning: {
				default: 'var(--schmancy-sys-color-warning-default)',
				on: 'var(--schmancy-sys-color-warning-on)',
				container: 'var(--schmancy-sys-color-warning-container)',
				onContainer: 'var(--schmancy-sys-color-warning-onContainer)',
			},

			// Extended color roles - Info
			info: {
				default: 'var(--schmancy-sys-color-info-default)',
				on: 'var(--schmancy-sys-color-info-on)',
				container: 'var(--schmancy-sys-color-info-container)',
				onContainer: 'var(--schmancy-sys-color-info-onContainer)',
			},
		},

		// M3 Typography System
		typography: {
			// Display styles
			display: {
				large: 'var(--schmancy-sys-typescale-display-large)',
				medium: 'var(--schmancy-sys-typescale-display-medium)',
				small: 'var(--schmancy-sys-typescale-display-small)',
			},
			// Headline styles
			headline: {
				large: 'var(--schmancy-sys-typescale-headline-large)',
				medium: 'var(--schmancy-sys-typescale-headline-medium)',
				small: 'var(--schmancy-sys-typescale-headline-small)',
			},
			// Title styles
			title: {
				large: 'var(--schmancy-sys-typescale-title-large)',
				medium: 'var(--schmancy-sys-typescale-title-medium)',
				small: 'var(--schmancy-sys-typescale-title-small)',
			},
			// Body styles
			body: {
				large: 'var(--schmancy-sys-typescale-body-large)',
				medium: 'var(--schmancy-sys-typescale-body-medium)',
				small: 'var(--schmancy-sys-typescale-body-small)',
			},
			// Label styles
			label: {
				large: 'var(--schmancy-sys-typescale-label-large)',
				medium: 'var(--schmancy-sys-typescale-label-medium)',
				small: 'var(--schmancy-sys-typescale-label-small)',
			},
		},

		// M3 Shape System
		shape: {
			corner: {
				none: 'var(--schmancy-sys-shape-corner-none)',
				extraSmall: 'var(--schmancy-sys-shape-corner-extraSmall)',
				small: 'var(--schmancy-sys-shape-corner-small)',
				medium: 'var(--schmancy-sys-shape-corner-medium)',
				large: 'var(--schmancy-sys-shape-corner-large)',
				extraLarge: 'var(--schmancy-sys-shape-corner-extraLarge)',
				full: 'var(--schmancy-sys-shape-corner-full)',
			},
		},

		// M3 Elevation System with tinted shadows
		elevation: {
			0: 'var(--schmancy-sys-elevation-0)',
			1: 'var(--schmancy-sys-elevation-1)',
			2: 'var(--schmancy-sys-elevation-2)',
			3: 'var(--schmancy-sys-elevation-3)',
			4: 'var(--schmancy-sys-elevation-4)',
			5: 'var(--schmancy-sys-elevation-5)',
		},

		// M3 Motion System
		motion: {
			// Easing tokens
			easing: {
				emphasized: 'var(--schmancy-sys-motion-easing-emphasized)',
				emphasizedDecelerate: 'var(--schmancy-sys-motion-easing-emphasized-decelerate)',
				emphasizedAccelerate: 'var(--schmancy-sys-motion-easing-emphasized-accelerate)',
				standard: 'var(--schmancy-sys-motion-easing-standard)',
				standardDecelerate: 'var(--schmancy-sys-motion-easing-standard-decelerate)',
				standardAccelerate: 'var(--schmancy-sys-motion-easing-standard-accelerate)',
				legacy: 'var(--schmancy-sys-motion-easing-legacy)',
				linear: 'var(--schmancy-sys-motion-easing-linear)',
			},
			// Duration tokens
			duration: {
				short1: 'var(--schmancy-sys-motion-duration-short1)',
				short2: 'var(--schmancy-sys-motion-duration-short2)',
				short3: 'var(--schmancy-sys-motion-duration-short3)',
				short4: 'var(--schmancy-sys-motion-duration-short4)',
				medium1: 'var(--schmancy-sys-motion-duration-medium1)',
				medium2: 'var(--schmancy-sys-motion-duration-medium2)',
				medium3: 'var(--schmancy-sys-motion-duration-medium3)',
				medium4: 'var(--schmancy-sys-motion-duration-medium4)',
				long1: 'var(--schmancy-sys-motion-duration-long1)',
				long2: 'var(--schmancy-sys-motion-duration-long2)',
				long3: 'var(--schmancy-sys-motion-duration-long3)',
				long4: 'var(--schmancy-sys-motion-duration-long4)',
				extraLong1: 'var(--schmancy-sys-motion-duration-extraLong1)',
				extraLong2: 'var(--schmancy-sys-motion-duration-extraLong2)',
				extraLong3: 'var(--schmancy-sys-motion-duration-extraLong3)',
				extraLong4: 'var(--schmancy-sys-motion-duration-extraLong4)',
			},
		},

		// M3 State Layers
		state: {
			opacity: {
				hover: 'var(--schmancy-sys-state-hover-opacity)',
				focus: 'var(--schmancy-sys-state-focus-opacity)',
				pressed: 'var(--schmancy-sys-state-pressed-opacity)',
				dragged: 'var(--schmancy-sys-state-dragged-opacity)',
				disabled: 'var(--schmancy-sys-state-disabled-opacity)',
				disabledContainer: 'var(--schmancy-sys-state-disabled-container-opacity)',
			},
		},

		// M3 Spacing System
		spacing: {
			0: 'var(--schmancy-sys-spacing-0)',
			1: 'var(--schmancy-sys-spacing-1)',
			2: 'var(--schmancy-sys-spacing-2)',
			3: 'var(--schmancy-sys-spacing-3)',
			4: 'var(--schmancy-sys-spacing-4)',
			5: 'var(--schmancy-sys-spacing-5)',
			6: 'var(--schmancy-sys-spacing-6)',
			7: 'var(--schmancy-sys-spacing-7)',
			8: 'var(--schmancy-sys-spacing-8)',
			9: 'var(--schmancy-sys-spacing-9)',
			10: 'var(--schmancy-sys-spacing-10)',
			11: 'var(--schmancy-sys-spacing-11)',
			12: 'var(--schmancy-sys-spacing-12)',
		},

		// Legacy outline for backward compatibility
		outline: {
			1: 'var(--schmancy-sys-outline-1)',
		},
	},

	// Reference palette - complete tonal values
	ref: {
		palette: {
			// Primary tonal palette
			primary: {
				0: 'var(--schmancy-ref-palette-primary-0)',
				10: 'var(--schmancy-ref-palette-primary-10)',
				20: 'var(--schmancy-ref-palette-primary-20)',
				30: 'var(--schmancy-ref-palette-primary-30)',
				40: 'var(--schmancy-ref-palette-primary-40)',
				50: 'var(--schmancy-ref-palette-primary-50)',
				60: 'var(--schmancy-ref-palette-primary-60)',
				70: 'var(--schmancy-ref-palette-primary-70)',
				80: 'var(--schmancy-ref-palette-primary-80)',
				90: 'var(--schmancy-ref-palette-primary-90)',
				95: 'var(--schmancy-ref-palette-primary-95)',
				99: 'var(--schmancy-ref-palette-primary-99)',
				100: 'var(--schmancy-ref-palette-primary-100)',
			},
			// Secondary tonal palette
			secondary: {
				0: 'var(--schmancy-ref-palette-secondary-0)',
				10: 'var(--schmancy-ref-palette-secondary-10)',
				20: 'var(--schmancy-ref-palette-secondary-20)',
				30: 'var(--schmancy-ref-palette-secondary-30)',
				40: 'var(--schmancy-ref-palette-secondary-40)',
				50: 'var(--schmancy-ref-palette-secondary-50)',
				60: 'var(--schmancy-ref-palette-secondary-60)',
				70: 'var(--schmancy-ref-palette-secondary-70)',
				80: 'var(--schmancy-ref-palette-secondary-80)',
				90: 'var(--schmancy-ref-palette-secondary-90)',
				95: 'var(--schmancy-ref-palette-secondary-95)',
				99: 'var(--schmancy-ref-palette-secondary-99)',
				100: 'var(--schmancy-ref-palette-secondary-100)',
			},
			// Tertiary tonal palette
			tertiary: {
				0: 'var(--schmancy-ref-palette-tertiary-0)',
				10: 'var(--schmancy-ref-palette-tertiary-10)',
				20: 'var(--schmancy-ref-palette-tertiary-20)',
				30: 'var(--schmancy-ref-palette-tertiary-30)',
				40: 'var(--schmancy-ref-palette-tertiary-40)',
				50: 'var(--schmancy-ref-palette-tertiary-50)',
				60: 'var(--schmancy-ref-palette-tertiary-60)',
				70: 'var(--schmancy-ref-palette-tertiary-70)',
				80: 'var(--schmancy-ref-palette-tertiary-80)',
				90: 'var(--schmancy-ref-palette-tertiary-90)',
				95: 'var(--schmancy-ref-palette-tertiary-95)',
				99: 'var(--schmancy-ref-palette-tertiary-99)',
				100: 'var(--schmancy-ref-palette-tertiary-100)',
			},
			// Neutral tonal palette
			neutral: {
				0: 'var(--schmancy-ref-palette-neutral-0)',
				10: 'var(--schmancy-ref-palette-neutral-10)',
				20: 'var(--schmancy-ref-palette-neutral-20)',
				30: 'var(--schmancy-ref-palette-neutral-30)',
				40: 'var(--schmancy-ref-palette-neutral-40)',
				50: 'var(--schmancy-ref-palette-neutral-50)',
				60: 'var(--schmancy-ref-palette-neutral-60)',
				70: 'var(--schmancy-ref-palette-neutral-70)',
				80: 'var(--schmancy-ref-palette-neutral-80)',
				90: 'var(--schmancy-ref-palette-neutral-90)',
				95: 'var(--schmancy-ref-palette-neutral-95)',
				99: 'var(--schmancy-ref-palette-neutral-99)',
				100: 'var(--schmancy-ref-palette-neutral-100)',
			},
			// Neutral variant tonal palette
			neutralVariant: {
				0: 'var(--schmancy-ref-palette-neutralVariant-0)',
				10: 'var(--schmancy-ref-palette-neutralVariant-10)',
				20: 'var(--schmancy-ref-palette-neutralVariant-20)',
				30: 'var(--schmancy-ref-palette-neutralVariant-30)',
				40: 'var(--schmancy-ref-palette-neutralVariant-40)',
				50: 'var(--schmancy-ref-palette-neutralVariant-50)',
				60: 'var(--schmancy-ref-palette-neutralVariant-60)',
				70: 'var(--schmancy-ref-palette-neutralVariant-70)',
				80: 'var(--schmancy-ref-palette-neutralVariant-80)',
				90: 'var(--schmancy-ref-palette-neutralVariant-90)',
				95: 'var(--schmancy-ref-palette-neutralVariant-95)',
				99: 'var(--schmancy-ref-palette-neutralVariant-99)',
				100: 'var(--schmancy-ref-palette-neutralVariant-100)',
			},
			// Error tonal palette
			error: {
				0: 'var(--schmancy-ref-palette-error-0)',
				10: 'var(--schmancy-ref-palette-error-10)',
				20: 'var(--schmancy-ref-palette-error-20)',
				30: 'var(--schmancy-ref-palette-error-30)',
				40: 'var(--schmancy-ref-palette-error-40)',
				50: 'var(--schmancy-ref-palette-error-50)',
				60: 'var(--schmancy-ref-palette-error-60)',
				70: 'var(--schmancy-ref-palette-error-70)',
				80: 'var(--schmancy-ref-palette-error-80)',
				90: 'var(--schmancy-ref-palette-error-90)',
				95: 'var(--schmancy-ref-palette-error-95)',
				99: 'var(--schmancy-ref-palette-error-99)',
				100: 'var(--schmancy-ref-palette-error-100)',
			},
		},
	},
}
const theme = {
	theme: ThemeDef,
}

/**
 * Type definition for the Schmancy Material Design 3 theme configuration.
 * Complete theme system with colors, typography, shape, motion, and state layers.
 *
 * @typedef {Object} TSchmancyTheme
 *
 * @example
 * ```typescript
 * import type { TSchmancyTheme } from '@schmancy/theme'
 *
 * const myTheme: Partial<TSchmancyTheme> = {
 *   sys: {
 *     color: {
 *       primary: {
 *         default: '#6750A4',
 *         container: '#EADDFF'
 *       }
 *     },
 *     shape: {
 *       corner: {
 *         medium: '12px'
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type TSchmancyTheme = (typeof theme)[keyof typeof theme]

/**
 * Default Schmancy theme configuration object.
 * Provides access to all theme CSS variables through JavaScript.
 *
 * @constant {TSchmancyTheme}
 *
 * @example
 * ```typescript
 * import { SchmancyTheme } from '@schmancy/theme'
 *
 * // Access primary color variable
 * const primaryColor = SchmancyTheme.sys.color.primary.default
 * // Returns: 'var(--schmancy-sys-color-primary-default)'
 * ```
 */
const SchmancyTheme: TSchmancyTheme = ThemeDef

export { SchmancyTheme }
