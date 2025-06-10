declare const SchmancyIcon_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-icon
 * Material Symbols icon component with configurable size
 */
export default class SchmancyIcon extends SchmancyIcon_base {
    /**
     * Icon size - can be specified in any CSS unit (px, rem, em, etc.)
     * Default is 24px
     */
    size: string;
    busy: boolean;
    connectedCallback(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-icon': SchmancyIcon;
    }
}
export {};
