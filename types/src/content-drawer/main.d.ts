import { PropertyValueMap } from 'lit';
import { SchmancyContentDrawerMinWidth, TSchmancyContentDrawerSheetMode } from './context';
declare const SchmancyContentDrawerMain_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyContentDrawerMain extends SchmancyContentDrawerMain_base {
    minWidth: any;
    drawerMinWidth: typeof SchmancyContentDrawerMinWidth.__context__;
    mode: TSchmancyContentDrawerSheetMode;
    maxHeight: any;
    connectedCallback(): void;
    protected update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer-main': SchmancyContentDrawerMain;
    }
}
export {};
