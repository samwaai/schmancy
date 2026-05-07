import { css } from 'lit'

/**
 * Luminous Glass surface type styles.
 *
 * Depth model: blur intensity + opacity replaces M3 tonal hierarchy.
 * - solid:    opaque ground (0 blur, 100% opacity)
 * - subtle:   frosted panel (4px blur, ~72% opacity)
 * - glass:    full frosted glass (20px blur, ~55% opacity)
 * - luminous: glass + glow halo (24px blur, ~22% opacity)
 */
export const surfaceTypeStyles = css`
	/* ================================================================
	   STRUCTURAL TYPES — All-glass depth model.
	   Nothing is opaque. Every layer is translucent.
	   Blur creates readability. Light borders isolate layers.
	   Rule: text must ALWAYS be readable on every surface.
	   ================================================================ */

	/* Solid — dense glass, high readability ground layer (no blur — 92% opacity is enough) */
	:host([type='solid']) {
		--glass-base: var(--schmancy-sys-color-surface-lowest);
		--glass-tint: var(--schmancy-sys-color-surface-on);
		background: color-mix(in srgb, var(--glass-base) 92%, transparent);
		color: var(--schmancy-sys-color-surface-on);
	}

	/* Subtle — frosted glass, clearly readable */
	:host([type='subtle']) {
		--glass-base: var(--schmancy-sys-color-surface-container);
		--glass-tint: var(--schmancy-sys-color-surface-on);
		background: color-mix(in srgb, var(--glass-base) 78%, transparent);
		backdrop-filter: blur(8px) saturate(130%);
		-webkit-backdrop-filter: blur(8px) saturate(130%);
		color: var(--schmancy-sys-color-surface-on);
	}

	/* Glass — frosted glass, blur ensures readability */
	:host([type='glass']) {
		--glass-base: var(--schmancy-sys-color-surface-lowest);
		--glass-tint: var(--schmancy-sys-color-surface-on);

		background: color-mix(in srgb, var(--glass-base) 55%, transparent);
		backdrop-filter: blur(16px) saturate(180%) brightness(1.05);
		-webkit-backdrop-filter: blur(16px) saturate(180%) brightness(1.05);
		color: var(--schmancy-sys-color-surface-on);
		contain: content;
		position: relative;
		overflow: hidden;
		isolation: isolate;
	}

	/* Luminous — glass + glow halo, heavy blur keeps readability */
	:host([type='luminous']) {
		--glass-base: var(--schmancy-sys-color-surface-lowest);
		--glass-tint: var(--schmancy-sys-color-surface-on);
		--glow-color: var(--schmancy-sys-color-primary-default);

		background: color-mix(in srgb, var(--glass-base) 42%, transparent);
		backdrop-filter: blur(20px) saturate(200%) brightness(1.08);
		-webkit-backdrop-filter: blur(20px) saturate(200%) brightness(1.08);
		color: var(--schmancy-sys-color-surface-on);
		contain: content;
		position: relative;
		overflow: hidden;
		isolation: isolate;
	}

	/* ================================================================
	   UTILITY TYPES
	   ================================================================ */

	/* Transparent — no background */
	:host([type='transparent']) {
		background-color: transparent;
		color: var(--schmancy-sys-color-surface-on);
	}

	/* Outlined — border with luminous hover potential */
	:host([type='outlined']) {
		background-color: transparent;
		color: var(--schmancy-sys-color-surface-on);
		border: 1px solid var(--schmancy-sys-color-outlineVariant);
		transition: border-color 300ms ease, box-shadow 300ms ease;
	}

	/* ================================================================
	   SEMANTIC TYPES — tinted glass for status/role
	   ================================================================ */

	:host([type='primary']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-primary-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-primary-default);
	}
	:host([type='secondary']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-secondary-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-secondary-default);
	}
	:host([type='tertiary']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-tertiary-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-tertiary-default);
	}
	:host([type='error']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-error-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-error-onContainer);
	}
	:host([type='success']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-success-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-success-onContainer);
	}
	:host([type='warning']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-warning-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-warning-onContainer);
	}
	:host([type='info']) {
		background: color-mix(in srgb, var(--schmancy-sys-color-info-default) 12%, transparent);
		backdrop-filter: blur(4px) saturate(140%);
		-webkit-backdrop-filter: blur(4px) saturate(140%);
		color: var(--schmancy-sys-color-info-onContainer);
	}

	/* ================================================================
	   LEGACY M3 ALIASES — backward compatibility
	   Old type names render as their new Luminous Glass equivalents.
	   ================================================================ */

	/* solid aliases — dense glass */
	:host([type='surface']),
	:host([type='surfaceDim']),
	:host([type='surfaceBright']),
	:host([type='containerLowest']) {
		--glass-base: var(--schmancy-sys-color-surface-lowest);
		--glass-tint: var(--schmancy-sys-color-surface-on);
		background: color-mix(in srgb, var(--glass-base) 92%, transparent);
		color: var(--schmancy-sys-color-surface-on);
	}

	/* subtle aliases — frosted glass */
	:host([type='containerLow']),
	:host([type='container']) {
		--glass-base: var(--schmancy-sys-color-surface-container);
		--glass-tint: var(--schmancy-sys-color-surface-on);
		background: color-mix(in srgb, var(--glass-base) 78%, transparent);
		backdrop-filter: blur(8px) saturate(130%);
		-webkit-backdrop-filter: blur(8px) saturate(130%);
		color: var(--schmancy-sys-color-surface-on);
	}

	/* glass aliases */
	:host([type='containerHigh']),
	:host([type='containerHighest']),
	:host([type='glassOforim']) {
		--glass-base: var(--schmancy-sys-color-surface-lowest);
		--glass-tint: var(--schmancy-sys-color-surface-on);

		background: color-mix(in srgb, var(--glass-base) 55%, transparent);
		backdrop-filter: blur(16px) saturate(180%) brightness(1.05);
		-webkit-backdrop-filter: blur(16px) saturate(180%) brightness(1.05);
		color: var(--schmancy-sys-color-surface-on);
		position: relative;
		overflow: hidden;
		isolation: isolate;
	}

	/* ================================================================
	   REDUCED MOTION — disable glass animations
	   ================================================================ */
`

/**
 * Surface fill styles - dimension control
 */
export const surfaceFillStyles = css`
	:host([fill='all']) {
		height: 100%;
		width: 100%;
	}
	:host([fill='width']) {
		width: 100%;
	}
	:host([fill='height']) {
		height: 100%;
	}
`

/**
 * Surface rounded corner styles
 */
export const surfaceRoundedStyles = css`
	:host([rounded='none']) {
		border-radius: 0;
	}
	:host([rounded='top']) {
		border-radius: var(--schmancy-sys-shape-corner-large) var(--schmancy-sys-shape-corner-large) 0 0;
	}
	:host([rounded='left']) {
		border-radius: var(--schmancy-sys-shape-corner-large) 0 0 var(--schmancy-sys-shape-corner-large);
	}
	:host([rounded='right']) {
		border-radius: 0 var(--schmancy-sys-shape-corner-large) var(--schmancy-sys-shape-corner-large) 0;
	}
	:host([rounded='bottom']) {
		border-radius: 0 0 var(--schmancy-sys-shape-corner-large) var(--schmancy-sys-shape-corner-large);
	}
	:host([rounded='all']) {
		border-radius: var(--schmancy-sys-shape-corner-large);
	}
`

/**
 * Luminous glow elevation — replaces M3 dark drop shadows with primary-colored glow.
 * No ::after tint overlay — depth comes from glow intensity, not surface tint.
 */
export const surfaceElevationStyles = css`
	:host([elevation='1']) {
		box-shadow: 0 2px 12px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
		position: relative;
	}
	:host([elevation='2']) {
		box-shadow: 0 4px 20px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 22%, transparent);
		position: relative;
	}
	:host([elevation='3']) {
		box-shadow: 0 8px 32px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 28%, transparent);
		position: relative;
	}
	:host([elevation='4']) {
		box-shadow: 0 12px 44px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 35%, transparent);
		position: relative;
	}
	:host([elevation='5']) {
		box-shadow: 0 20px 60px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 42%, transparent);
		position: relative;
	}
`

/**
 * Surface clickable styles - luminous hover, spring active
 */
export const surfaceClickableStyles = css`
	:host([clickable]) {
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition:
			filter 200ms ease,
			transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 400ms ease;
	}
	:host([clickable]:hover) {
		filter: brightness(1.03);
	}
	:host([clickable]:active) {
		filter: brightness(0.96);
		transform: scale(0.98);
		transition-duration: 100ms;
	}
	:host([clickable]:focus-visible) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([clickable]) { transition: filter 150ms ease; }
		:host([clickable]:hover) { transform: none; box-shadow: none; }
		:host([clickable]:active) { transform: none; }
	}
`

/**
 * Combined surface styles - includes all surface styling capabilities
 */
export const surfaceStyles = css`
	${surfaceTypeStyles}
	${surfaceFillStyles}
	${surfaceRoundedStyles}
	${surfaceElevationStyles}
	${surfaceClickableStyles}
`
