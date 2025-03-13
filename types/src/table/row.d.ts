import { TemplateResult } from 'lit';
import { TableColumn } from './table';
declare const SchmancyTableRow_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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
