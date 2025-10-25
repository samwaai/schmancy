import { PropertyValueMap } from 'lit';
import { SchmancyContentDrawerMinWidth, TSchmancyContentDrawerSheetMode } from './context';
declare const SchmancyContentDrawerMain_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyContentDrawerMain extends SchmancyContentDrawerMain_base {
    minWidth: number;
    drawerMinWidth: typeof SchmancyContentDrawerMinWidth.__context__;
    mode: TSchmancyContentDrawerSheetMode;
    maxHeight: string;
    connectedCallback(): void;
    protected update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer-main': SchmancyContentDrawerMain;
    }
}
export {};
