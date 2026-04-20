/**
 * Luminous Glass surface types.
 *
 * Structural types control depth via blur intensity and opacity.
 * Nothing is opaque — every layer is translucent glass:
 * - `solid`    — Dense glass, barely translucent (highest readability, 2px blur)
 * - `subtle`   — Frosted glass panel (8px blur, 65% opacity)
 * - `glass`    — Full frosted glass with shimmer highlight (16px blur, 30% opacity)
 * - `luminous` — Glass + animated glow halo for hero panels (24px blur, 22% opacity)
 *
 * Semantic types apply tinted glass for status/role:
 * - `primary`, `secondary`, `tertiary`, `error`, `success`, `warning`, `info`
 *
 * Utility types:
 * - `transparent` — No background
 * - `outlined`    — Border only with luminous hover
 */

/** New Luminous Glass types */
export type TSurfaceColorNew =
	| 'solid'
	| 'subtle'
	| 'glass'
	| 'luminous'
	| 'transparent'
	| 'outlined'
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'error'
	| 'success'
	| 'warning'
	| 'info'

/**
 * @deprecated Legacy M3 types — mapped to new Luminous Glass equivalents.
 * - surface, surfaceDim, surfaceBright, containerLowest → solid
 * - containerLow, container → subtle
 * - containerHigh, containerHighest, glassOforim → glass
 */
export type TSurfaceColorLegacy =
	| 'surface'
	| 'surfaceDim'
	| 'surfaceBright'
	| 'containerLowest'
	| 'containerLow'
	| 'container'
	| 'containerHigh'
	| 'containerHighest'
	| 'glassOforim'

export type TSurfaceColor = TSurfaceColorNew | TSurfaceColorLegacy
