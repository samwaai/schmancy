import Layout from '../layout/layout';
export declare class SchmancyFlex extends Layout {
    static styles: any[];
    layout: boolean;
    /**
     * The flex direction property:
     *  - "row" | "row-reverse" | "col" | "col-reverse"
     */
    flow: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    /**
     * The flex-wrap property:
     *  - "wrap" | "nowrap" | "wrap-reverse"
     */
    wrap: 'wrap' | 'nowrap' | 'wrap-reverse';
    /**
     * Align-items property:
     *  - "start" (flex-start), "center", "end" (flex-end), "stretch", "baseline"
     */
    align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    /**
     * Justify-content property:
     *  - "start", "center", "end", "between"
     *  (Note: "stretch" doesn't exist as a Tailwind justify- class;
     *  for horizontal stretching, you typically rely on width or gap.)
     */
    justify: 'start' | 'center' | 'end' | 'between';
    /**
     * Gap sizes:
     *  - "none" (0), "sm" (2), "md" (4), "lg" (8)
     *  (Feel free to add more if your Tailwind config has them.)
     */
    gap: 'none' | 'sm' | 'md' | 'lg';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-flex': SchmancyFlex;
    }
}
