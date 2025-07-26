export declare const delayContext: {
    __context__: number;
};
declare const SchmancyDelay_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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
    render(): import("lit-html/directive").DirectiveResult<typeof import("lit-html/directives/cache").CacheDirective>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-delay': SchmancyDelay;
    }
}
export {};
