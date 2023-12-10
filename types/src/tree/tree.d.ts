declare const SchmancyTree_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancyTree extends SchmancyTree_base {
    open: boolean;
    active: boolean;
    toggler: HTMLSlotElement;
    defaultSlot: HTMLSlotElement;
    chevron: HTMLSpanElement;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
