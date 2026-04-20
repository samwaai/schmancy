/**
 * Blackbird Animation System
 *
 * A comprehensive animation system using spring physics for natural,
 * organic motion. Named after the smooth, arcing flight patterns of birds.
 *
 * Features:
 * - Spring physics via CSS linear() (88% browser support)
 * - Cubic-bezier fallbacks for older browsers
 * - Typed interfaces for Web Animations API
 * - CSS custom properties for Tailwind integration
 * - Multiple presets: smooth, snappy, bouncy
 *
 * @see https://www.joshwcomeau.com/animation/linear-timing-function/
 * @see https://developer.chrome.com/docs/css-ui/css-linear-easing-function
 */

// =============================================================================
// TYPES
// =============================================================================

/** Spring configuration parameters */
export interface SpringConfig {
	/** Spring stiffness (higher = faster) */
	stiffness: number
	/** Damping ratio (higher = less bounce) */
	damping: number
	/** Mass (higher = slower) */
	mass: number
}

/** Animation preset with all timing values */
export interface AnimationPreset {
	/** Human-readable name */
	name: string
	/** Duration in milliseconds */
	duration: number
	/** CSS linear() easing function (modern browsers) */
	easing: string
	/** Cubic-bezier fallback (all browsers) */
	easingFallback: string
	/** Spring configuration used to generate this preset */
	spring: SpringConfig
}

/** Keyframe options for Web Animations API */
export interface BlackbirdKeyframes {
	/** Starting state */
	from: Keyframe
	/** Ending state */
	to: Keyframe
}

/** Complete animation configuration */
export interface BlackbirdAnimation {
	keyframes: Keyframe[]
	options: KeyframeAnimationOptions
}

// =============================================================================
// SPRING PRESETS
// =============================================================================

/**
 * Smooth preset - Apple-style, subtle overshoot
 * Best for: Details, accordions, content reveals
 */
export const SPRING_SMOOTH: AnimationPreset = {
	name: 'smooth',
	duration: 500,
	easing: `linear(
		0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
		0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50%, 1.015 54.8%,
		1.017 63.3%, 1.001
	)`,
	easingFallback: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	spring: { stiffness: 100, damping: 15, mass: 1 },
}

/**
 * Snappy preset - Quick with minimal overshoot
 * Best for: Buttons, toggles, quick interactions
 */
export const SPRING_SNAPPY: AnimationPreset = {
	name: 'snappy',
	duration: 300,
	easing: `linear(
		0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 15.5%, 0.938 23.8%,
		1.017 30.2%, 1.041 37.3%, 1.026 52.4%, 1.001
	)`,
	easingFallback: 'cubic-bezier(0.22, 1.25, 0.36, 1)',
	spring: { stiffness: 200, damping: 20, mass: 1 },
}

/**
 * Bouncy preset - Playful with noticeable overshoot
 * Best for: Notifications, celebrations, attention-grabbing
 */
export const SPRING_BOUNCY: AnimationPreset = {
	name: 'bouncy',
	duration: 600,
	easing: `linear(
		0, 0.004, 0.016 2.3%, 0.065 4.8%, 0.258 9.9%, 0.489 15%,
		0.683 20.1%, 0.847 25.4%, 0.963 30.6%, 1.039 36%, 1.086 41.8%,
		1.107 48.1%, 1.101 55.1%, 1.064 73.1%, 1.026 85.2%, 1.001
	)`,
	easingFallback: 'cubic-bezier(0.34, 1.8, 0.64, 1)',
	spring: { stiffness: 100, damping: 10, mass: 1 },
}

/**
 * Gentle preset - Slow, smooth, no overshoot
 * Best for: Page transitions, modal backgrounds, subtle reveals
 */
export const SPRING_GENTLE: AnimationPreset = {
	name: 'gentle',
	duration: 700,
	easing: `linear(
		0, 0.002, 0.009 2.6%, 0.036 5.3%, 0.153 11.3%, 0.352 18.5%,
		0.554 25.4%, 0.733 32.6%, 0.865 40.2%, 0.945 48.5%,
		0.984 58.2%, 0.997 70.5%, 1
	)`,
	easingFallback: 'cubic-bezier(0.4, 0, 0.2, 1)',
	spring: { stiffness: 80, damping: 25, mass: 1.2 },
}

// =============================================================================
// LEGACY EXPORTS (backwards compatibility)
// =============================================================================

/** @deprecated Use SPRING_SMOOTH.easingFallback instead */
export const BLACKBIRD_EASING = SPRING_SMOOTH.easingFallback

/** Standard easing for smooth transitions */
export const EASE_OUT = 'ease-out'
export const EASE_IN = 'ease-in'

/** Standard durations */
export const DURATION_ENTER = SPRING_SNAPPY.duration
export const DURATION_EXIT = 150
export const DURATION_BACKDROP = 200

// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

/**
 * CSS custom properties for use in stylesheets.
 * These can be injected into :root or a component's styles.
 *
 * @example
 * ```css
 * :root {
 *   ${ANIMATION_CSS_VARS}
 * }
 *
 * .element {
 *   transition: transform var(--blackbird-duration-smooth) var(--blackbird-easing-smooth);
 * }
 * ```
 */
export const ANIMATION_CSS_VARS = `
	/* Blackbird Animation System - Spring Physics */

	/* Smooth preset (Apple-style) */
	--blackbird-duration-smooth: ${SPRING_SMOOTH.duration}ms;
	--blackbird-easing-smooth: ${SPRING_SMOOTH.easingFallback};
	--blackbird-easing-smooth-spring: ${SPRING_SMOOTH.easing};

	/* Snappy preset (quick interactions) */
	--blackbird-duration-snappy: ${SPRING_SNAPPY.duration}ms;
	--blackbird-easing-snappy: ${SPRING_SNAPPY.easingFallback};
	--blackbird-easing-snappy-spring: ${SPRING_SNAPPY.easing};

	/* Bouncy preset (playful) */
	--blackbird-duration-bouncy: ${SPRING_BOUNCY.duration}ms;
	--blackbird-easing-bouncy: ${SPRING_BOUNCY.easingFallback};
	--blackbird-easing-bouncy-spring: ${SPRING_BOUNCY.easing};

	/* Gentle preset (subtle) */
	--blackbird-duration-gentle: ${SPRING_GENTLE.duration}ms;
	--blackbird-easing-gentle: ${SPRING_GENTLE.easingFallback};
	--blackbird-easing-gentle-spring: ${SPRING_GENTLE.easing};
`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the appropriate easing function based on browser support.
 * Uses linear() if supported, falls back to cubic-bezier.
 */
export function getEasing(preset: AnimationPreset): string {
	// Feature detect linear() support
	if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timing-function', 'linear(0, 1)')) {
		return preset.easing
	}
	return preset.easingFallback
}

/**
 * Check if the browser supports reduced motion preference.
 */
export function prefersReducedMotion(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Create a Web Animations API animation configuration.
 *
 * @example
 * ```ts
 * const anim = createAnimation(SPRING_SMOOTH, {
 *   from: { opacity: 0, transform: 'translateY(-16px)' },
 *   to: { opacity: 1, transform: 'translateY(0)' }
 * })
 *
 * element.animate(anim.keyframes, anim.options)
 * ```
 */
export function createAnimation(preset: AnimationPreset, keyframes: BlackbirdKeyframes): BlackbirdAnimation {
	// Respect reduced motion preference
	if (prefersReducedMotion()) {
		return {
			keyframes: [keyframes.to],
			options: { duration: 0, fill: 'forwards' },
		}
	}

	return {
		keyframes: [keyframes.from, keyframes.to],
		options: {
			duration: preset.duration,
			easing: preset.easingFallback, // Web Animations API doesn't support linear() well
			fill: 'forwards',
		},
	}
}

/**
 * Create a reveal animation (fade in + slide up).
 * Common pattern for content appearing.
 */
export function createRevealAnimation(
	preset: AnimationPreset = SPRING_SMOOTH,
	distance = 16,
): BlackbirdAnimation {
	return createAnimation(preset, {
		from: { opacity: 0, transform: `translateY(-${distance}px) scale(0.96)` },
		to: { opacity: 1, transform: 'translateY(0) scale(1)' },
	})
}

/**
 * Create a dismiss animation (fade out + slide up).
 * Common pattern for content disappearing.
 */
export function createDismissAnimation(
	preset: AnimationPreset = SPRING_SMOOTH,
	distance = 12,
): BlackbirdAnimation {
	const anim = createAnimation(preset, {
		from: { opacity: 1, transform: 'translateY(0) scale(1)' },
		to: { opacity: 0, transform: `translateY(-${distance}px) scale(0.97)` },
	})

	// Dismiss is slightly faster
	if (anim.options.duration) {
		anim.options.duration = (anim.options.duration as number) * 0.7
	}

	return anim
}

/**
 * Create a scale animation (pop in/out).
 * Common pattern for buttons and interactive elements.
 */
export function createScaleAnimation(
	preset: AnimationPreset = SPRING_SNAPPY,
	fromScale = 0.9,
	toScale = 1,
): BlackbirdAnimation {
	return createAnimation(preset, {
		from: { opacity: fromScale < toScale ? 0 : 1, transform: `scale(${fromScale})` },
		to: { opacity: fromScale < toScale ? 1 : 0, transform: `scale(${toScale})` },
	})
}

// =============================================================================
// TAILWIND UTILITIES (for use in tailwind.config.js)
// =============================================================================

/**
 * Tailwind CSS animation utilities configuration.
 * Import this into your tailwind.config.js to add Blackbird animations.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * const { tailwindAnimations } = require('@mhmo91/schmancy/utils/animation')
 *
 * module.exports = {
 *   theme: {
 *     extend: {
 *       ...tailwindAnimations
 *     }
 *   }
 * }
 * ```
 */
export const tailwindAnimations = {
	transitionTimingFunction: {
		'spring-smooth': SPRING_SMOOTH.easingFallback,
		'spring-snappy': SPRING_SNAPPY.easingFallback,
		'spring-bouncy': SPRING_BOUNCY.easingFallback,
		'spring-gentle': SPRING_GENTLE.easingFallback,
	},
	transitionDuration: {
		'spring-smooth': `${SPRING_SMOOTH.duration}ms`,
		'spring-snappy': `${SPRING_SNAPPY.duration}ms`,
		'spring-bouncy': `${SPRING_BOUNCY.duration}ms`,
		'spring-gentle': `${SPRING_GENTLE.duration}ms`,
	},
	keyframes: {
		'blackbird-reveal': {
			'0%': { opacity: '0', transform: 'translateY(-16px) scale(0.96)' },
			'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
		},
		'blackbird-dismiss': {
			'0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
			'100%': { opacity: '0', transform: 'translateY(-12px) scale(0.97)' },
		},
		'blackbird-scale-in': {
			'0%': { opacity: '0', transform: 'scale(0.9)' },
			'100%': { opacity: '1', transform: 'scale(1)' },
		},
		'blackbird-scale-out': {
			'0%': { opacity: '1', transform: 'scale(1)' },
			'100%': { opacity: '0', transform: 'scale(0.9)' },
		},
		'blackbird-slide-up': {
			'0%': { transform: 'translateY(100%)' },
			'100%': { transform: 'translateY(0)' },
		},
		'blackbird-slide-down': {
			'0%': { transform: 'translateY(0)' },
			'100%': { transform: 'translateY(100%)' },
		},
	},
	animation: {
		'blackbird-reveal': `blackbird-reveal ${SPRING_SMOOTH.duration}ms ${SPRING_SMOOTH.easingFallback} forwards`,
		'blackbird-dismiss': `blackbird-dismiss ${SPRING_SMOOTH.duration * 0.7}ms ${SPRING_SMOOTH.easingFallback} forwards`,
		'blackbird-scale-in': `blackbird-scale-in ${SPRING_SNAPPY.duration}ms ${SPRING_SNAPPY.easingFallback} forwards`,
		'blackbird-scale-out': `blackbird-scale-out ${SPRING_SNAPPY.duration * 0.7}ms ${SPRING_SNAPPY.easingFallback} forwards`,
		'blackbird-slide-up': `blackbird-slide-up ${SPRING_SMOOTH.duration}ms ${SPRING_SMOOTH.easingFallback} forwards`,
		'blackbird-slide-down': `blackbird-slide-down ${SPRING_SMOOTH.duration * 0.7}ms ${SPRING_SMOOTH.easingFallback} forwards`,
	},
}

// =============================================================================
// CSS-IN-JS UTILITIES (for Lit components)
// =============================================================================

/**
 * CSS string with spring-based grid animation for details/accordions.
 * Use with grid-template-rows for smooth height animation.
 *
 * @example
 * ```ts
 * import { css } from 'lit'
 * import { GRID_ANIMATION_CSS } from '@mhmo91/schmancy'
 *
 * static styles = css`
 *   ${GRID_ANIMATION_CSS}
 *
 *   .content {
 *     display: grid;
 *     grid-template-rows: 0fr;
 *   }
 *   .content[data-open='true'] {
 *     grid-template-rows: 1fr;
 *   }
 * `
 * ```
 */
export const GRID_ANIMATION_CSS = `
	/* Grid-based height animation with spring physics */
	.blackbird-grid {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: grid-template-rows ${SPRING_SMOOTH.duration}ms ${SPRING_SMOOTH.easingFallback};
	}

	/* Use spring easing when linear() is supported */
	@supports (animation-timing-function: linear(0, 1)) {
		.blackbird-grid {
			transition: grid-template-rows ${SPRING_SMOOTH.duration}ms ${SPRING_SMOOTH.easing};
		}
	}

	.blackbird-grid[data-open='true'],
	.blackbird-grid.open {
		grid-template-rows: 1fr;
	}

	.blackbird-grid > * {
		overflow: hidden;
	}

	@media (prefers-reduced-motion: reduce) {
		.blackbird-grid {
			transition: none;
		}
	}
`
