import { TemplateResult } from 'lit';
import './row';
export interface TableColumn<T extends Record<string, any> = any> {
    name: string;
    key?: keyof T;
    align?: 'left' | 'right' | 'center';
    weight?: 'normal' | 'bold';
    render?: (item: T) => TemplateResult | string | number;
}
export interface RowEventDetail<T> {
    item: T;
    index: number;
}
declare const SchmancyDataTable_base: CustomElementConstructor & import("@mhmo91/schmancy/dist/mixins").Constructor<import("lit").LitElement> & import("@mhmo91/schmancy/dist/mixins").Constructor<import("@mhmo91/schmancy/dist/mixins").IBaseMixin>;
export declare class SchmancyDataTable<T extends Record<string, any> = any> extends SchmancyDataTable_base {
    columns: TableColumn<T>[];
    data: T[];
    keyField: keyof T;
    cols: string;
    actions: Array<{
        name: string;
        action: (item: T) => void;
    }>;
    private handleRowEvent;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table-v2': SchmancyDataTable;
    }
}
export {};
