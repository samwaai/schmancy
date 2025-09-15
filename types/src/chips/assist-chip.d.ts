import '@material/web/chips/assist-chip.js';
declare const SchmancyAssistChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Assist chip component - prompts user actions like opening calendar events or sharing content
 * Material Design 3 compliant assist chip wrapper
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
    protected static shadowRootOptions: any;
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
