import '@lit-labs/virtualizer';
import { TemplateResult } from 'lit';
import './row';
export interface TableColumn<T extends Record<string, any> = any> {
    name: string;
    key?: keyof T;
    align?: 'left' | 'right' | 'center';
    weight?: 'normal' | 'bold';
    render?: (item: T) => TemplateResult | string | number;
    sortable?: boolean;
    value?: (item: T) => any;
}
export interface RowEventDetail<T> {
    item: T;
    index: number;
}
export type SortDirection = 'asc' | 'desc' | null;
declare const SchmancyDataTable_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Generic data table — typed columns, optional sort, custom renderers per column. Pass `data` (array) and `columns` (TableColumn descriptors).
 *
 * @element schmancy-table
 * @summary Use for tabular data where each column has a known shape. Pair with `<schmancy-table-row>` for the per-row interaction surface. Sort by setting `sortable: true` on a column descriptor; the table emits `sort-change` so the parent can re-fetch / re-sort in the data layer if needed.
 * @example
 * <schmancy-table .data=${rows} .columns=${[{ name: 'Name', key: 'name' }, { name: 'Status', key: 'status' }]}></schmancy-table>
 * @platform table - Renders an accessible table with `<lit-virtualizer>` for large datasets. Degrades to a styled `<table>` if the tag never registers.
 * @fires click - When a data row is activated. `detail.item` is the row's source object, `detail.index` is the position in the data array.
 * @fires sort-change - When the user toggles a column sort. `detail.column` is the column key, `detail.direction` is `'asc' | 'desc' | null`.
 */
export declare class SchmancyDataTable<T extends Record<string, any> = any> extends SchmancyDataTable_base {
    columns: TableColumn<T>[];
    data: T[];
    keyField: keyof T;
    cols: string;
    sortable: boolean;
    private sortColumn;
    private sortDirection;
    private filteredData;
    constructor();
    protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void;
    /**
     * Helper function to check if a value is a Date object in a type-safe way
     */
    private isDate;
    private processData;
    private toggleSort;
    private renderSortIndicator;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table': SchmancyDataTable;
    }
}
export {};
