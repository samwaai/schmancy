declare const SchmancyTeleportation_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export declare class SchmancyTeleportation extends SchmancyTeleportation_base {
    static styles: import("lit").CSSResult[];
    /**
     * @attr {string} uuid - The component tag to teleport
     * @readonly
     */
    uuid: number;
    /**
     * @attr {string} id - The component tag to teleport
     * @required
     */
    id: string;
    delay: number;
    debugging: boolean;
    connectedCallback(): void;
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-teleport': SchmancyTeleportation;
    }
}
export {};
