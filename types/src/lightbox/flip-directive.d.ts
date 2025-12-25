import { PartInfo, ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface FlipOptions {
    /** Source element to animate from (uses element's bounding rect) */
    sourceElement?: HTMLElement;
    /** Click position - can be MouseEvent, TouchEvent, or {x, y} coordinates */
    position?: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent;
    /** Animation duration in ms (total for both stages) */
    duration?: number;
    /** CSS easing function */
    easing?: string;
    /** Whether to animate scale (default: true) */
    scale?: boolean;
    /** Enable blackbird two-stage arc animation (default: true) */
    blackbird?: boolean;
}
declare class FlipDirective extends AsyncDirective {
    private element?;
    private hasAnimated;
    constructor(partInfo: PartInfo);
    render(_options?: FlipOptions): symbol;
    update(part: ElementPart, [options]: [FlipOptions?]): symbol;
    private animateIn;
}
export declare const flip: (_options?: FlipOptions) => import("lit-html/directive").DirectiveResult<typeof FlipDirective>;
export {};
