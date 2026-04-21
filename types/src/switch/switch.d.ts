import { LitElement } from 'lit';
export type SchmancySwitchChangeEvent = CustomEvent<{
    value: boolean;
}>;
declare const SchmancySwitch_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Binary on/off control. Form-associated, keyboard-accessible, semantically a
 * switch (ARIA role="switch"). Distinct from `schmancy-checkbox`: a switch
 * represents an immediate state change, a checkbox represents a selection in
 * a form to be submitted.
 *
 * @element schmancy-switch
 * @fires change - `CustomEvent<{ value: boolean }>` when the state changes.
 * @attr checked - Initial checked state (also reflected via `value`).
 * @attr disabled - Disables interaction.
 * @attr required - Requires the switch to be on for form validity.
 * @attr name - Form field name for submission.
 * @csspart track - The background track.
 * @csspart thumb - The moving thumb.
 */
export declare class SchmancySwitch extends SchmancySwitch_base {
    static formAssociated: boolean;
    private internals;
    checked: boolean;
    disabled: boolean;
    required: boolean;
    name: string;
    value: string;
    label: string;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    constructor();
    get form(): HTMLFormElement | null;
    protected updated(changed: Map<string, unknown>): void;
    formResetCallback(): void;
    formDisabledCallback(disabled: boolean): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    private _toggle;
    private _onKeydown;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-switch': SchmancySwitch;
    }
}
export {};
