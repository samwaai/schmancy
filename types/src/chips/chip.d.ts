import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import { LitElement } from 'lit';
declare const SchmancyChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export default class SchmancyChip extends SchmancyChip_base {
    value: string;
    selected: boolean;
    icon: string;
    readOnly: boolean;
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
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-chip': SchmancyChip;
    }
}
export type SchmancyChipChangeEvent = {
    value: string;
    selected: boolean;
};
export {};
