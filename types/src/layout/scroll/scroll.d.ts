declare const SchmancyScroll_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyScroll extends SchmancyScroll_base {
    /**
     * Determines whether the scrollbar is hidden.
     *
     * When `hide` is true, the inner scrollable div receives the `scrollbar-hide` class,
     * which hides scrollbars in supported browsers.
     *
     * @attr hide
     * @example <schmancy-scroll hide></schmancy-scroll>
     */
    hide: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-scroll': SchmancyScroll;
    }
}
export {};
