/** Dispatch this event on window to close whichever schmancy-expand is currently open */
export declare const SCHMANCY_EXPAND_REQUEST_CLOSE = "schmancy-expand-request-close";
declare const SchmancyExpand_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Accordion-style section — expands on click, coordinates with siblings via schmancy-expand-root to close any sibling when a new one opens. Only one schmancy-expand can be open at a time within the same root.
 *
 * @element schmancy-expand
 * @summary Use for grouped progressive-disclosure where only one section should be open at a time. Prefer schmancy-details when sections should be independent.
 * @example
 * <schmancy-expand-root>
 *   <schmancy-expand summary="Billing">Billing form…</schmancy-expand>
 *   <schmancy-expand summary="Shipping">Shipping form…</schmancy-expand>
 *   <schmancy-expand summary="Review">Order review…</schmancy-expand>
 * </schmancy-expand-root>
 * @platform details toggle - Schmancy-skinned accordion section. Degrades to `<details>` if the tag never registers — loses mutual-exclusion behavior but stays functional.
 * @fires toggle - When the open state changes.
 */
export default class SchmancyExpand extends SchmancyExpand_base {
    summary: string;
    open: boolean;
    summaryPadding: string;
    contentPadding: string;
    hideIndicator: boolean;
    indicatorRotate: number;
    backdrop: boolean;
    inline: boolean;
    private _summaryRef;
    private _contentSlotRef;
    private _root;
    private _movedNodes;
    private _currentIndicatorAnim;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _getOrCreateRoot;
    /** Close the expand portal, animating back to the summary position. */
    close(): void;
    /** Programmatically open the expand portal. */
    expand(): void;
    protected updated(changed: Map<PropertyKey, unknown>): void;
    private _toggle;
    private _handleSummaryClick;
    private _expand;
    _handleClose(): Promise<void>;
    private _animateIndicator;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-expand': SchmancyExpand;
    }
}
export {};
