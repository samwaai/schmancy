import Layout from '../layout';
/**
 * @deprecated Use Tailwind CSS flex classes directly instead of this component.
 * This component will be removed in a future version.
 *
 * Migration guide:
 * - Replace <sch-flex> with <div class="flex ...">
 * - Use Tailwind's flex utilities: flex-row, flex-col, gap-*, items-*, justify-*, etc.
 *
 * Original documentation:
 *
 * SchmancyFlex exposes a flex container with all the Tailwind CSS 4 options:
 *
 * - **Display**: By default uses `flex` but can be set to inline using the `inline` property.
 * - **Flow**: Accepts 'row', 'row-reverse', 'col', 'col-reverse' as well as grid‐like dense variants:
 *    - Dense variants (`row-dense`, `col-dense`) force wrapping.
 * - **Wrap**: 'wrap', 'nowrap', or 'wrap-reverse'
 * - **Align Items**: 'start', 'center', 'end', 'stretch', or 'baseline'
 * - **Justify Content**: 'start', 'center', 'end', 'between', 'around', or 'evenly'
 * - **Align Content** (for multi-line flex containers): 'start', 'center', 'end', 'between', 'around', or 'evenly'
 * - **Gap**: Supports Tailwind’s spacing scale (e.g. 'none', '0', '1', '2', …, '64')
 */
export declare class SchmancyFlexV2 extends Layout {
    static styles: any[];
    inline: boolean;
    /**
     * Flow property that determines the flex direction.
     * Allowed values:
     *  - Standard: 'row', 'row-reverse', 'col', 'col-reverse'
     *  - Dense variants: 'row-dense', 'col-dense' (dense implies wrapping)
     */
    flow: 'row' | 'row-reverse' | 'col' | 'col-reverse' | 'row-dense' | 'col-dense';
    /**
     * Flex-wrap options:
     *  - 'wrap', 'nowrap', or 'wrap-reverse'
     */
    wrap: 'wrap' | 'nowrap' | 'wrap-reverse';
    /**
     * Align-items (vertical alignment of flex items):
     *  - 'start', 'center', 'end', 'stretch', or 'baseline'
     */
    align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    /**
     * Justify-content (horizontal distribution):
     *  - 'start', 'center', 'end', 'between', 'around', or 'evenly'
     */
    justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /**
     * Align-content (spacing between rows when wrapping):
     *  - 'start', 'center', 'end', 'between', 'around', or 'evenly'
     */
    content?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /**
     * Gap between flex items.
     * Options (based on Tailwind CSS 4 spacing scale):
     *  - 'none', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '16', '20', '24', '32', '40', '48', '56', or '64'
     */
    gap: 'none' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64';
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-flex': SchmancyFlexV2;
    }
}
