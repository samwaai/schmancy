declare const SchmancyTeleportation_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyTeleportation extends SchmancyTeleportation_base {
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
    get _slottedChildren(): Element[];
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
