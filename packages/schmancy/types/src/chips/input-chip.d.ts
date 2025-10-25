import { LitElement } from 'lit';
declare const SchmancyInputChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Input chip component - represents user-provided information that can be removed.
 *
 * IMPORTANT: Per Material Design 3 specification, input chips do NOT have selected state.
 * They represent discrete pieces of user input (like entered tags, selections from lists, etc.)
 * that can only be removed, not toggled on/off.
 *
 * Use cases:
 * - Displaying selected recipients in an email
 * - Showing applied filters that can be removed
 * - Tags or keywords entered by the user
 * - Selected items from a multi-select dropdown
 *
 * @fires click - Optional click event on chip body (value)
 * @fires remove - Dispatched when remove button is clicked (value)
 *
 * @example
 * ```html
 * <schmancy-input-chip value="john@example.com" avatar="/avatars/john.jpg">
 *   John Doe
 * </schmancy-input-chip>
 * ```
 */
export declare class SchmancyInputChip extends SchmancyInputChip_base {
    /** Value identifier for the chip */
    value: string;
    /** Optional icon name (Material Symbols) */
    icon: string;
    /** Optional avatar image URL */
    avatar: string;
    /** Whether to show remove button (default true for input chips) */
    removable: boolean;
    /** Disable the chip */
    disabled: boolean;
    /** Elevated style variant */
    elevated: boolean;
    private chipHover$;
    private removeHover$;
    private focused$;
    private pressed$;
    uiState: {
        chipHover: boolean;
        removeHover: boolean;
        focused: boolean;
        pressed: boolean;
    };
    private ripples;
    private nextRippleId;
    constructor();
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static formAssociated: boolean;
    internals: ElementInternals | undefined;
    get form(): HTMLFormElement;
    connectedCallback(): void;
    private handleChipClick;
    private handleRemove;
    private handleKeyDown;
    private handleFocus;
    private handleBlur;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-input-chip': SchmancyInputChip;
    }
}
export type InputChipClickEvent = {
    value: string;
};
export type InputChipRemoveEvent = {
    value: string;
};
export {};
