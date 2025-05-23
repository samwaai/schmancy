import Layout from '../layout';
export declare class SchmancyGrid extends Layout {
    static styles: any[];
    layout: boolean;
    flow: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
    align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify: 'start' | 'center' | 'end' | 'stretch';
    content: 'start' | 'center' | 'end' | 'stretch' | 'around' | 'evenly' | 'between';
    gap: 'none' | 'xs' | 'sm' | 'md' | 'lg';
    cols?: string;
    rows?: string;
    rcols?: {
        xs?: string | number;
        sm?: string | number;
        md?: string | number;
        lg?: string | number;
        xl?: string | number;
        '2xl'?: string | number;
    };
    wrap: boolean;
    assignedElements: HTMLElement[];
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-grid': SchmancyGrid;
    }
}
