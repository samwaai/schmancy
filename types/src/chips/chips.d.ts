import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import { ChipSet } from '@material/web/chips/internal/chip-set';
import { PropertyValues } from 'lit';
import SchmancyChip, { SchmancyChipChangeEvent } from './chip';
declare const SchmancyChips_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SchmancyChips extends SchmancyChips_base {
    chipSet: ChipSet;
    multi: boolean;
    values: string[];
    value: string;
    chips: SchmancyChip[];
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
