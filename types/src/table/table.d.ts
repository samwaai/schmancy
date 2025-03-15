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
}
export interface RowEventDetail<T> {
    item: T;
    index: number;
}
export type SortDirection = 'asc' | 'desc' | null;
declare const SchmancyDataTable_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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
    private processData;
    private toggleSort;
    private renderSortIndicator;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table-v2': SchmancyDataTable;
    }
}
export {};
