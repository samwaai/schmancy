declare const SchmancyIcon_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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
