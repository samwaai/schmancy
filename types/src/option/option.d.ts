export type SchmancyOptionChangeEvent = CustomEvent<{
    value: string;
    label: string;
}>;
declare const SchmancyOption_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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
