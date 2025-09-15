import { LitElement } from 'lit';
declare const SchmancySuggestionChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Suggestion chip component - provides contextual recommendations to users
 *
 * IMPORTANT: Suggestion chips do NOT have a selected state. They are designed to
 * provide suggestions and recommendations that trigger actions when clicked.
 * Unlike filter chips, they cannot be toggled on/off.
 *
 * Pure Schmancy implementation with Tailwind CSS and RxJS state management
 */
export declare class SchmancySuggestionChip extends SchmancySuggestionChip_base {
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
    /** Elevated style variant */
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
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-suggestion-chip': SchmancySuggestionChip;
    }
}
export type SuggestionChipActionEvent = {
    value: string;
};
export {};
