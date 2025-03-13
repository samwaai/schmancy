import { TemplateResult } from 'lit';
import { TableColumn } from './table';
declare const SchmancyTableRow_base: CustomElementConstructor & import("@mhmo91/schmancy/dist/mixins").Constructor<import("lit").LitElement> & import("@mhmo91/schmancy/dist/mixins").Constructor<import("@mhmo91/schmancy/dist/mixins").IBaseMixin>;
export declare class SchmancyTableRow extends SchmancyTableRow_base {
    columns: TableColumn[];
    item: any;
    cols: string;
    actions: Array<{
        name: string;
        action: (item: any) => void;
    }> | undefined;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table-row': SchmancyTableRow;
    }
}
export {};
