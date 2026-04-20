/**
 * Luminous Glass surface type styles.
 *
 * Depth model: blur intensity + opacity replaces M3 tonal hierarchy.
 * - solid:    opaque ground (0 blur, 100% opacity)
 * - subtle:   frosted panel (4px blur, ~72% opacity)
 * - glass:    full frosted glass (20px blur, ~55% opacity)
 * - luminous: glass + glow halo (24px blur, ~22% opacity)
 */
export declare const surfaceTypeStyles: import("lit").CSSResult;
/**
 * Surface fill styles - dimension control
 */
export declare const surfaceFillStyles: import("lit").CSSResult;
/**
 * Surface rounded corner styles
 */
export declare const surfaceRoundedStyles: import("lit").CSSResult;
/**
 * Luminous glow elevation — replaces M3 dark drop shadows with primary-colored glow.
 * No ::after tint overlay — depth comes from glow intensity, not surface tint.
 */
export declare const surfaceElevationStyles: import("lit").CSSResult;
/**
 * Surface clickable styles - luminous hover, spring active
 */
export declare const surfaceClickableStyles: import("lit").CSSResult;
/**
 * Combined surface styles - includes all surface styling capabilities
 */
export declare const surfaceStyles: import("lit").CSSResult;
