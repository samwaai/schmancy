declare const SchmancyTabGroup_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @slot - The content of the tab group
 * @fires tab-changed - The event fired when the tab is changed
 */
export default class SchmancyTabGroup extends SchmancyTabGroup_base {
    rounded: boolean;
    private activeTab;
    private tabsElements;
    private tabs;
    hydrateTabs(): void;
    tabChanged(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tab-group': SchmancyTabGroup;
    }
}
export {};
