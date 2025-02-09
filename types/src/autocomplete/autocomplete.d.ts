export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyAutocomplete extends SchmancyAutocomplete_base {
    required: boolean;
    placeholder: string;
    value: string;
    label: string;
    /**
     * ⚠️ If you still want an explicit fallback for maximum dropdown height,
     * you can keep this, but the `size()` middleware will already set a
     * dynamic max-height based on viewport space.
     */
    maxHeight: string;
    multi: boolean;
    /** Direct reference to the <input> inside <schmancy-input>. */
    inputRef: import("lit-html/directives/ref").Ref<HTMLInputElement>;
    private optionsContainer;
    private empty;
    private input;
    private options;
    private readonly searchTerm$;
    private startY;
    connectedCallback(): void;
    firstUpdated(): void;
    protected updated(changedProps: Map<string | number | symbol, unknown>): void;
    private handleSlotChange;
    private syncSelectionFromValue;
    private updateInputValue;
    /**
     * MAIN: Show the dropdown, using Floating UI to size it
     * to the available space, and at least as wide as the input.
     */
    private showOptions;
    private hideOptions;
    private handleInputChange;
    private handleOptionClick;
    checkValidity(): boolean;
    reportValidity(): boolean;
    private handleTouchStart;
    private preventScroll;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
