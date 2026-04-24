import { LitElement } from 'lit';
declare const SchmancyDetails_base: import("@mixins/index").Constructor<import("@mixins/index").ISurfaceMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Expandable disclosure panel — a styled `<details>` / `<summary>` pair with animated expand + overlay options.
 *
 * @element schmancy-details
 * @summary Use for progressive-disclosure content: FAQs, collapsible settings sections, accordion-style lists. Prefer schmancy-expand for full-page accordions where only one section can be open at a time.
 * @example
 * <schmancy-details summary="Shipping details">
 *   <p>Order ships in 2 business days.</p>
 * </schmancy-details>
 * @platform details toggle - Wraps native `<details>`/`<summary>`. Degrades to the native element if the tag never registers — same keyboard accessibility, just no animation.
 * @fires toggle - When the open state changes (bubbles from the native `<details>`).
 */
export default class SchmancyDetails extends SchmancyDetails_base {
    protected static shadowRootOptions: {
        mode: "open";
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    summary: string;
    get open(): boolean;
    set open(value: boolean);
    indicatorPlacement: 'start' | 'end';
    hideIndicator: boolean;
    indicatorRotate: number;
    locked: boolean;
    overlay: boolean;
    summaryPadding: string;
    contentPadding: string;
    private _open$;
    private _indicatorRef;
    private _contentRef;
    private _currentAnimation?;
    private _indicatorIsOpen;
    private _closing;
    private _closeSub?;
    /** True when browser handles close animation natively via ::details-content */
    private _nativeAnim;
    /**
     * Lazy rendering: tracks if content has ever been opened.
     * Once true, content stays rendered (even when closed) for smooth animations.
     */
    private _hasOpened;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    private _handleSummaryClick;
    private _handleToggle;
    /**
     * Fallback close: trigger CSS grid+opacity transition, then close native <details>.
     * The CSS transition (400ms) handles the visual collapse — no WAAPI needed.
     */
    private _startClose;
    private _handleIndicatorSlotChange;
    private _updateIndicatorSlot;
    /** Idempotent indicator rotation — skips if already at target state */
    private _animateIndicator;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-details': SchmancyDetails;
    }
}
export {};
