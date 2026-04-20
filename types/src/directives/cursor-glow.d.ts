import { type ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface CursorGlowOptions {
    /** Glow radius in pixels (default: 200) */
    radius?: number;
    /** Glow color — CSS color value (default: primary color) */
    color?: string;
    /** Glow opacity 0-1 (default: 0.12) */
    intensity?: number;
}
/**
 * Cursor glow directive — a soft radial light follows the cursor across the surface.
 *
 * @example
 * ```html
 * <schmancy-surface type="glass" ${cursorGlow()}>content</schmancy-surface>
 * <div ${cursorGlow({ radius: 300, intensity: 0.2 })}>hero panel</div>
 * ```
 */
declare class CursorGlowDirective extends AsyncDirective {
    private element;
    private glowEl?;
    private readonly teardown$;
    private radius;
    private color;
    private intensity;
    private prevKey?;
    private didSetPosition;
    private cachedRect?;
    render(_options?: CursorGlowOptions): any;
    update(part: ElementPart, [options]: [CursorGlowOptions?]): any;
    reconnected(): void;
    private ensureGlowElement;
    private setupTracking;
    disconnected(): void;
}
export declare const cursorGlow: (_options?: CursorGlowOptions) => import("lit-html/directive").DirectiveResult<typeof CursorGlowDirective>;
export {};
