import Layout from '../layout';
export declare class SchmancyFlex extends Layout {
    static styles: any[];
    layout: boolean;
    flow: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    wrap: 'wrap' | 'nowrap' | 'wrap-reverse';
    align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify: 'start' | 'center' | 'end' | 'stretch' | 'between';
    gap: 'none' | 'sm' | 'md' | 'lg';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-flex': SchmancyFlex;
    }
}
