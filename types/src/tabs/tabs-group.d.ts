import { TSchmancyTabsMode } from './context';
declare const SchmancyTabGroup_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
