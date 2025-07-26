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
    /** Current scroll position from the left (for horizontal scrolling) */
    scrollLeft?: number;
    /** Total scrollable width of the content (for horizontal scrolling) */
    scrollWidth?: number;
    /** Visible width of the container (for horizontal scrolling) */
    clientWidth?: number;
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
    /** Scroll position for scrollTo action */
    top: number;
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
declare const SchmancyScroll_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A custom scrollable container with enhanced features.
 *
 * @fires {SchmancyScrollEvent} scroll - Fired when scrolling occurs (with a configurable debounce)
 * @slot - Default slot for content to be scrolled
 * @csspart scroller - The inner scrollable div element
 *
 * @example
 * ```html
 * <schmancy-scroll hide name="main-content">
 *   <div>Scrollable content goes here</div>
 * </schmancy-scroll>
 * ```
 *
 * @example
 * ```html
 * <schmancy-scroll direction="horizontal" hide name="image-carousel">
 *   <div class="flex">
 *     <img src="image1.jpg" alt="Image 1">
 *     <img src="image2.jpg" alt="Image 2">
 *   </div>
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
     * Direction of scrolling: vertical, horizontal, or both.
     * - vertical: Only allows vertical scrolling
     * - horizontal: Only allows horizontal scrolling
     * - both: Allows both horizontal and vertical scrolling (default)
     *
     * @attr direction
     * @example <schmancy-scroll direction="horizontal"></schmancy-scroll>
     */
    direction: 'vertical' | 'horizontal' | 'both';
    /**
     * Reference to the inner scrollable div element
     * @public
     */
    scroller: HTMLElement;
    /**
     * Debounce time in milliseconds for the scroll event.
     * Higher values reduce the frequency of scroll events being dispatched.
     *
     * @attr debounce
     * @example <schmancy-scroll debounce="50"></schmancy-scroll>
     */
    debounce: number;
    /**
     * Scrolls the container to the specified position
     * @param options - ScrollToOptions or a number representing the top position
     * @param top - For backward compatibility, if options is a number, this is treated as "behavior"
     */
    scrollTo(options?: ScrollToOptions | number, top?: number): void;
    /**
     * Scrolls the container horizontally to the specified position
     * @param left - The horizontal position to scroll to (in pixels)
     * @param behavior - The scroll behavior ('auto' or 'smooth')
     */
    scrollToLeft(left: number, behavior?: ScrollBehavior): void;
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
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-scroll': SchmancyScroll;
    }
}
export {};
