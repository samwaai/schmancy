declare const SchmancyTab_base: any;
export default class SchmancyTab extends SchmancyTab_base {
    label: any;
    active: boolean;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tab': SchmancyTab;
    }
}
export {};
