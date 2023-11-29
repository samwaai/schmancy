declare const SchmancyTable_base: any;
export default class SchmancyTable extends SchmancyTable_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table': SchmancyTable;
    }
}
export {};
