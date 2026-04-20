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
/** Spring configuration parameters */
export interface SpringConfig {
    /** Spring stiffness (higher = faster) */
    stiffness: number;
    /** Damping ratio (higher = less bounce) */
    damping: number;
    /** Mass (higher = slower) */
    mass: number;
}
/** Animation preset with all timing values */
export interface AnimationPreset {
    /** Human-readable name */
    name: string;
    /** Duration in milliseconds */
    duration: number;
    /** CSS linear() easing function (modern browsers) */
    easing: string;
    /** Cubic-bezier fallback (all browsers) */
    easingFallback: string;
    /** Spring configuration used to generate this preset */
    spring: SpringConfig;
}
/** Keyframe options for Web Animations API */
export interface BlackbirdKeyframes {
    /** Starting state */
    from: Keyframe;
    /** Ending state */
    to: Keyframe;
}
/** Complete animation configuration */
export interface BlackbirdAnimation {
    keyframes: Keyframe[];
    options: KeyframeAnimationOptions;
}
/**
 * Smooth preset - Apple-style, subtle overshoot
 * Best for: Details, accordions, content reveals
 */
export declare const SPRING_SMOOTH: AnimationPreset;
/**
 * Snappy preset - Quick with minimal overshoot
 * Best for: Buttons, toggles, quick interactions
 */
export declare const SPRING_SNAPPY: AnimationPreset;
/**
 * Bouncy preset - Playful with noticeable overshoot
 * Best for: Notifications, celebrations, attention-grabbing
 */
export declare const SPRING_BOUNCY: AnimationPreset;
/**
 * Gentle preset - Slow, smooth, no overshoot
 * Best for: Page transitions, modal backgrounds, subtle reveals
 */
export declare const SPRING_GENTLE: AnimationPreset;
/** @deprecated Use SPRING_SMOOTH.easingFallback instead */
export declare const BLACKBIRD_EASING: string;
/** Standard easing for smooth transitions */
export declare const EASE_OUT = "ease-out";
export declare const EASE_IN = "ease-in";
/** Standard durations */
export declare const DURATION_ENTER: number;
export declare const DURATION_EXIT = 150;
export declare const DURATION_BACKDROP = 200;
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
export declare const ANIMATION_CSS_VARS: string;
/**
 * Get the appropriate easing function based on browser support.
 * Uses linear() if supported, falls back to cubic-bezier.
 */
export declare function getEasing(preset: AnimationPreset): string;
/**
 * Check if the browser supports reduced motion preference.
 */
export declare function prefersReducedMotion(): boolean;
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
export declare function createAnimation(preset: AnimationPreset, keyframes: BlackbirdKeyframes): BlackbirdAnimation;
/**
 * Create a reveal animation (fade in + slide up).
 * Common pattern for content appearing.
 */
export declare function createRevealAnimation(preset?: AnimationPreset, distance?: number): BlackbirdAnimation;
/**
 * Create a dismiss animation (fade out + slide up).
 * Common pattern for content disappearing.
 */
export declare function createDismissAnimation(preset?: AnimationPreset, distance?: number): BlackbirdAnimation;
/**
 * Create a scale animation (pop in/out).
 * Common pattern for buttons and interactive elements.
 */
export declare function createScaleAnimation(preset?: AnimationPreset, fromScale?: number, toScale?: number): BlackbirdAnimation;
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
export declare const tailwindAnimations: {
    transitionTimingFunction: {
        'spring-smooth': string;
        'spring-snappy': string;
        'spring-bouncy': string;
        'spring-gentle': string;
    };
    transitionDuration: {
        'spring-smooth': string;
        'spring-snappy': string;
        'spring-bouncy': string;
        'spring-gentle': string;
    };
    keyframes: {
        'blackbird-reveal': {
            '0%': {
                opacity: string;
                transform: string;
            };
            '100%': {
                opacity: string;
                transform: string;
            };
        };
        'blackbird-dismiss': {
            '0%': {
                opacity: string;
                transform: string;
            };
            '100%': {
                opacity: string;
                transform: string;
            };
        };
        'blackbird-scale-in': {
            '0%': {
                opacity: string;
                transform: string;
            };
            '100%': {
                opacity: string;
                transform: string;
            };
        };
        'blackbird-scale-out': {
            '0%': {
                opacity: string;
                transform: string;
            };
            '100%': {
                opacity: string;
                transform: string;
            };
        };
        'blackbird-slide-up': {
            '0%': {
                transform: string;
            };
            '100%': {
                transform: string;
            };
        };
        'blackbird-slide-down': {
            '0%': {
                transform: string;
            };
            '100%': {
                transform: string;
            };
        };
    };
    animation: {
        'blackbird-reveal': string;
        'blackbird-dismiss': string;
        'blackbird-scale-in': string;
        'blackbird-scale-out': string;
        'blackbird-slide-up': string;
        'blackbird-slide-down': string;
    };
};
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
export declare const GRID_ANIMATION_CSS: string;
