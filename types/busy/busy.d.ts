declare const SchmancyBusy_base: any;
export default class SchmancyBusy extends SchmancyBusy_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-busy': SchmancyBusy;
    }
}
export {};
