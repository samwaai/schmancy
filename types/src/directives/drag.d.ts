import { Directive, type ElementPart, type PartInfo } from 'lit/directive.js';
export type SchmancyDropEvent = CustomEvent<{
    source: string;
    destination: string;
    /** Where the item was dropped relative to the destination: above or below its midpoint */
    position?: 'before' | 'after';
}>;
export declare class DragDirective extends Directive {
    private element?;
    private id;
    private registeredId?;
    private destroy$;
    constructor(partInfo: PartInfo);
    update(part: ElementPart, [id]: [string]): symbol;
    disconnected(): void;
    reconnected(): void;
    render(_id: string): symbol;
}
export declare const drag: (_id: string) => import("lit-html/directive").DirectiveResult<typeof DragDirective>;
export declare class DropDirective extends Directive {
    private element?;
    private destinationId;
    private destroy$;
    constructor(partInfo: PartInfo);
    update(part: ElementPart, [destinationId]: [string]): symbol;
    disconnected(): void;
    reconnected(): void;
    render(_destinationId: string): symbol;
}
export declare const drop: (_destinationId: string) => import("lit-html/directive").DirectiveResult<typeof DropDirective>;
