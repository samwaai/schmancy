import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import { LitElement } from 'lit';
declare const SchmancyChip_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyChip extends SchmancyChip_base {
    label: string;
    value: string;
    selected: boolean;
    icon: string;
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
