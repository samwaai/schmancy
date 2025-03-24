/**
 * Custom scroll event interface for the SchmancyScroll component.
 * Contains detailed information about the scroll state.
 */
export interface SchmancyScrollEvent extends CustomEvent<{
    /** Current scroll position from the top */
    scrollTop: number;
    /** Total scrollable height of the content */
    scrollHeight: number;
    /** Visible height of the container */
    clientHeight: number;
    /** Original scroll event */
    e: Event;
}> {
}
declare global {
    interface HTMLElementEventMap {
        scroll: SchmancyScrollEvent;
    }
}
declare const SchmancyScroll_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A custom scrollable container with enhanced features.
 *
 * @fires {SchmancyScrollEvent} scroll - Fired when scrolling occurs (with a configurable debounce)
 * @slot - Default slot for content to be scrolled
 * @csspart scroller - The inner scrollable div element
 *
 * @example
 * ```html
 * <schmancy-scroll hide>
 *   <div>Scrollable content goes here</div>
 * </schmancy-scroll>
 * ```
 */
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
    /**
     * Reference to the inner scrollable div element
     * @private
     */
    private scroller;
    /**
     * Debounce time in milliseconds for the scroll event.
     * Higher values reduce the frequency of scroll events being dispatched.
     *
     * @attr debounce
     * @example <schmancy-scroll debounce="50"></schmancy-scroll>
     */
    debounce: number;
    /**
     * Called after the component's first update
     * Sets up the scroll event listener with debouncing
     * @protected
     */
    protected firstUpdated(): void;
    /**
     * Renders the component template
     * @returns {TemplateResult} The template to render
     * @protected
     */
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-scroll': SchmancyScroll;
    }
}
export {};
