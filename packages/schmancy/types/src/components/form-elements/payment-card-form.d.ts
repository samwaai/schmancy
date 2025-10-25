import SchmancyForm from '@schmancy/form/form';
import SchmancyInput from '@schmancy/input/input';
declare const SchmancyPaymentCardForm_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-payment-card-form
 * A mobile-friendly payment card form component that provides real-time validation
 * and formatting for credit card information.
 *
 * @fires change - Fires when any field in the form changes
 * @slot - Default slot for any additional content
 */
export declare class SchmancyPaymentCardForm extends SchmancyPaymentCardForm_base {
    /**
     * The form data containing all payment card information
     */
    value: {
        cardName: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
    };
    /**
     * The detected card type (visa, mastercard, amex, etc.)
     * This is determined automatically by the Cleave.js library
     */
    cardType: string;
    /**
     * Individual field values tracked with state properties for reactivity
     */
    cardName: string | undefined;
    cardNumber: string | undefined;
    expirationDate: string | undefined;
    cvv: string | undefined;
    /**
     * Field validity states for enhanced validation feedback
     */
    isCardNameValid: boolean;
    isCardNumberValid: boolean;
    isExpirationDateValid: boolean;
    isCvvValid: boolean;
    /**
     * Query selectors for the form elements
     */
    cardNumberInput: SchmancyInput;
    expirationDateInput: SchmancyInput;
    cvvInput: SchmancyInput;
    cardNameInput: SchmancyInput;
    form: SchmancyForm;
    /**
     * When the component is first updated, initialize the Cleave.js formatters
     * for the credit card fields with appropriate validations
     */
    firstUpdated(): void;
    /**
     * Checks for validity of the entire form
     * @returns {boolean} True if the form is valid
     */
    reportValidity(): boolean;
    /**
     * Checks for validity of the form
     * @returns {boolean} True if the form is valid
     */
    checkValidity(): boolean;
    /**
     * Emit change event when any input value changes
     */
    private emitChange;
    /**
     * Render the payment card form with a responsive grid layout
     */
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * Helper method to render card type icon based on detected card type
     */
    private getCardIcon;
    /**
     * Helper method to render a security and acceptance notice
     */
    private renderSecurityNotice;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-payment-card-form': SchmancyPaymentCardForm;
    }
}
export {};
