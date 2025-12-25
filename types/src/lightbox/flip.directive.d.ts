import { PartInfo, ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
export interface FlipOptions {
    disabled?: boolean;
    duration?: number;
    easing?: string;
    scale?: boolean;
}
declare class FlipDirective extends AsyncDirective {
    private element?;
    private lastRect?;
    private animation?;
    private options;
    constructor(partInfo: PartInfo);
    render(_options?: FlipOptions): symbol;
    update(part: ElementPart, [options]: [FlipOptions?]): symbol;
    private runFlip;
    disconnected(): void;
    reconnected(): void;
}
export declare const flip: (_options?: FlipOptions) => import("lit-html/directive").DirectiveResult<typeof FlipDirective>;
export {};
