import SchmancyInput from '@schmancy/input/input';
import SchmancyOption from '@schmancy/option/option';
import { BehaviorSubject } from 'rxjs';
import { SchmancyInputChangeEvent } from '..';
export type SchmancyAutocompleteChangeEvent = CustomEvent<{
    value: string;
}>;
declare const SchmancyAutocomplete_base: import("@schmancy/mixin/shared/constructor").Constructor<CustomElementConstructor> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin/shared/constructor").Constructor<import("lit").LitElement> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/shared/baseElement").IBaseMixin>;
export declare class SchmancyAutocomplete extends SchmancyAutocomplete_base {
    required: any;
    placeholder: string;
    value: string;
    label: string;
    valueLabel: string;
    inputRef: import("lit-html/directives/ref").Ref<HTMLInputElement>;
    ul: HTMLUListElement;
    empty: HTMLLIElement;
    input: SchmancyInput;
    searchTerm$: BehaviorSubject<string>;
    searchTermSubscription: any;
    options: SchmancyOption[];
    firstUpdated(): void;
    updateInputValue(): void;
    handleInputChange(event: SchmancyInputChangeEvent): void;
    handleOptionClick(value: any): void;
    /** Checks for validity of the control and shows the browser message if it's invalid. */
    reportValidity(): boolean;
    /** Checks for validity of the control and emits the invalid event if it invalid. */
    checkValidity(): boolean;
    show(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-autocomplete': SchmancyAutocomplete;
    }
}
export {};
