import { CSSResult, LitElement } from 'lit';
import { IBaseMixin } from '../mixins/baseElement';
import { Constructor } from '../mixins/constructor';
import { ITailwindElementMixin } from '../mixins/tailwind.mixin';
/**
 * Interface defining the properties and methods that the FormFieldMixin adds.
 */
export interface IFormFieldMixin extends Element {
    name: string;
    value: string | string[] | boolean | number | undefined;
    label: string;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    error: boolean;
    validationMessage: string;
    hint?: string;
    id: string;
    form: HTMLFormElement | null;
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    emitChange(detail: any): void;
}
/**
 * A mixin that adds form field capabilities to a LitElement class.
 * This provides common form field properties, validation, and form association.
 *
 * @example
 * ```ts
 * class MyInput extends FormFieldMixin(TailwindElement(css`...`)) {
 *   // Your component code here
 * }
 * ```
 */
export declare function FormFieldMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<IFormFieldMixin> & T;
/**
 * A convenience function that composes FormFieldMixin with TailwindElement
 * to create a base class for Schmancy form components.
 *
 * @example
 * ```ts
 * class MyInput extends SchmancyFormField(css`...`) {
 *   // Your component code here
 * }
 * ```
 */
export declare function SchmancyFormField<T extends CSSResult>(componentStyle?: T): Constructor<IFormFieldMixin> & Constructor<ITailwindElementMixin> & Constructor<LitElement> & Constructor<IBaseMixin>;
