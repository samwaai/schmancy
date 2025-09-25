declare const SchmancyNavigationBarItem_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * `<schmancy-navigation-bar-item>` component
 *
 * Individual navigation item for use within a navigation bar.
 * Represents a single destination with an icon and optional label following Material Design 3 specifications.
 *
 * @element schmancy-navigation-bar-item
 * @slot icon - Slot for custom icon content
 * @slot - Default slot for custom content
 *
 * @fires bar-item-click - When the item is clicked
 * @fires focus - When the item receives focus
 * @fires blur - When the item loses focus
 *
 * @example
 * <schmancy-navigation-bar-item icon="home" label="Home" active></schmancy-navigation-bar-item>
 *
 * @example
 * <schmancy-navigation-bar-item label="Custom">
 *   <span slot="icon">🏠</span>
 * </schmancy-navigation-bar-item>
 */
export declare class SchmancyNavigationBarItem extends SchmancyNavigationBarItem_base {
    /**
     * Icon name for the navigation item (Material Symbols Outlined)
     */
    icon: string;
    /**
     * Label text for the navigation item
     */
    label: string;
    /**
     * Badge content (can be a number or short text)
     */
    badge: string;
    /**
     * Observable for active state
     */
    private active$;
    /**
     * Whether this item is currently active/selected
     * @default false
     */
    get active(): boolean;
    set active(value: boolean);
    /**
     * Whether this item is disabled
     * @default false
     */
    disabled: boolean;
    /**
     * Whether to hide labels (controlled by parent navigation bar)
     * @default false
     */
    hideLabels: boolean;
    /**
     * Track ripple effects
     */
    private ripples;
    /**
     * Add ripple effect (immediate, no debounce)
     */
    private addRippleEffect;
    /**
     * Handle click events with RxJS
     */
    private handleClick;
    /**
     * Handle keyboard events for accessibility (non-Enter/Space keys)
     */
    private handleKeyDown;
    /**
     * Method called by parent to set active state
     */
    setActive(isActive: boolean): void;
    connectedCallback(): void;
    /**
     * Set up RxJS stream for navigation events
     */
    private setupNavigationStream;
    /**
     * Format badge content for display
     */
    private formatBadge;
    protected firstUpdated(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-navigation-bar-item': SchmancyNavigationBarItem;
    }
}
export {};
