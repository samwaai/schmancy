declare const SchmancyTypography_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
export declare class SchmancyTypography extends SchmancyTypography_base {
    /**
     * @attr type - The type of the typography.
     * @default 'body'
     * @type {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label'}
     */
    type: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label';
    /**
     * @attr token - The token of the typography.
     * @default 'md'
     * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
     */
    token: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * @attr
     * @default inherit
     * @type {'left' |'center' |'right'}
     */
    align: 'left' | 'center' | 'justify' | 'right' | undefined;
    /**
     * @attr
     * @default inherit
     * @type {'normal' | 'medium' |'bold'}
     * @public
     */
    weight: 'normal' | 'medium' | 'bold' | undefined;
    /**
     *
     * @attr
     * @default inherit
     * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
     * @public
     */
    transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' | undefined;
    maxLines: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typography': SchmancyTypography;
    }
}
export {};
