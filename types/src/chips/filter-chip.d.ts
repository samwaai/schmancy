import '@material/web/chips/filter-chip.js';
import { LitElement } from 'lit';
declare const SchmancyFilterChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyFilterChip extends SchmancyFilterChip_base {
    value: string;
    selected: boolean;
    icon: string;
    removable: boolean;
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
    private handleRemove;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-filter-chip': SchmancyFilterChip;
    }
}
export type FilterChipChangeEvent = {
    value: string;
    selected: boolean;
};
export type FilterChipRemoveEvent = {
    value: string;
};
export {};
