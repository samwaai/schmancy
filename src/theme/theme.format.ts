import { Theme, TonalPalette } from '@material/material-color-utilities'
import { TSchmancyTheme } from './theme.interface'

export function formateTheme(originalScheme: Theme, isDark = false): Partial<TSchmancyTheme> {
	function argbToHex(argb: number): string {
		return '#' + argb.toString(16).padStart(8, '0').slice(2)
	}

	if (isDark) {
		const darkScheme = originalScheme.schemes.dark
		const exraDarkColors = createDarkTonalPaletteFromBaseColor(
			originalScheme.palettes.neutral.hue,
			originalScheme.palettes.neutral.chroma,
		)
		const newDarkScheme: TSchmancyTheme = {
			sys: {
				color: {
					scrim: argbToHex(darkScheme.scrim),
					outlineVariant: argbToHex(darkScheme.outlineVariant),
					outline: argbToHex(darkScheme.outline),
					surface: {
						default: argbToHex(darkScheme.surface),
						dim: argbToHex(exraDarkColors.sDim),
						bright: argbToHex(exraDarkColors.sBright),
						on: argbToHex(darkScheme.onSurface),
						onVariant: argbToHex(darkScheme.onSurfaceVariant),
						highest: argbToHex(exraDarkColors.cHighest),
						high: argbToHex(exraDarkColors.cHigh),
						container: argbToHex(exraDarkColors.c),
						low: argbToHex(exraDarkColors.cLow),
						lowest: argbToHex(exraDarkColors.cLowest),
					},
					primary: {
						default: argbToHex(darkScheme.primary),
						on: argbToHex(darkScheme.onPrimary),
						container: argbToHex(darkScheme.primaryContainer),
						onContainer: argbToHex(darkScheme.onPrimaryContainer),
					},
					secondary: {
						default: argbToHex(darkScheme.secondary),
						on: argbToHex(darkScheme.onSecondary),
						container: argbToHex(darkScheme.secondaryContainer),
						onContainer: argbToHex(darkScheme.onSecondaryContainer),
					},
					tertiary: {
						default: argbToHex(darkScheme.tertiary),
						on: argbToHex(darkScheme.onTertiary),
						container: argbToHex(darkScheme.tertiaryContainer),
						onContainer: argbToHex(darkScheme.onTertiaryContainer),
					},
					error: {
						default: argbToHex(darkScheme.error),
						on: argbToHex(darkScheme.onError),
						container: argbToHex(darkScheme.errorContainer),
						onContainer: argbToHex(darkScheme.onErrorContainer),
					},
					success: {
						default: '#00FF00',
						on: '#000000',
						container: '#00FF00',
						onContainer: '#000000',
					},
				},
				elevation: {
					0: '0 0 0 0 rgba(0, 0, 0, 0)',
					1: 'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
					2: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
					3: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px',
					4: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
					5: 'rgba(0, 0, 0, 0.2) 0px 7px 8px -4px, rgba(0, 0, 0, 0.14) 0px 12px 17px 2px, rgba(0, 0, 0, 0.12) 0px 5px 22px 4px',
				},
				outline: {
					1: '1px',
				},
			},
		}
		return newDarkScheme
	} else {
		const lightScheme = originalScheme.schemes.light
		const exralightColors = createLightTonalPaletteFromBaseColor(
			originalScheme.palettes.neutral.hue,
			originalScheme.palettes.neutral.chroma,
		)
		const newLightScheme: TSchmancyTheme = {
			sys: {
				color: {
					scrim: argbToHex(lightScheme.scrim),
					outlineVariant: argbToHex(lightScheme.outlineVariant),
					outline: argbToHex(lightScheme.outline),
					surface: {
						default: argbToHex(lightScheme.surface),
						dim: argbToHex(exralightColors.sDim),
						bright: argbToHex(exralightColors.sBright),
						on: argbToHex(lightScheme.onSurface),
						onVariant: argbToHex(lightScheme.onSurfaceVariant),
						highest: argbToHex(exralightColors.cHighest),
						high: argbToHex(exralightColors.cHigh),
						container: argbToHex(exralightColors.c),
						low: argbToHex(exralightColors.cLow),
						lowest: argbToHex(exralightColors.cLowest),
					},
					primary: {
						default: argbToHex(lightScheme.primary),
						on: argbToHex(lightScheme.onPrimary),
						container: argbToHex(lightScheme.primaryContainer),
						onContainer: argbToHex(lightScheme.onPrimaryContainer),
					},
					secondary: {
						default: argbToHex(lightScheme.secondary),
						on: argbToHex(lightScheme.onSecondary),
						container: argbToHex(lightScheme.secondaryContainer),
						onContainer: argbToHex(lightScheme.onSecondaryContainer),
					},
					tertiary: {
						default: argbToHex(lightScheme.tertiary),
						on: argbToHex(lightScheme.onTertiary),
						container: argbToHex(lightScheme.tertiaryContainer),
						onContainer: argbToHex(lightScheme.onTertiaryContainer),
					},
					error: {
						default: argbToHex(lightScheme.error),
						on: argbToHex(lightScheme.onError),
						container: argbToHex(lightScheme.errorContainer),
						onContainer: argbToHex(lightScheme.onErrorContainer),
					},
					success: {
						default: '#00FF00',
						on: '#000000',
						container: '#00FF00',
						onContainer: '#000000',
					},
				},
				elevation: {
					0: '0 0 0 0 rgba(0, 0, 0, 0)',
					1: 'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
					2: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
					3: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px',
					4: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
					5: 'rgba(0, 0, 0, 0.2) 0px 7px 8px -4px, rgba(0, 0, 0, 0.14) 0px 12px 17px 2px, rgba(0, 0, 0, 0.12) 0px 5px 22px 4px',
				},
				outline: {
					1: '1px',
				},
			},
		}
		return newLightScheme
	}
}

function createLightTonalPaletteFromBaseColor(hue: number, chroma: number) {
	const tonalPalette = TonalPalette.fromHueAndChroma(hue, chroma)
	return {
		cLowest: tonalPalette.tone(100), // Pure white
		cLow: tonalPalette.tone(96),
		c: tonalPalette.tone(94),
		cHigh: tonalPalette.tone(92),
		cHighest: tonalPalette.tone(90),
		sDim: tonalPalette.tone(87),
		s: tonalPalette.tone(98),
		sBright: tonalPalette.tone(100), // Pure white
	}
}

function createDarkTonalPaletteFromBaseColor(hue: number, chroma: number) {
	const tonalPalette = TonalPalette.fromHueAndChroma(hue, chroma)
	return {
		cLowest: tonalPalette.tone(0), // Pure black
		cLow: tonalPalette.tone(10),
		c: tonalPalette.tone(12),
		cHigh: tonalPalette.tone(17),
		cHighest: tonalPalette.tone(22),
		sDim: tonalPalette.tone(0), // Pure black
		s: tonalPalette.tone(6),
		sBright: tonalPalette.tone(24),
	}
}
