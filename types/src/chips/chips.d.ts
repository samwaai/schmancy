import { PropertyValues } from 'lit';
import type { FilterChipChangeEvent as SchmancyChipChangeEvent } from './filter-chip';
import { SchmancyFilterChip as SchmancyChip } from './filter-chip';
declare const SchmancyChips_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyChips extends SchmancyChips_base {
    private value$;
    private values$;
    private _value;
    private _values;
    private _multi;
    /**
     * @deprecated Use .values for multi-selection or .value for single-selection instead.
     * The mode is now automatically determined based on which property is used.
     */
    get multi(): boolean;
    set multi(value: boolean);
    private get mode();
    get values(): string[];
    set values(value: string[]);
    get value(): string;
    set value(value: string);
    chips: (SchmancyChip | HTMLElement)[];
    wrap: boolean;
    connectedCallback(): void;
    private updateChipStates;
    change(e: CustomEvent<SchmancyChipChangeEvent>): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-chips': SchmancyChips;
    }
}
export type SchmancyChipsChangeEvent = string | Array<string>;
export {};
