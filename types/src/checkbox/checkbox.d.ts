import '@material/web/checkbox/checkbox.js';
import { LitElement } from 'lit';
export type schmancyCheckBoxChangeEvent = CustomEvent<{
    value: boolean;
}>;
declare const SchmancyCheckboxElement_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Binary checkbox for multi-select or boolean form fields. Wraps Material Web's `<md-checkbox>`; form-associated.
 *
 * @element schmancy-checkbox
 * @summary Use for "select many from a list" or any boolean that's part of a form submission. Prefer schmancy-switch for immediate-effect toggles.
 * @example
 * <schmancy-checkbox name="tos" required>I accept the terms</schmancy-checkbox>
 * @platform checkbox change - Wraps `<md-checkbox>` from `@material/web`. Degrades to styled native `<input type="checkbox">` if the tag never registers.
 * @slot - The label for the checkbox.
 * @fires valueChange - `CustomEvent<{ value: boolean }>` when the checkbox is toggled.
 **/
declare class SchmancyCheckboxElement extends SchmancyCheckboxElement_base {
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static formAssociated: boolean;
    internals: ElementInternals | undefined;
    constructor();
    get form(): HTMLFormElement;
    /**
     * @attr {boolean} value - The value of the checkbox.
     */
    value: boolean;
    /**
     * @attr {boolean} checked - Alternative property for checkbox state (alias for value).
     */
    get checked(): boolean;
    set checked(val: boolean);
    /**
     * @attr {boolean} disabled - The disabled state of the checkbox.
     */
    disabled: boolean;
    /**
     * @attr {boolean} required - The required state of the checkbox.
     */
    required: boolean;
    /**
     * @attr {string} name - The name of the checkbox.
     */
    name: string;
    /**
     * @attr {string} id - The id of the checkbox.
     */
    id: string;
    /**
     * @attr {string} label - The label text for the checkbox.
     */
    label?: string;
    connectedCallback(): void;
    updated(changed: Map<string, unknown>): void;
    private _syncFormValue;
    private _syncValidity;
    checkValidity(): boolean;
    reportValidity(): boolean;
    /**
     * @attr {xxs | xs | sm | md | lg } size - The size of the checkbox.
     * M3 aligned: 24dp (xxs) → 32dp (xs) → 40dp (sm) → 48dp (md) → 56dp (lg)
     */
    size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    render(): import("lit-html").TemplateResult<1>;
}
export { SchmancyCheckboxElement as SchmancyCheckbox };
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-checkbox': SchmancyCheckboxElement;
    }
}
