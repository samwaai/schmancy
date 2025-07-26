declare const SchmancyTeleportation_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
    get _slottedChildren(): any;
    connectedCallback(): void;
    firstUpdated(): Promise<void>;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-teleport': SchmancyTeleportation;
    }
}
export {};
