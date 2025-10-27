import { PropertyValues } from 'lit';
export type NavigationRailItemClickEvent = CustomEvent<{
    icon: string;
    label: string;
    value: string;
    active: boolean;
}>;
declare const SchmancyNavigationRailItem_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Material Design 3 Navigation Rail Item Component
 * @see https://m3.material.io/components/navigation-rail/overview
 *
 * `<schmancy-navigation-rail-item>` component
 *
 * Individual navigation item for use within a navigation rail.
 * Represents a single destination or action with an icon and optional label.
 *
 * @element schmancy-navigation-rail-item
 * @slot icon - Slot for the navigation item icon (e.g., schmancy-icon)
 * @slot - Default slot for custom content
 * @slot badge - Custom badge content
 *
 * @fires navigate - When the item is clicked
 *
 * @csspart container - The main item container
 * @csspart indicator - The active indicator
 * @csspart icon - The icon container
 * @csspart label - The label text
 * @csspart badge - The badge element
 *
 * @example
 * <schmancy-navigation-rail-item
 *   icon="home"
 *   label="Home"
 *   value="/home"
 *   badge="3"
 *   active>
 * </schmancy-navigation-rail-item>
 *
 * @example
 * <!-- Using 'selected' alias -->
 * <schmancy-navigation-rail-item
 *   icon="settings"
 *   label="Settings"
 *   value="/settings"
 *   selected>
 * </schmancy-navigation-rail-item>
 *
 * @example
 * <!-- With custom icon -->
 * <schmancy-navigation-rail-item label="Dashboard">
 *   <schmancy-icon slot="icon">dashboard</schmancy-icon>
 * </schmancy-navigation-rail-item>
 */
export declare class SchmancyNavigationRailItem extends SchmancyNavigationRailItem_base {
    private hovering$;
    private pressing$;
    private active$;
    /**
     * Icon name (Material Symbols icon)
     */
    icon: string;
    /**
     * Label text for the navigation item
     */
    label: string;
    /**
     * Value associated with this item (useful for routing)
     */
    value: string;
    /**
     * Whether this item is currently active/selected
     * @default false
     */
    get active(): boolean;
    set active(value: boolean);
    /**
     * Whether this item is currently selected (alias for active)
     * @default false
     */
    get selected(): boolean;
    set selected(value: boolean);
    /**
     * Badge text or number to display
     */
    badge: string;
    /**
     * Badge variant
     */
    badgeVariant: 'error' | 'primary' | 'secondary';
    /**
     * Whether to show the label (controlled by parent rail)
     * @default false
     */
    showLabel: boolean;
    /**
     * Whether this item is disabled
     * @default false
     */
    disabled: boolean;
    /**
     * Whether this is a nested item (sub-navigation)
     * @default false
     */
    nested: boolean;
    /**
     * Whether this item represents a group separator
     * @default false
     */
    group: boolean;
    private showRipple;
    connectedCallback(): void;
    updated(changedProperties: PropertyValues): void;
    /**
     * Handle click events
     */
    private handleClick;
    /**
     * Handle keyboard events
     */
    private handleKeyDown;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-navigation-rail-item': SchmancyNavigationRailItem;
    }
}
export {};
