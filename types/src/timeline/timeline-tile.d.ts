export type TimelineTileState = 'empty' | 'filled' | 'stack-top' | 'stack-sibling';
export type TimelineTileClickEvent = CustomEvent<{
    glyph: string;
    state: TimelineTileState;
}>;
declare const SchmancyTimelineTile_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyTimelineTile extends SchmancyTimelineTile_base {
    state: TimelineTileState;
    glyph: string;
    stackCount?: number;
    index?: number;
    tooltip?: string;
    caption?: string;
    connectedCallback(): void;
    protected updated(changed: Map<string, unknown>): void;
    private _onClick;
    private _ariaLabel;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-timeline-tile': SchmancyTimelineTile;
    }
}
export {};
