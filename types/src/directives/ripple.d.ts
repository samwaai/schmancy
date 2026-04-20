import { type ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
/**
 * Ripple directive — Material-style ink ripple on click.
 *
 * @example
 * ```html
 * <div ${ripple()}>Click me</div>
 * ```
 */
declare class RippleDirective extends AsyncDirective {
    private element;
    private readonly teardown$;
    render(): any;
    update(part: ElementPart): any;
    reconnected(): void;
    private addRipple;
    disconnected(): void;
}
export declare const ripple: () => import("lit-html/directive").DirectiveResult<typeof RippleDirective>;
export {};
