import { LitElement } from 'lit';
declare const SchmancyAssistChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Assist chip component - prompts user actions like opening calendar events or sharing content
 * Pure Schmancy implementation with Tailwind CSS and RxJS state management
 */
export declare class SchmancyAssistChip extends SchmancyAssistChip_base {
    /** Value identifier for the chip */
    value: string;
    /** Optional icon name (Material Symbols) */
    icon: string;
    /** Optional href for navigation */
    href: string;
    /** Target for navigation (e.g., '_blank') */
    target: string;
    /** Disable the chip */
    disabled: boolean;
    /** Elevated style variant - true by default per M3 spec for assist chips */
    elevated: boolean;
    private hover$;
    private pressed$;
    private focused$;
    private ripples;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private nextRippleId;
    connectedCallback(): void;
    private handleClick;
    private handleKeyDown;
    private handleFocus;
    private handleBlur;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-assist-chip': SchmancyAssistChip;
    }
}
export type AssistChipActionEvent = {
    value: string;
};
export {};
