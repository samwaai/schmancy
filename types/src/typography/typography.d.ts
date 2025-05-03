declare const SchmancyTypography_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
export declare class SchmancyTypography extends SchmancyTypography_base {
    /**
     * @attr type - The type of the typography.
     * @default inherit
     * @type {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label'}
     */
    type: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label';
    /**
     * @attr token - The token of the typography.
     * @default 'md'
     * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
     */
    token: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
    lineHeight: string | undefined;
    /**
     *
     * @attr
     * @default inherit
     * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
     * @public
     */
    transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' | undefined;
    maxLines: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
    letterSpacing: string | undefined;
    fontSize: string | undefined;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typography': SchmancyTypography;
    }
}
export {};
