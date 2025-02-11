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
    /** Direct reference to the <input> inside <schmancy-input> */
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
    /**
     * When the <slot> changes (i.e. options are added/removed), update the following:
     * 1. Show or hide the “No results found” option.
     * 2. Sync the selection state.
     * 3. Setup accessibility attributes on the options.
     */
    private handleSlotChange;
    /**
     * Loops through assigned options and sets accessibility attributes:
     * - role="option"
     * - A unique ID (if not already set)
     * - tabindex="-1"
     * - aria-selected (based on whether the option is selected)
     */
    private setupOptionsAccessibility;
    private syncSelectionFromValue;
    private updateInputValue;
    /**
     * MAIN: Show the dropdown. Uses Floating UI to position and size the options container.
     */
    private showOptions;
    private hideOptions;
    private handleInputChange;
    private handleOptionClick;
    checkValidity(): boolean;
    reportValidity(): boolean;
    private handleTouchStart;
    private preventScroll;
    /**
     * Keyboard navigation for the autocomplete.
     * – When the dropdown is closed, ArrowDown (or Enter/Space) opens it.
     * – When open, ArrowDown/ArrowUp move focus between options (which must have role="option").
     * – Enter or Space selects the active option.
     * – Escape (or Tab) hides the dropdown.
     */
    private handleKeyDown;
    /**
     * Helper to focus an option by index and update the combobox’s aria-activedescendant.
     */
    private focusOption;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
