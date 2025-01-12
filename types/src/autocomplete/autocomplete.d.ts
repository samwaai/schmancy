import SchmancyInput from '@schmancy/input/input';
import SchmancyOption from '@schmancy/option/option';
import { Subject } from 'rxjs';
import { SchmancyInputChangeEvent } from '..';
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyAutocomplete extends SchmancyAutocomplete_base {
    required: any;
    placeholder: string;
    value: string;
    label: string;
    maxHeight: string;
    multi: boolean;
    valueLabel: string;
    inputRef: import("lit-html/directives/ref").Ref<HTMLInputElement>;
    ul: HTMLUListElement;
    empty: HTMLLIElement;
    optionsContainer: HTMLUListElement;
    input: SchmancyInput;
    options: SchmancyOption[];
    searchTerm$: Subject<string>;
    searchTermSubscription: any;
    firstUpdated(): void;
    updateInputValue(): void;
    showOptions(): Promise<void>;
    hideOptions(): void;
    handleInputChange(event: SchmancyInputChangeEvent): void;
    handleOptionClick(value: string): void;
    reportValidity(): boolean;
    checkValidity(): boolean;
    render(): import("lit-html").TemplateResult<1>;
    preventScroll(event: any): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
