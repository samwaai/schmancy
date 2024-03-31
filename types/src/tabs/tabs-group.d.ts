import { TSchmancyTabsMode } from './context';
declare const SchmancyTabGroup_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @slot - The content of the tab group
 * @fires tab-changed - The event fired when the tab is changed
 */
export default class SchmancyTabGroup extends SchmancyTabGroup_base {
    mode: TSchmancyTabsMode;
    rounded: boolean;
    activeTab: string;
    private tabsElements;
    navElement: HTMLElement;
    tabsContent: HTMLElement;
    private tabs;
    connectedCallback(): void;
    firstUpdated(): void;
    hydrateTabs(): void;
    tabChanged(selectedTab: {
        label: string;
        value: string;
    }): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tab-group': SchmancyTabGroup;
    }
}
export {};
