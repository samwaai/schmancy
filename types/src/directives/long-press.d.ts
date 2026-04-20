import { Directive, ElementPart, PartInfo } from 'lit/directive.js';
export interface LongPressOptions {
    /** Duration in milliseconds before long-press triggers (default: 500) */
    duration?: number;
    /** Movement threshold in pixels that cancels the long-press (default: 10) */
    movementThreshold?: number;
}
declare class LongPressDirective extends Directive {
    constructor(partInfo: PartInfo);
    render(_callback: () => void, _options?: LongPressOptions): any;
    update(part: ElementPart, [callback, options]: [() => void, LongPressOptions?]): any;
    private optionsEqual;
    private setupLongPress;
    disconnected(part: ElementPart): void;
    reconnected(part: ElementPart): void;
}
/**
 * Long-press gesture directive for Lit components.
 *
 * Detects long-press (press-and-hold) gestures with movement cancellation.
 * Works with both touch and mouse events via PointerEvents API.
 *
 * @param callback - Function to call when long-press is detected
 * @param options - Optional configuration
 * @param options.duration - Time in ms before trigger (default: 500)
 * @param options.movementThreshold - Max movement in px before cancel (default: 10)
 *
 * @example
 * ```typescript
 * // Basic usage
 * html`<div ${longPress(() => this.showDialog())}></div>`
 *
 * // With custom options
 * html`<div ${longPress(() => this.showMenu(), { duration: 800, movementThreshold: 15 })}></div>`
 * ```
 */
export declare const longPress: (_callback: () => void, _options?: LongPressOptions) => import("lit-html/directive").DirectiveResult<typeof LongPressDirective>;
export {};
