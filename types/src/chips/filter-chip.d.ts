import { LitElement } from 'lit';
declare const SchmancyFilterChip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Filter chip component for content filtering.
 *
 * Filter chips are the ONLY chip type that maintains persistent selected state.
 * They are used for filtering content by toggling on/off different filter criteria.
 *
 * @fires change - Dispatched when selection state changes with {value, selected}
 * @fires remove - Dispatched when remove button is clicked (if removable)
 *
 * @example
 * ```html
 * <schmancy-filter-chip value="category-1" selected>
 *   Category 1
 * </schmancy-filter-chip>
 * ```
 */
export declare class SchmancyFilterChip extends SchmancyFilterChip_base {
    /** Unique identifier for this filter chip */
    value: string;
    /** Whether the filter chip is selected (active filter) */
    private _selected;
    get selected(): boolean;
    set selected(value: boolean);
    /** Optional icon to display (Material Symbols name) */
    icon: string;
    /** Whether to show a remove button */
    removable: boolean;
    /** Whether the chip is disabled */
    disabled: boolean;
    /** Whether to use elevated style with shadow */
    elevated: boolean;
    private hover$;
    private pressed$;
    private focused$;
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
    connectedCallback(): void;
    private handleClick;
    private handleRemove;
    private handleKeyDown;
    private handleMouseEnter;
    private handleMouseLeave;
    private handleMouseDown;
    private handleMouseUp;
    private handleFocus;
    private handleBlur;
    protected render(): unknown;
}
export { SchmancyFilterChip as SchmancyChip };
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-chip': SchmancyFilterChip;
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
export type SchmancyChipChangeEvent = FilterChipChangeEvent;
