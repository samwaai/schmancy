import { PartInfo, ElementPart } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { TemplateResult } from 'lit';
export interface LightboxOptions {
    images?: string[];
    index?: number;
    overlay?: TemplateResult;
}
declare class LightboxDirective extends AsyncDirective {
    private element?;
    private clickHandler?;
    private keyHandler?;
    private overlayElement?;
    private currentIndex;
    private images;
    private overlay?;
    private clickPosition?;
    constructor(partInfo: PartInfo);
    render(_options?: LightboxOptions): symbol;
    update(part: ElementPart, [options]: [LightboxOptions?]): symbol;
    private open;
    private close;
    private prev;
    private next;
    private updateImage;
    private renderLightbox;
    disconnected(): void;
}
export declare const lightbox: (_options?: LightboxOptions) => import("lit-html/directive.js").DirectiveResult<typeof LightboxDirective>;
export {};
