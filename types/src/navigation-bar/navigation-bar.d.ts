declare const SchmancyNavigationBar_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * `<schmancy-navigation-bar>` component
 *
 * A horizontal navigation component following Material Design 3 specifications.
 * Navigation bars provide access to between 3-7 primary destinations.
 * Automatically hides in fullscreen mode when triggered via schmancyTheme.next({ fullscreen: true }).
 *
 * **IMPORTANT**: This component includes `z-10` by default (consistent with navigation-rail).
 * The consumer is responsible for positioning the navigation bar in their layout.
 * For typical bottom-fixed positioning, add: `class="fixed bottom-0 left-0 right-0"`.
 *
 * @element schmancy-navigation-bar
 * @slot - Default slot for navigation bar items
 *
 * @fires navigation-change - When an item is selected
 *
 * @example
 * <!-- Fixed at bottom (typical usage) -->
 * <schmancy-navigation-bar activeIndex="0" class="fixed bottom-0 left-0 right-0">
 *   <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
 *   <schmancy-navigation-bar-item icon="search" label="Search"></schmancy-navigation-bar-item>
 *   <schmancy-navigation-bar-item icon="favorite" label="Favorites"></schmancy-navigation-bar-item>
 *   <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
 * </schmancy-navigation-bar>
 *
 * @example
 * <!-- Within a container (demo/mockup usage) -->
 * <div class="flex flex-col h-screen">
 *   <main class="flex-1">Content</main>
 *   <schmancy-navigation-bar activeIndex="0">
 *     <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
 *   </schmancy-navigation-bar>
 * </div>
 */
export declare class SchmancyNavigationBar extends SchmancyNavigationBar_base {
    /**
     * Observable for active index state
     */
    private activeIndex$;
    /**
     * Currently active item index
     * @default -1
     */
    get activeIndex(): number;
    set activeIndex(value: number);
    /**
     * Hide labels and show only icons
     * @default false
     */
    hideLabels: boolean;
    /**
     * Elevation level for the navigation bar
     * @default 2
     */
    elevation: number;
    /**
     * Hide navigation bar on scroll down, show on scroll up
     * @default false
     */
    hideOnScroll: boolean;
    /**
     * Current focused item index for keyboard navigation
     */
    private focusedIndex;
    /**
     * Whether the navigation bar is hidden due to scrolling
     */
    private isHiddenByScroll;
    /**
     * Whether the navigation bar is hidden due to fullscreen mode
     */
    private isFullscreen;
    /**
     * Get all navigation bar items from the slot
     */
    private getItems;
    /**
     * Minimum scroll threshold before triggering hide/show
     */
    private readonly SCROLL_THRESHOLD;
    connectedCallback(): void;
    /**
     * Set up RxJS-based scroll listener
     */
    private setupScrollListener;
    /**
     * Handle item click events
     */
    private handleItemClick;
    /**
     * Handle keyboard navigation
     */
    private handleKeyDown;
    /**
     * Focus a specific item by index
     */
    private focusItem;
    /**
     * Update the list of navigation items
     */
    private updateItems;
    /**
     * Add a boat item to the navigation bar
     * @param config Configuration for the boat item
     * @returns The created or existing navigation bar item element
     */
    addBoatItem(config: {
        id: string;
        title: string;
        icon?: string;
    }): HTMLElement;
    /**
     * Update active states on all items
     */
    private updateActiveStates;
    updated(changedProperties: Map<string, any>): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-navigation-bar': SchmancyNavigationBar;
    }
}
export {};
