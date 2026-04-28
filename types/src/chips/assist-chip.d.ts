import { LitElement } from 'lit';
declare const SchmancyAssistChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Assist chip — single-tap trigger for a contextual action (open calendar event, share content, jump to related view). Distinct from filter and input chips: assist chips have no selected state; clicking fires `action`.
 *
 * @element schmancy-assist-chip
 * @summary Use for "do this thing" suggestions surfaced in context (next to a date, after a recipient list, near a long description). Pair with schmancy-icon for the leading glyph.
 * @example
 * <schmancy-assist-chip @action=${(e) => share(e.detail.value)}>
 *   <schmancy-icon slot="icon">share</schmancy-icon>
 *   Share
 * </schmancy-assist-chip>
 * @platform button click - Material 3 assist-chip semantics. Degrades to a plain `<button>` if the tag never registers.
 * @fires action - When the chip is clicked or activated via keyboard. `detail.value` echoes the chip's `value` attribute.
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
