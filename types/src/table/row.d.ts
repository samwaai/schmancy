import { TemplateResult } from 'lit';
import { TableColumn } from './table';
declare const SchmancyTableRow_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyTableRow<T extends Record<string, any> = any> extends SchmancyTableRow_base {
    columns: TableColumn<T>[];
    item: T;
    cols: string;
    /**
     * Renders a cell based on column configuration.
     * Uses custom render function if provided, otherwise extracts data from item.
     */
    private renderCell;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table-row': SchmancyTableRow;
    }
}
export {};
