import Layout from '../layout';
/**
 * @deprecated Use Tailwind CSS flex classes directly instead of this component.
 * This component will be removed in a future version.
 *
 * Migration guide:
 * - Replace <schmancy-flex> with <div class="flex ...">
 * - Use Tailwind's flex utilities: flex-row, flex-col, gap-*, items-*, justify-*, etc.
 *
 * @element schmancy-flex
 */
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
