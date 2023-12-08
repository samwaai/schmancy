declare const SchmancyTypography_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
export declare class SchmancyTypography extends SchmancyTypography_base {
    /**
     * @attr {primary |secondary |success |error |warning } color - The color of the typography.
     */
    color: 'primary' | 'primary-muted' | 'secondary' | 'success' | 'error' | 'warning' | 'white' | null;
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
     * @type {'normal' |'bold'}
     * @public
     */
    weight: 'normal' | 'bold';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typography': SchmancyTypography;
    }
}
export {};
