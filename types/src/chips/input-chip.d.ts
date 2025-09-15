import '@material/web/chips/input-chip.js';
import { LitElement } from 'lit';
declare const SchmancyInputChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyInputChip extends SchmancyInputChip_base {
    value: string;
    icon: string;
    avatar: string;
    removable: boolean;
    selected: boolean;
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
        'schmancy-input-chip': SchmancyInputChip;
    }
}
export type InputChipChangeEvent = {
    value: string;
    selected: boolean;
};
export type InputChipRemoveEvent = {
    value: string;
};
export {};
