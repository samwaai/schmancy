import { InputSize, SchmancyInput } from '@schmancy/input';
import '../chips/input-chip';
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
    values?: string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyAutocomplete extends SchmancyAutocomplete_base {
    _valueSet: boolean;
    _valuesSet: boolean;
    required: boolean;
    placeholder: string;
    label: string;
    name: string;
    maxHeight: string;
    multi: boolean;
    description: string;
    size: InputSize;
    autocomplete: string;
    debounceMs: number;
    similarityThreshold: number;
    error: boolean;
    validationMessage: string;
    get values(): string[];
    set values(vals: string[]);
    get value(): string;
    set value(val: string);
    private _open;
    private _inputValue;
    private _visibleOptionsCount;
    private _hasResults;
    _listbox: HTMLUListElement;
    _input: SchmancyInput;
    private _options;
    private _inputElementRef;
    private _selectedValue$;
    private _selectedValues$;
    private _inputValue$;
    connectedCallback(): void;
    private _setupAutocompleteLogic;
    private _setupOptionHandlers;
    private _updateOptionSelection;
    private _filterOptions;
    private _openDropdown;
    private _selectOption;
    private _setupDocumentClickHandler;
    private _updateInputDisplay;
    private _getSelectedLabels;
    private _announceToScreenReader;
    private _fireChangeEvent;
    checkValidity(): boolean;
    reportValidity(): boolean;
    firstUpdated(): void;
    private handleChipRemove;
    private _getChipLabel;
    private _focusTextInput;
    render(): import("lit-html").TemplateResult<1>;
    private _handleAutoSelectOnBlur;
    private _handleKeyDown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
