import { CSSResult, LitElement } from 'lit';
import { IBaseMixin } from './baseElement';
import { Constructor } from './constructor';
import { ITailwindElementMixin } from './tailwind.mixin';
/**
 * Cross-realm brand used by `<schmancy-form>` to discover form fields by
 * inheritance rather than tag-name allowlists. `Symbol.for` puts the symbol in
 * the global registry so detection works across module realms/bundles.
 */
export declare const SCHMANCY_FORM_FIELD: unique symbol;
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
    toFormEntries(): Array<[string, FormDataEntryValue]>;
    resetForm(): void;
    emitChange(detail: any): void;
}
/** Predicate used by `<schmancy-form>` to detect mixin descendants. */
export declare function isSchmancyFormField(el: unknown): el is IFormFieldMixin;
/**
 * A mixin that adds form field capabilities to a LitElement class.
 * Components that extend this mixin are automatically discovered and
 * collected by `<schmancy-form>` — no tag-name registration needed.
 *
 * Subclasses may override `toFormEntries()` to contribute multiple
 * name/value pairs to FormData (e.g. date-range, tag-input).
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
 */
export declare function SchmancyFormField<T extends CSSResult>(componentStyle?: T): Constructor<IFormFieldMixin> & Constructor<ITailwindElementMixin> & Constructor<LitElement> & Constructor<IBaseMixin>;
