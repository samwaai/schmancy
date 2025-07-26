import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import { ChipSet } from '@material/web/chips/internal/chip-set';
import { PropertyValues } from 'lit';
import SchmancyChip, { SchmancyChipChangeEvent } from './chip';
declare const SchmancyChips_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyChips extends SchmancyChips_base {
    chipSet: ChipSet;
    multi: boolean;
    values: string[];
    value: string;
    chips: SchmancyChip[];
    wrap: boolean;
    change(e: CustomEvent<SchmancyChipChangeEvent>): Promise<void>;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    attributeChangedCallback(name: string, old: string, value: string): void;
    hydrateTabs(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-chips': SchmancyChips;
    }
}
export type SchmancyChipsChangeEvent = string | Array<string>;
export {};
