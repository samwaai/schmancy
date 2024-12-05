export type SchmancyOptionChangeEvent = CustomEvent<{
    value: string;
    label: string;
}>;
declare const SchmancyOption_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SchmancyOption extends SchmancyOption_base {
    value: string;
    label: string | undefined;
    selected: boolean;
    handleOptionClick(option: string): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-option': SchmancyOption;
    }
}
export {};
