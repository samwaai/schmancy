import { nothing } from 'lit';
import type { TSurfaceColor } from '@schmancy/types';
import '../surface/surface.js';
declare const SchmancyExpandRoot_base: import("@mixins/index").Constructor<import("@mixins/index").ISurfaceMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyExpandRoot extends SchmancyExpandRoot_base {
    type: TSurfaceColor;
    isOpen: boolean;
    private summaryRect;
    private _panelRef;
    private _backdropRef;
    private _btnRef;
    private _owner;
    private _hideIndicator;
    private _backdrop;
    /** Called by schmancy-expand before nodes are moved */
    prepare(rect: DOMRect, owner: Element, hideIndicator?: boolean, backdrop?: boolean): void;
    /** Called by schmancy-expand after nodes are moved in */
    triggerOpen(): Promise<void>;
    /** Animate close, return Promise resolving when done */
    triggerClose(targetRect: DOMRect): Promise<void>;
    private _animateOpen;
    private _animateClose;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-expand-root': SchmancyExpandRoot;
    }
}
export {};
