declare const SchmancyTypography_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
export declare class SchmancyTypography extends SchmancyTypography_base {
    /**
     * @attr type - The type of the typography.
     * @default inherit
     * @type {'display' | 'headline' | 'title' | 'body' | 'label'}
     */
    type: 'display' | 'headline' | 'title' | 'body' | 'label';
    /**
     * @attr token - The token of the typography.
     * @default 'md'
     * @type {'sm' |'md' |'lg'}
     */
    token: 'sm' | 'md' | 'lg';
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
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typography': SchmancyTypography;
    }
}
export {};
