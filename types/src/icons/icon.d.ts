declare const SchmancyIcon_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-icon

 */
export default class SchmancyIcon extends SchmancyIcon_base {
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
