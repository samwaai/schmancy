import { InputSize } from '@schmancy/input';
import SchmancyInputV2 from '@schmancy/input/input-v2';
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
    values?: string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyAutocomplete extends SchmancyAutocomplete_base {
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
    get values(): string[];
    set values(vals: string[]);
    get value(): string;
    set value(val: string);
    private _open;
    private _inputValue;
    private _visibleOptionsCount;
    private _hasResults;
    _listbox: HTMLUListElement;
    _input: SchmancyInputV2;
    private _options;
    private _inputElementRef;
    private _selectedValue$;
    private _selectedValues$;
    private _inputValue$;
    private _open$;
    private _options$;
    private _optionSelect$;
    private _documentClick$;
    private _checkAutofill$;
    connectedCallback(): void;
    private _setupAutocompleteLogic;
    private _setupDocumentClickHandler;
    private _setupAutofillDetection;
    private _updateInputDisplay;
    private _getSelectedLabels;
    private _announceToScreenReader;
    private _fireChangeEvent;
    checkValidity(): boolean;
    reportValidity(): boolean;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
    private _handleKeyDown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
