import SchmancyTab from './tab';
declare const SchmancyTabGroup_base: any;
export default class SchmancyTabGroup extends SchmancyTabGroup_base {
    activeTab: string;
    tabsElements: Array<SchmancyTab>;
    tabs: Array<SchmancyTab>;
    protected firstUpdated(): void;
    tabChanged(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tab-group': SchmancyTabGroup;
    }
}
export {};
