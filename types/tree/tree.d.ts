declare const SchmancyTree_base: any;
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
