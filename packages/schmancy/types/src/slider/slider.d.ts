declare const SchmancySlider_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancySlider extends SchmancySlider_base {
    /**
     * Currently centered slide index
     */
    private selectedIndex;
    /**
     * If true, renders next/prev buttons
     */
    showArrows: boolean;
    private slider;
    private defaultSlot;
    protected firstUpdated(): void;
    private updateSelectedIndexOnScroll;
    private goToSlide;
    private onPrevClick;
    private onNextClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-slider': SchmancySlider;
    }
}
export {};
