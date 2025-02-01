import SchmancyInput from '@schmancy/input/input';
import SchmancyOption from '@schmancy/option/option';
import type { SchmancyInputChangeEvent } from '..';
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyAutocomplete extends SchmancyAutocomplete_base {
    /**
     * Whether input is required for form validity.
     */
    required: boolean;
    /**
     * Placeholder text for the input.
     */
    placeholder: string;
    /**
     * Programmatic value of the autocomplete. Setting this
     * after the element is rendered will now update the display.
     */
    value: string;
    /**
     * Label for the input (floating label or similar).
     */
    label: string;
    /**
     * Max height of the dropdown options container.
     */
    maxHeight: string;
    /**
     * Whether multiple selections are allowed.
     */
    multi: boolean;
    /**
     * A local property to store the *display* value (label text).
     * This is separate from the raw `value`.
     */
    valueLabel: string;
    inputRef: import("lit-html/directives/ref").Ref<HTMLInputElement>;
    /**
     * The main <ul> with id="options".
     */
    optionsContainer: HTMLUListElement;
    /**
     * The "no results found" <li> element.
     */
    empty: HTMLLIElement;
    /**
     * The SchmancyInput element (your visible text input).
     */
    input: SchmancyInput;
    /**
     * All the <schmancy-option> children assigned via the default slot.
     */
    options: SchmancyOption[];
    private readonly searchTerm$;
    connectedCallback(): void;
    /**
     * firstUpdated (similar to componentDidMount in React).
     * We can do an initial sync of the input's display text
     * if a `value` was pre-set.
     */
    firstUpdated(): void;
    /**
     * This will be invoked *any time* a reactive property changes
     * after the first render. We specifically check if `value` changed,
     * so we can update the display text (and selected states) if needed.
     */
    protected updated(changedProps: Map<string | number | symbol, unknown>): void;
    /**
     * If user assigned new <schmancy-option> children, or changed them,
     * we also want to ensure the "no results" is correct and that
     * our input text is still in sync.
     */
    private handleSlotChange;
    /**
     * For multi-select, ensure that any `value` strings
     * are reflected in the child <schmancy-option>'s `selected` property.
     * For single select, do similarly for the one matching option.
     */
    private syncSelectionFromValue;
    /**
     * Takes the current `value` (and child <schmancy-option>s) and updates
     * the displayed text in the schmancy-input. Called whenever we need
     * to re-sync the visible input text to the actual data.
     */
    updateInputValue(): void;
    /**
     * Show the dropdown list, using Floating UI for positioning.
     */
    showOptions(): Promise<void>;
    /**
     * Hide the dropdown immediately (no animation).
     */
    hideOptions(): void;
    /**
     * Called whenever the user types in the schmancy-input.
     */
    handleInputChange(event: SchmancyInputChangeEvent): void;
    /**
     * Called whenever user clicks or taps an <schmancy-option>.
     */
    handleOptionClick(value: string): void;
    /**
     * Check validity of the selected value(s) to satisfy forms.
     */
    checkValidity(): boolean;
    /**
     * Actually cause form validation checks if needed.
     */
    reportValidity(): boolean;
    /**
     * Attempt to prevent iOS scrolling the background page
     * while swiping within the options list.  (NB: This logic
     * currently needs a bit more nuance to be robust.)
     */
    private startY;
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
