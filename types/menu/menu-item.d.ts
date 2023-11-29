declare const SchmancyMenuItem_base: any;
export default class SchmancyMenuItem extends SchmancyMenuItem_base {
    connectedCallback(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu-item': SchmancyMenuItem;
    }
}
export {};
