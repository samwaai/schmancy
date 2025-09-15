import '@material/web/chips/suggestion-chip.js';
import { LitElement } from 'lit';
declare const SchmancySuggestionChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancySuggestionChip extends SchmancySuggestionChip_base {
    value: string;
    icon: string;
    href: string;
    target: string;
    disabled: boolean;
    constructor();
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static formAssociated: boolean;
    internals: ElementInternals | undefined;
    get form(): HTMLFormElement;
    private handleClick;
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
