import { LitElement } from 'lit';
declare const SchmancySuggestionChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Suggestion chip — single-tap insertion of a recommended value. Distinct from filter chips (no selected state) and assist chips (assist triggers an action; suggestion offers a value the user can pick).
 *
 * @element schmancy-suggestion-chip
 * @summary Use for "would you also like to…" prompts above a search input or below a message thread. Click fires `action` with the chip's `value` so the parent can insert it into a field or trigger a search.
 * @example
 * <schmancy-suggestion-chip value="yesterday" @action=${(e) => setRange(e.detail.value)}>
 *   Yesterday
 * </schmancy-suggestion-chip>
 * @platform button click - Material 3 suggestion-chip semantics. Degrades to a plain `<button>` if the tag never registers.
 * @fires action - When the chip is clicked or activated via keyboard. `detail.value` echoes the chip's `value` attribute.
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
    /** Elevated style variant - flat by default per M3 spec */
    elevated: boolean;
    private hover$;
    private pressed$;
    private focused$;
    private ripples;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
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
