import SchmancyInput from '@schmancy/input/input';
import SchmancyOption from '@schmancy/option/option';
import { Subject } from 'rxjs';
import { SchmancyInputChangeEvent } from '..';
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancyAutocomplete_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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
    searchTerm$: Subject<string>;
    searchTermSubscription: any;
    options: SchmancyOption[];
    firstUpdated(): void;
    updateInputValue(): void;
    showOptions(): Promise<void>;
    hideOptions(): void;
    handleInputChange(event: SchmancyInputChangeEvent): void;
    handleOptionClick(value: string): void;
    /** Checks for validity of the control and shows the browser message if it's invalid. */
    reportValidity(): boolean;
    /** Checks for validity of the control and emits the invalid event if it invalid. */
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
