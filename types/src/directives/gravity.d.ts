import { type ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface GravityOptions {
    /** Mass: 0.5 (light/bouncy) to 2.0 (heavy/damped). Default: 1.0 */
    mass?: number;
    /** Fall distance in pixels (default: 30) */
    distance?: number;
    /** Delay before falling in ms (default: 0) */
    delay?: number;
    /** Stagger delay per item for lists — multiply by index (default: 0) */
    stagger?: number;
}
/**
 * Gravity directive — elements fall into place and settle with mass-based bounce.
 *
 * Only animates ONCE on first render. Re-renders do not re-trigger.
 * Disconnecting and reconnecting re-triggers the animation.
 *
 * @example
 * ```html
 * <schmancy-card ${gravity()}>content</schmancy-card>
 *
 * ${repeat(items, item => item.id, (item, i) => html`
 *   <div ${gravity({ stagger: 50 * i, mass: 0.8 })}>...</div>
 * `)}
 * ```
 */
declare class GravityDirective extends AsyncDirective {
    private element;
    private animation?;
    private hasAnimated;
    private options?;
    render(_options?: GravityOptions): any;
    update(part: ElementPart, [options]: [GravityOptions?]): any;
    reconnected(): void;
    private animate;
    disconnected(): void;
}
export declare const gravity: (_options?: GravityOptions) => import("lit-html/directive").DirectiveResult<typeof GravityDirective>;
export {};
