declare const SchmancyTypography_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
export declare class SchmancyTypography extends SchmancyTypography_base {
    /**
     * @attr {display | headline | title | body | label } type - The type of the typography.
     */
    type: 'display' | 'headline' | 'title' | 'body' | 'label';
    /**
     * @attr token - The token of the typography.
     * @default md
     * @type {'sm' |'md' |'lg'}
     */
    token: 'sm' | 'md' | 'lg';
    /**
     * @attr
     * @default left
     * @type {'left' |'center' |'right'}
     */
    align: 'left' | 'center' | 'justify' | 'right';
    /**
     * @attr
     * @default normal
     * @type {'normal' | 'medium' |'bold'}
     * @public
     */
    weight: 'normal' | 'medium' | 'bold';
    /**
     *
     * @attr
     * @default normal
     * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
     * @public
     */
    transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typography': SchmancyTypography;
    }
}
export {};
