import { type ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface DepthOfFieldOptions {
    /** When true, blur is applied. When false, blur is removed. */
    active: boolean;
    /** Max blur radius in pixels (default: 8) */
    maxBlur?: number;
    /** Duration of blur transition in ms (default: 400) */
    duration?: number;
}
/**
 * Depth-of-field directive — progressive blur on background content.
 *
 * Reactive: responds to `active` changing. Uses `style.scale` instead of
 * `style.transform` to avoid conflicts with other directives.
 *
 * @example
 * ```html
 * <main ${depthOfField({ active: this.dialogOpen, maxBlur: 8 })}>
 *   page content
 * </main>
 * ```
 */
declare class DepthOfFieldDirective extends AsyncDirective {
    private element;
    private maxBlur;
    private duration;
    private isBlurred;
    private transitionSet;
    render(_options: DepthOfFieldOptions): any;
    update(part: ElementPart, [options]: [DepthOfFieldOptions]): any;
    private applyBlur;
    private clearBlur;
    disconnected(): void;
    reconnected(): void;
}
export declare const depthOfField: (_options: DepthOfFieldOptions) => import("lit-html/directive").DirectiveResult<typeof DepthOfFieldDirective>;
export {};
