import { Directive, Part, PartInfo } from 'lit/directive.js';
export type SchmancyDropEvent = CustomEvent<{
    source: string;
    destination: string;
}>;
export declare class DragDirective extends Directive {
    private element?;
    private id;
    private destroy$;
    constructor(partInfo: PartInfo);
    private handleDragStart;
    private handleDragEnd;
    update(part: Part, [id]: [string]): symbol;
    disconnected(): void;
    render(_id: string): symbol;
}
export declare const drag: (_id: string) => import("lit-html/directive").DirectiveResult<typeof DragDirective>;
export declare class DropDirective extends Directive {
    private element?;
    private destinationId;
    private destroy$;
    constructor(partInfo: PartInfo);
    private handleDragOver;
    private handleDragLeave;
    private handleDrop;
    update(part: Part, [destinationId]: [string]): symbol;
    disconnected(): void;
    render(_destinationId: string): symbol;
}
export declare const drop: (_destinationId: string) => import("lit-html/directive").DirectiveResult<typeof DropDirective>;
