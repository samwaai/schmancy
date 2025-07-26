import Layout from '../layout';
export declare class SchmancyGridV2 extends Layout {
    static styles: any[];
    /**
     * Display mode: 'grid' or 'inline-grid'.
     */
    display: 'grid' | 'inline-grid';
    /**
     * Grid template columns.
     * Examples: '1', '2', '3', 'none', 'subgrid', '[200px_minmax(900px,_1fr)_100px]'
     */
    columns: string;
    /**
     * Grid template rows.
     * Examples: '1', '2', '3', 'none', 'subgrid', '[200px_minmax(900px,_1fr)_100px]'
     */
    rows: string;
    /**
     * Grid auto flow.
     * Options: 'row', 'column', 'dense', 'row-dense', 'column-dense'
     */
    flow: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
    /**
     * Gap between grid items.
     * Examples: '0', '1', '2', '4', '8', '16', '32', '64'
     */
    gap: string;
    /**
     * Gap between columns.
     * Overrides the general gap if specified.
     */
    gapX?: string;
    /**
     * Gap between rows.
     * Overrides the general gap if specified.
     */
    gapY?: string;
    /**
     * Responsive variants.
     * Example: { sm: 'grid-cols-2', md: 'grid-cols-4' }
     */
    responsive: {
        [key: string]: string;
    };
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-grid': SchmancyGridV2;
    }
}
