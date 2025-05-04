import { InputSize } from '@schmancy/input';
import SchmancyInputV2 from '@schmancy/input/input-v2';
/**
 * @fires change - When selection changes
 */
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
    values?: string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * SchmancyAutocomplete provides an accessible autocomplete/combobox component
 * with keyboard navigation and single or multi-select capabilities.
 *
 * @element schmancy-autocomplete
 * @slot - Default slot for option elements
 * @slot trigger - Optional slot to override the default input element
 *
 * @property {string} value - The selected value for single-select mode. In multi-select mode,
 *                           this is a comma-separated string of values (kept for backward compatibility).
 * @property {string[]} values - The selected values as an array for multi-select mode (preferred API for multi-select).
 */
export default class SchmancyAutocomplete extends SchmancyAutocomplete_base {
    required: boolean;
    placeholder: string;
    label: string;
    maxHeight: string;
    multi: boolean;
    description: string;
    size: InputSize;
    autocomplete: string;
    debounceMs: number;
    get values(): string[];
    set values(vals: string[]);
    get value(): string;
    set value(val: string);
    private _open;
    private _inputValue;
    private _selectedValue;
    private _selectedValues;
    private _suppressFocusOpen;
    private _debounceTimer;
    _listbox: HTMLUListElement;
    _input: SchmancyInputV2;
    private _options;
    private _inputElementRef;
    private _documentClickHandler;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changedProps: Map<string, unknown>): void;
    /**
     * Handle document clicks to close dropdown when clicking outside
     */
    private _onDocumentClick;
    /**
     * Set up initial option accessibility attributes
     */
    private _setupOptionsAccessibility;
    /**
     * Update options' selection state based on component value
     */
    private _syncOptionsSelection;
    /**
     * Show all options without filtering
     */
    private _showAllOptions;
    /**
     * Filter options based on input text - this operation can be expensive
     * with many options or complex filtering logic
     */
    private _filterOptions;
    /**
     * Get all currently visible options
     */
    private _getVisibleOptions;
    /**
     * Get labels of selected options
     */
    private _getSelectedLabels;
    /**
     * Update the input display based on selection state
     */
    private _updateInputDisplay;
    /**
     * Handle input focus
     */
    private _onInputFocus;
    /**
     * Debounce a function call
     * @param fn Function to debounce
     */
    private _debounce;
    /**
     * Handle input text changes with debouncing
     */
    private _onInputChange;
    /**
     * Show the dropdown with all options visible initially
     */
    private _showDropdown;
    /**
     * Announce message to screen readers
     */
    private _announceToScreenReader;
    /**
     * Select an option (either via click or keyboard)
     */
    private _selectOption;
    /**
     * Handle keyboard navigation
     */
    private _onKeyDown;
    /**
     * Get the currently focused option
     */
    private _getFocusedOption;
    /**
     * Move focus to next/previous option
     */
    private _moveFocus;
    /**
     * Focus the first visible option
     */
    private _focusFirstOption;
    /**
     * Focus the last visible option
     */
    private _focusLastOption;
    /**
     * Fire change event
     */
    private _fireChangeEvent;
    /**
     * Check validity for form integration
     */
    checkValidity(): boolean;
    /**
     * Report validity for form integration
     */
    reportValidity(): boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
