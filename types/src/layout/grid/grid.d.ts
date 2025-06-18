import Layout from '../layout';
/**
 * @deprecated Use Tailwind CSS grid classes directly instead of this component.
 * This component will be removed in a future version.
 *
 * Migration guide:
 * - Replace <schmancy-grid> with <div class="grid ...">
 * - Use Tailwind's grid utilities: grid-cols-*, gap-*, items-*, justify-items-*, etc.
 *
 * @element schmancy-grid
 */
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
