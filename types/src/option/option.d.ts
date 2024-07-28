export type SchmancyOptionChangeEvent = CustomEvent<{
    value: string;
    label: string;
}>;
declare const SchmancyOption_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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
