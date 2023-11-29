declare const SchmancyPaper_base: any;
export default class SchmancyPaper extends SchmancyPaper_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-paper': SchmancyPaper;
    }
}
export {};
