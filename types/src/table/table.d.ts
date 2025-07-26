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
declare const SchmancyDataTable_base: CustomElementConstructor & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * SchmancyDataTable is a generic data table component.
 * It supports sorting, filtering, and custom rendering of rows.
 *
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
