export type SchmancySelectChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancySelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancySelect extends SchmancySelect_base {
    required: boolean;
    placeholder: string;
    value: string;
    selectedValues: string[];
    multi: boolean;
    label: string;
    private isOpen;
    private valueLabel;
    private ul;
    private options;
    private cleanupPositioner?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    /**
     * Whenever new <schmancy-option> children get slotted in,
     * or whenever properties change, ensure the correct .selected states
     * and display text are applied.
     */
    private syncSelection;
    /**
     * We can also set up any ARIA attributes here.
     * Note that we’re toggling `aria-selected` for screen readers,
     * but the highlight in CSS is triggered by the option’s `selected` property.
     */
    private setupOptionsAccessibility;
    /**
     * Use @floating-ui/dom to position the <ul> under the "trigger" input.
     */
    private positionDropdown;
    /**
     * Keydown logic for opening/closing the dropdown and navigating options.
     */
    private handleKeyDown;
    private focusOption;
    private openDropdown;
    private closeDropdown;
    /**
     * Main method for toggling or setting selected items.
     */
    private handleOptionSelect;
    private dispatchChange;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
