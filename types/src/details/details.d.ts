import { LitElement } from 'lit';
declare const SchmancyDetails_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
    variant: 'default' | 'outlined' | 'filled' | 'elevated';
    private ripples;
    private pressed;
    private _isOpen;
    private nextRippleId;
    private _open$;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    private _handleToggle;
    private _handleClick;
    private _handleMouseDown;
    private _handleMouseUp;
    private _handleMouseLeave;
    private _handleKeyDown;
    private _handleKeyUp;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-details': SchmancyDetails;
    }
}
export {};
