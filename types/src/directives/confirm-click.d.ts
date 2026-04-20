import { Directive, ElementPart, PartInfo } from 'lit/directive.js';
export interface ConfirmClickOptions {
    /** Auto-reset timeout in ms (default: 3000) */
    timeout?: number;
    /** Override icon for confirmation state (default: inherits from host element) */
    icon?: string;
}
declare class ConfirmClickDirective extends Directive {
    constructor(partInfo: PartInfo);
    render(_callback: () => void, _options?: ConfirmClickOptions): any;
    update(part: ElementPart, [callback, options]: [() => void, ConfirmClickOptions?]): any;
    private optionsEqual;
    private setupClickListener;
    private showOverlay;
    private hideOverlay;
    private cleanup;
    disconnected(part: ElementPart): void;
    reconnected(part: ElementPart): void;
}
/**
 * Two-stage click confirmation directive with animated canvas countdown.
 *
 * First click shows an in-place overlay with a depleting ring that
 * visually communicates the confirmation window. Second click confirms.
 * Auto-resets when the ring empties, or on outside click / Escape.
 *
 * @param callback - Function to call on confirmed second click
 * @param options - Optional configuration
 * @param options.timeout - Countdown duration in ms (default: 3000)
 * @param options.icon - Override icon (default: inherits from host element)
 *
 * @example
 * ```typescript
 * html`<schmancy-icon-button ${confirmClick(() => this.deleteItem(item))}>delete</schmancy-icon-button>`
 * ```
 */
export declare const confirmClick: (_callback: () => void, _options?: ConfirmClickOptions) => import("lit-html/directive").DirectiveResult<typeof ConfirmClickDirective>;
export {};
