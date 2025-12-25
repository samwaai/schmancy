import { argbFromHex, Hct, hexFromArgb, Theme, TonalPalette } from '@material/material-color-utilities'
import { TSchmancyTheme } from './theme.interface'

/**
 * Material Design 3 Theme Formatter
 * Generates complete M3 theme with all tonal values and design tokens
 * @see https://m3.material.io/styles/color/the-color-system
 */

/**
 * Converts ARGB integer to hex string
 */
function argbToHex(argb: number): string {
	return hexFromArgb(argb)
}

/**
 * Creates a complete tonal palette from a source color
 */
function createTonalPalette(sourceColor: number): Record<string, string> {
	const hct = Hct.fromInt(sourceColor)
	const palette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma)

	return {
		'0': argbToHex(palette.tone(0)),
		'10': argbToHex(palette.tone(10)),
		'20': argbToHex(palette.tone(20)),
		'30': argbToHex(palette.tone(30)),
		'40': argbToHex(palette.tone(40)),
		'50': argbToHex(palette.tone(50)),
		'60': argbToHex(palette.tone(60)),
		'70': argbToHex(palette.tone(70)),
		'80': argbToHex(palette.tone(80)),
		'90': argbToHex(palette.tone(90)),
		'95': argbToHex(palette.tone(95)),
		'99': argbToHex(palette.tone(99)),
		'100': argbToHex(palette.tone(100)),
	}
}

/**
 * Generates a complete Material Design 3 theme
 * @param originalTheme The generated theme from Material Color Utilities
 * @param isDark Whether to generate a dark theme
 * @param extendedColors Optional extended colors (success, warning, info)
 */
export function formateTheme(
	originalTheme: Theme,
	isDark = false,
	extendedColors?: {
		success?: number
		warning?: number
		info?: number
	}
): Partial<TSchmancyTheme> {
	const scheme = isDark ? originalTheme.schemes.dark : originalTheme.schemes.light

	// Generate complete tonal palettes
	const primaryPalette = TonalPalette.fromHueAndChroma(
		originalTheme.palettes.primary.hue,
		originalTheme.palettes.primary.chroma
	)
	const secondaryPalette = TonalPalette.fromHueAndChroma(
		originalTheme.palettes.secondary.hue,
		originalTheme.palettes.secondary.chroma
	)
	const tertiaryPalette = TonalPalette.fromHueAndChroma(
		originalTheme.palettes.tertiary.hue,
		originalTheme.palettes.tertiary.chroma
	)
	const neutralPalette = TonalPalette.fromHueAndChroma(
		originalTheme.palettes.neutral.hue,
		originalTheme.palettes.neutral.chroma
	)
	const neutralVariantPalette = TonalPalette.fromHueAndChroma(
		originalTheme.palettes.neutralVariant.hue,
		originalTheme.palettes.neutralVariant.chroma
	)
	const errorPalette = TonalPalette.fromHueAndChroma(
		originalTheme.palettes.error.hue,
		originalTheme.palettes.error.chroma
	)

	// Generate extended color palettes
	const successPalette = extendedColors?.success
		? createTonalPalette(extendedColors.success)
		: createTonalPalette(argbFromHex('#00C853')) // Green A700

	const warningPalette = extendedColors?.warning
		? createTonalPalette(extendedColors.warning)
		: createTonalPalette(argbFromHex('#FFD600')) // Amber A700

	const infoPalette = extendedColors?.info
		? createTonalPalette(extendedColors.info)
		: createTonalPalette(argbFromHex('#2979FF')) // Blue A400

	// M3 tone values for each color role in light/dark themes
	const tones = {
		primary: isDark ? 80 : 40,
		onPrimary: isDark ? 20 : 100,
		primaryContainer: isDark ? 30 : 90,
		onPrimaryContainer: isDark ? 90 : 10,
		primaryFixed: 90,
		primaryFixedDim: 80,
		onPrimaryFixed: 10,
		onPrimaryFixedVariant: 30,
		inversePrimary: isDark ? 40 : 80,

		secondary: isDark ? 80 : 40,
		onSecondary: isDark ? 20 : 100,
		secondaryContainer: isDark ? 30 : 90,
		onSecondaryContainer: isDark ? 90 : 10,
		secondaryFixed: 90,
		secondaryFixedDim: 80,
		onSecondaryFixed: 10,
		onSecondaryFixedVariant: 30,

		tertiary: isDark ? 80 : 40,
		onTertiary: isDark ? 20 : 100,
		tertiaryContainer: isDark ? 30 : 90,
		onTertiaryContainer: isDark ? 90 : 10,
		tertiaryFixed: 90,
		tertiaryFixedDim: 80,
		onTertiaryFixed: 10,
		onTertiaryFixedVariant: 30,

		error: isDark ? 50 : 40,
		onError: isDark ? 100 : 100,
		errorContainer: isDark ? 30 : 90,
		onErrorContainer: isDark ? 90 : 10,

		surface: isDark ? 6 : 98,
		surfaceDim: isDark ? 6 : 87,
		surfaceBright: isDark ? 24 : 98,
		surfaceContainerLowest: isDark ? 4 : 100,
		surfaceContainerLow: isDark ? 10 : 96,
		surfaceContainer: isDark ? 12 : 94,
		surfaceContainerHigh: isDark ? 17 : 92,
		surfaceContainerHighest: isDark ? 22 : 90,
		onSurface: isDark ? 90 : 10,
		onSurfaceVariant: isDark ? 80 : 30,
		surfaceTint: isDark ? 80 : 40,
		inverseSurface: isDark ? 90 : 20,
		inverseOnSurface: isDark ? 20 : 95,

		outline: isDark ? 60 : 50,
		outlineVariant: isDark ? 15 : 80,
		shadow: 0,
		scrim: 0,
	}

	const newTheme: Partial<TSchmancyTheme> = {
		sys: {
			color: {
				// Neutral colors
				scrim: argbToHex(scheme.scrim),
				outline: argbToHex(neutralVariantPalette.tone(tones.outline)),
				outlineVariant: argbToHex(neutralVariantPalette.tone(tones.outlineVariant)),
				shadow: argbToHex(neutralPalette.tone(tones.shadow)),

				// Surface colors with complete tonal values
				surface: {
					default: argbToHex(neutralPalette.tone(tones.surface)),
					dim: argbToHex(neutralPalette.tone(tones.surfaceDim)),
					bright: argbToHex(neutralPalette.tone(tones.surfaceBright)),
					container: argbToHex(neutralPalette.tone(tones.surfaceContainer)),
					containerLow: argbToHex(neutralPalette.tone(tones.surfaceContainerLow)),
					containerLowest: argbToHex(neutralPalette.tone(tones.surfaceContainerLowest)),
					containerHigh: argbToHex(neutralPalette.tone(tones.surfaceContainerHigh)),
					containerHighest: argbToHex(neutralPalette.tone(tones.surfaceContainerHighest)),
					on: argbToHex(neutralPalette.tone(tones.onSurface)),
					onVariant: argbToHex(neutralVariantPalette.tone(tones.onSurfaceVariant)),
					tint: argbToHex(primaryPalette.tone(tones.surfaceTint)),
					inverse: argbToHex(neutralPalette.tone(tones.inverseSurface)),
					inverseOn: argbToHex(neutralPalette.tone(tones.inverseOnSurface)),
					// Deprecated mappings for backward compatibility
					low: argbToHex(neutralPalette.tone(tones.surfaceContainerLow)),
					high: argbToHex(neutralPalette.tone(tones.surfaceContainerHigh)),
					highest: argbToHex(neutralPalette.tone(tones.surfaceContainerHighest)),
					lowest: argbToHex(neutralPalette.tone(tones.surfaceContainerLowest)),
				},

				// Primary color roles with fixed variants
				primary: {
					default: argbToHex(primaryPalette.tone(tones.primary)),
					on: argbToHex(primaryPalette.tone(tones.onPrimary)),
					container: argbToHex(primaryPalette.tone(tones.primaryContainer)),
					onContainer: argbToHex(primaryPalette.tone(tones.onPrimaryContainer)),
					fixed: argbToHex(primaryPalette.tone(tones.primaryFixed)),
					fixedDim: argbToHex(primaryPalette.tone(tones.primaryFixedDim)),
					onFixed: argbToHex(primaryPalette.tone(tones.onPrimaryFixed)),
					onFixedVariant: argbToHex(primaryPalette.tone(tones.onPrimaryFixedVariant)),
					inverse: argbToHex(primaryPalette.tone(tones.inversePrimary)),
				},

				// Secondary color roles with fixed variants
				secondary: {
					default: argbToHex(secondaryPalette.tone(tones.secondary)),
					on: argbToHex(secondaryPalette.tone(tones.onSecondary)),
					container: argbToHex(secondaryPalette.tone(tones.secondaryContainer)),
					onContainer: argbToHex(secondaryPalette.tone(tones.onSecondaryContainer)),
					fixed: argbToHex(secondaryPalette.tone(tones.secondaryFixed)),
					fixedDim: argbToHex(secondaryPalette.tone(tones.secondaryFixedDim)),
					onFixed: argbToHex(secondaryPalette.tone(tones.onSecondaryFixed)),
					onFixedVariant: argbToHex(secondaryPalette.tone(tones.onSecondaryFixedVariant)),
				},

				// Tertiary color roles with fixed variants
				tertiary: {
					default: argbToHex(tertiaryPalette.tone(tones.tertiary)),
					on: argbToHex(tertiaryPalette.tone(tones.onTertiary)),
					container: argbToHex(tertiaryPalette.tone(tones.tertiaryContainer)),
					onContainer: argbToHex(tertiaryPalette.tone(tones.onTertiaryContainer)),
					fixed: argbToHex(tertiaryPalette.tone(tones.tertiaryFixed)),
					fixedDim: argbToHex(tertiaryPalette.tone(tones.tertiaryFixedDim)),
					onFixed: argbToHex(tertiaryPalette.tone(tones.onTertiaryFixed)),
					onFixedVariant: argbToHex(tertiaryPalette.tone(tones.onTertiaryFixedVariant)),
				},

				// Error color roles
				error: {
					default: argbToHex(errorPalette.tone(tones.error)),
					on: argbToHex(errorPalette.tone(tones.onError)),
					container: argbToHex(errorPalette.tone(tones.errorContainer)),
					onContainer: argbToHex(errorPalette.tone(tones.onErrorContainer)),
				},

				// Extended color roles - Success
				success: {
					default: successPalette[isDark ? '80' : '40'],
					on: successPalette[isDark ? '20' : '100'],
					container: successPalette[isDark ? '30' : '90'],
					onContainer: successPalette[isDark ? '90' : '10'],
				},

				// Extended color roles - Warning
				warning: {
					default: warningPalette[isDark ? '80' : '40'],
					on: warningPalette[isDark ? '20' : '100'],
					container: warningPalette[isDark ? '30' : '90'],
					onContainer: warningPalette[isDark ? '90' : '10'],
				},

				// Extended color roles - Info
				info: {
					default: infoPalette[isDark ? '80' : '40'],
					on: infoPalette[isDark ? '20' : '100'],
					container: infoPalette[isDark ? '30' : '90'],
					onContainer: infoPalette[isDark ? '90' : '10'],
				},
			},

			// M3 Typography System values (will be properly set in CSS)
			typography: {
				display: {
					large: 'display-large',
					medium: 'display-medium',
					small: 'display-small',
				},
				headline: {
					large: 'headline-large',
					medium: 'headline-medium',
					small: 'headline-small',
				},
				title: {
					large: 'title-large',
					medium: 'title-medium',
					small: 'title-small',
				},
				body: {
					large: 'body-large',
					medium: 'body-medium',
					small: 'body-small',
				},
				label: {
					large: 'label-large',
					medium: 'label-medium',
					small: 'label-small',
				},
			},

			// M3 Shape System
			shape: {
				corner: {
					none: '0',
					extraSmall: '4px',
					small: '8px',
					medium: '12px',
					large: '16px',
					extraLarge: '28px',
					full: '9999px',
				},
			},

			// M3 Elevation System with tinted shadows
			elevation: {
				0: '0 0 0 0 rgba(0, 0, 0, 0)',
				1: `0px 1px 2px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'}), 0px 1px 3px 1px rgba(0, 0, 0, ${isDark ? '0.15' : '0.1'})`,
				2: `0px 1px 2px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'}), 0px 2px 6px 2px rgba(0, 0, 0, ${isDark ? '0.15' : '0.1'})`,
				3: `0px 1px 3px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'}), 0px 4px 8px 3px rgba(0, 0, 0, ${isDark ? '0.15' : '0.1'})`,
				4: `0px 2px 3px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'}), 0px 6px 10px 4px rgba(0, 0, 0, ${isDark ? '0.15' : '0.1'})`,
				5: `0px 4px 4px rgba(0, 0, 0, ${isDark ? '0.3' : '0.15'}), 0px 8px 12px 6px rgba(0, 0, 0, ${isDark ? '0.15' : '0.1'})`,
			},

			// M3 Motion System
			motion: {
				easing: {
					emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
					emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
					emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
					standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
					standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
					standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
					legacy: 'cubic-bezier(0.4, 0, 0.2, 1)',
					linear: 'linear',
				},
				duration: {
					short1: '50ms',
					short2: '100ms',
					short3: '150ms',
					short4: '200ms',
					medium1: '250ms',
					medium2: '300ms',
					medium3: '350ms',
					medium4: '400ms',
					long1: '450ms',
					long2: '500ms',
					long3: '550ms',
					long4: '600ms',
					extraLong1: '700ms',
					extraLong2: '800ms',
					extraLong3: '900ms',
					extraLong4: '1000ms',
				},
			},

			// M3 State Layers
			state: {
				opacity: {
					hover: '0.08',
					focus: '0.12',
					pressed: '0.12',
					dragged: '0.16',
					disabled: '0.38',
					disabledContainer: '0.12',
				},
			},

			// M3 Spacing System (4dp grid)
			spacing: {
				0: '0',
				1: '4px',
				2: '8px',
				3: '12px',
				4: '16px',
				5: '20px',
				6: '24px',
				7: '28px',
				8: '32px',
				9: '36px',
				10: '40px',
				11: '44px',
				12: '48px',
			},

			// Legacy outline for backward compatibility
			outline: {
				1: '1px',
			},
		},

		// Reference palette - complete tonal values
		ref: {
			palette: {
				primary: createTonalPalette(primaryPalette.tone(40)) as any,
				secondary: createTonalPalette(secondaryPalette.tone(40)) as any,
				tertiary: createTonalPalette(tertiaryPalette.tone(40)) as any,
				neutral: createTonalPalette(neutralPalette.tone(40)) as any,
				neutralVariant: createTonalPalette(neutralVariantPalette.tone(40)) as any,
				error: createTonalPalette(errorPalette.tone(40)) as any,
			},
		},
	}

	return newTheme
}

/**
 * Backward compatibility wrapper for the old API
 */
export function createLightTonalPaletteFromBaseColor(hue: number, chroma: number) {
	const tonalPalette = TonalPalette.fromHueAndChroma(hue, chroma)
	return {
		cLowest: tonalPalette.tone(100),
		cLow: tonalPalette.tone(96),
		c: tonalPalette.tone(94),
		cHigh: tonalPalette.tone(92),
		cHighest: tonalPalette.tone(90),
		sDim: tonalPalette.tone(87),
		s: tonalPalette.tone(98),
		sBright: tonalPalette.tone(100),
	}
}

export function createDarkTonalPaletteFromBaseColor(hue: number, chroma: number) {
	const tonalPalette = TonalPalette.fromHueAndChroma(hue, chroma)
	return {
		cLowest: tonalPalette.tone(4),
		cLow: tonalPalette.tone(10),
		c: tonalPalette.tone(12),
		cHigh: tonalPalette.tone(17),
		cHighest: tonalPalette.tone(22),
		sDim: tonalPalette.tone(6),
		s: tonalPalette.tone(6),
		sBright: tonalPalette.tone(24),
	}
}
