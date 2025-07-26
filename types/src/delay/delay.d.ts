export declare const delayContext: any;
declare const SchmancyDelay_base: CustomElementConstructor & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyDelay extends SchmancyDelay_base {
    delay: number;
    motion: string;
    private rendered;
    parentDelay: number;
    effectiveDelay: number;
    once?: boolean;
    private sessionKey;
    private mutationObserver?;
    assignedElements: HTMLElement[];
    firstUpdated(): void;
    disconnectedCallback(): void;
    private observeSlotChanges;
    private getTotalSiblingDelay;
    private updateRenderState;
    private generateSessionKey;
    private get motionLit();
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-delay': SchmancyDelay;
    }
}
export {};
