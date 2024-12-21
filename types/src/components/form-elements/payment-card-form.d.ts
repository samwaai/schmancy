import SchmancyForm from '@schmancy/form/form';
import SchmancyInput from '@schmancy/input/input';
declare const SchmancyPaymentCardForm_base: CustomElementConstructor & import("../../../mixins").Constructor<import("lit").LitElement> & import("../../../mixins").Constructor<import("../../../mixins").IBaseMixin>;
export declare class SchmancyPaymentCardForm extends SchmancyPaymentCardForm_base {
    value: {
        cardName: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
    };
    cardName: string | undefined;
    cardNumber: string | undefined;
    expirationDate: string | undefined;
    cvv: string | undefined;
    cardNumberInput: SchmancyInput;
    expirationDateInput: SchmancyInput;
    cvvInput: SchmancyInput;
    cardNameInput: SchmancyInput;
    form: SchmancyForm;
    firstUpdated(): void;
    /** Checks for validity of the control and shows the browser message if it's invalid. */
    reportValidity(): boolean;
    /** Checks for validity of the control and emits the invalid event if it invalid. */
    checkValidity(): boolean;
    emitChange(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-payment-card-form': SchmancyPaymentCardForm;
    }
}
export {};
