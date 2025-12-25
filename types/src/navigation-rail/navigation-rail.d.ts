import { PropertyValues } from 'lit';
export type NavigateEvent = CustomEvent<string>;
export type NavigationRailMenuClickEvent = CustomEvent<void>;
export type NavigationRailFabClickEvent = CustomEvent<void>;
export type LabelVisibility = 'all' | 'selected' | 'none';
declare const SchmancyNavigationRail_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Material Design 3 Navigation Rail Component
 * @see https://m3.material.io/components/navigation-rail/overview
 *
 * `<schmancy-navigation-rail>` component
 *
 * A Material Design 3 vertical navigation component positioned on the left side of an application.
 * Navigation rails provide access to between 3-7 primary destinations with a compact footprint.
 * Automatically hides in fullscreen mode when triggered via schmancyTheme.next({ fullscreen: true }).
 *
 * @element schmancy-navigation-rail
 * @slot fab - Slot for a floating action button at the top
 * @slot menu - Slot for a menu icon or button below the FAB
 * @slot header - Custom header content slot
 * @slot footer - Custom footer content slot
 * @slot - Default slot for navigation rail items
 *
 * @fires navigate - When a navigation item is selected
 * @fires menu-click - When the menu button is clicked
 * @fires fab-click - When the FAB is clicked
 *
 * @csspart rail - The main rail container
 * @csspart header - The header section
 * @csspart nav - The navigation items container
 * @csspart footer - The footer section
 *
 * @example
 * <schmancy-navigation-rail activeIndex="0">
 *   <schmancy-button slot="fab" variant="filled" aria-label="Compose">
 *     <schmancy-icon>add</schmancy-icon>
 *   </schmancy-button>
 *   <schmancy-button slot="menu" variant="text" aria-label="Menu">
 *     <schmancy-icon>menu</schmancy-icon>
 *   </schmancy-button>
 *   <schmancy-navigation-rail-item icon="home" label="Home"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="search" label="Search"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="favorite" label="Favorites" badge="3"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="settings" label="Settings"></schmancy-navigation-rail-item>
 * </schmancy-navigation-rail>
 */
export declare class SchmancyNavigationRail extends SchmancyNavigationRail_base {
    private activeIndex$;
    /**
     * The currently active item index
     * @default -1
     */
    get activeIndex(): number;
    set activeIndex(value: number);
    /**
     * The currently active item value (for programmatic selection)
     */
    get activeValue(): string;
    set activeValue(value: string);
    private _activeValue;
    /**
     * When to show labels for navigation items
     * 'all' - Always show labels for all items
     * 'selected' - Only show label for selected item
     * 'none' - Never show labels
     * @default 'all'
     */
    labelVisibility: LabelVisibility;
    /**
     * Alignment of navigation items
     * @default 'top'
     */
    alignment: 'top' | 'center' | 'bottom';
    /**
     * Show tooltips when labels are hidden
     * @default true
     */
    showTooltips: boolean;
    /**
     * Enable keyboard navigation
     * @default true
     */
    keyboardNavigation: boolean;
    /**
     * Whether the navigation rail is expanded
     * @default false
     */
    expanded: boolean;
    private focusedIndex;
    private hasHeaderContent;
    private isFullscreen;
    private allElements;
    private get navigationItems();
    connectedCallback(): void;
    updated(changedProperties: PropertyValues): void;
    private updateActiveStates;
    private updateActiveByValue;
    private updateLabelVisibility;
    /**
     * Programmatically expand the navigation rail
     */
    expand(): void;
    /**
     * Programmatically collapse the navigation rail
     */
    collapse(): void;
    /**
     * Add a boat item to the navigation rail
     * @param config Configuration for the boat item
     * @returns The created or existing navigation rail item element
     */
    addBoatItem(config: {
        id: string;
        title: string;
        icon?: string;
    }): HTMLElement;
    /**
     * Toggle the navigation rail between expanded and collapsed states
     */
    toggle(): void;
    private handleKeyDown;
    private handleFabClick;
    private handleMenuClick;
    protected render(): import("lit-html").TemplateResult<1>;
    private setupNavigateListener;
    private handleHeaderSlotChange;
    private handleSlotChange;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-navigation-rail': SchmancyNavigationRail;
    }
}
export {};
