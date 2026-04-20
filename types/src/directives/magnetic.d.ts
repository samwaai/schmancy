import { type ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface MagneticOptions {
    /** Max displacement in pixels (default: 4) */
    strength?: number;
    /** Activation radius in pixels (default: 100) */
    radius?: number;
}
/**
 * Magnetic directive — elements lean toward the cursor with spring physics.
 *
 * Uses `style.translate` (CSS individual transform) so it composes
 * with existing transforms on the element.
 *
 * @example
 * ```html
 * <schmancy-button ${magnetic()}>Submit</schmancy-button>
 * <schmancy-icon-button ${magnetic({ strength: 6, radius: 120 })}>add</schmancy-icon-button>
 * ```
 */
declare class MagneticDirective extends AsyncDirective {
    private element;
    private readonly teardown$;
    private strength;
    private radius;
    private prevKey?;
    private cachedRect?;
    render(_options?: MagneticOptions): any;
    update(part: ElementPart, [options]: [MagneticOptions?]): any;
    reconnected(): void;
    private setupMagnetic;
    disconnected(): void;
}
export declare const magnetic: (_options?: MagneticOptions) => import("lit-html/directive").DirectiveResult<typeof MagneticDirective>;
export {};
