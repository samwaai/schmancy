/**
 * Custom scroll event interface for the SchmancyScroll component.
 * Contains detailed information about the scroll state.
 */
export interface SchmancyScrollEvent extends CustomEvent<{
    /** Current scroll position from the top */
    scrollTop: number;
    /** Current scroll position from the left */
    scrollLeft: number;
    /** Total scrollable height of the content */
    scrollHeight: number;
    /** Total scrollable width of the content */
    scrollWidth: number;
    /** Visible height of the container */
    clientHeight: number;
    /** Visible width of the container */
    clientWidth: number;
    /** Original scroll event */
    e: Event;
}> {
}
/**
 * Command event interface for controlling SchmancyScroll components
 */
export interface SchmancyScrollCommandEvent extends CustomEvent<{
    /** Target component name */
    name: string;
    /** Command action to perform */
    action: 'scrollTo';
    /** Vertical scroll position for scrollTo action (optional) */
    top?: number;
    /** Horizontal scroll position for scrollTo action (optional) */
    left?: number;
}> {
}
declare global {
    interface HTMLElementEventMap {
        scroll: SchmancyScrollEvent;
        'schmancy-scroll-command': SchmancyScrollCommandEvent;
    }
}
declare const SchmancyScroll_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A custom scrollable container with enhanced features.
 *
 * @fires {SchmancyScrollEvent} scroll - Fired when scrolling occurs (with a configurable debounce)
 * @slot - Default slot for content to be scrolled
 * @csspart scroller - The inner scrollable div element
 * @csspart content - The content wrapper with padding
 *
 * @example
 * ```html
 * <!-- For horizontal scrolling with padding -->
 * <schmancy-scroll hide name="main-content" scroll-padding-start="24" scroll-padding-end="24">
 *   <div style="width: 1200px">Horizontally scrollable content goes here</div>
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
     * Optional name identifier for the component.
     * Used for targeting this specific component with global events.
     *
     * @attr name
     * @example <schmancy-scroll name="main-content"></schmancy-scroll>
     */
    name?: string;
    /**
     * Amount of padding at the start (top) of the scrollable area in pixels.
     * Creates space between the top of the viewport and the content.
     *
     * @attr scroll-padding-start
     * @example <schmancy-scroll scroll-padding-start="24"></schmancy-scroll>
     */
    scrollPaddingStart: number;
    /**
     * Amount of padding at the end (bottom) of the scrollable area in pixels.
     * Creates space between the bottom of the viewport and the content.
     *
     * @attr scroll-padding-end
     * @example <schmancy-scroll scroll-padding-end="24"></schmancy-scroll>
     */
    scrollPaddingEnd: number;
    /**
     * Reference to the inner scrollable div element
     * @public
     */
    scroller: HTMLElement;
    /**
     * Reference to the content wrapper div element
     * @public
     */
    contentWrapper: HTMLElement;
    /**
     * Debounce time in milliseconds for the scroll event.
     * Higher values reduce the frequency of scroll events being dispatched.
     *
     * @attr debounce
     * @example <schmancy-scroll debounce="50"></schmancy-scroll>
     */
    debounce: number;
    /**
     * Scrolls the container to the specified position, accounting for scroll padding
     * @param options - ScrollToOptions, a number for the horizontal position (legacy API support),
     *                  or undefined to scroll to beginning
     * @param top - Optional top value when first parameter is a number (legacy API support)
     */
    scrollTo(options?: ScrollToOptions | number, top?: number): void;
    /**
     * Called when component properties change
     * Updates the padding styles when padding properties change
     * @protected
     */
    protected updated(changedProperties: Map<string, unknown>): void;
    /**
     * Updates the content wrapper's padding and applies scroll-padding CSS properties
     * to the scroller element
     * @private
     */
    private updatePaddingStyles;
    /**
     * Called after the component's first update
     * Sets up the scroll event listener with debouncing and applies initial styles
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
