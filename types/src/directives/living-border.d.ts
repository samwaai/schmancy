import { type ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface LivingBorderOptions {
    /** Animation duration in ms (default: 3000) */
    duration?: number;
    /** Border width in pixels (default: 1) */
    width?: number;
    /** Glow color (default: primary) */
    color?: string;
    /** Glow spread in pixels (default: 6) */
    spread?: number;
    /** Only animate on hover (default: false) */
    onHover?: boolean;
}
/**
 * Living border directive — a gradient light traces the element's edges.
 *
 * @example
 * ```html
 * <schmancy-card ${livingBorder()}>content</schmancy-card>
 * <div ${livingBorder({ duration: 4000, onHover: true })}>panel</div>
 * ```
 */
declare class LivingBorderDirective extends AsyncDirective {
    private element;
    private borderEl?;
    private readonly teardown$;
    private prevKey?;
    private didSetPosition;
    private lastOptions?;
    render(_options?: LivingBorderOptions): any;
    update(part: ElementPart, [options]: [LivingBorderOptions?]): any;
    reconnected(): void;
    private createBorderOverlay;
    private cleanup;
    disconnected(): void;
}
export declare const livingBorder: (_options?: LivingBorderOptions) => import("lit-html/directive").DirectiveResult<typeof LivingBorderDirective>;
export {};
