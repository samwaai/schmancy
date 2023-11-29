declare const SchmnacySpinner_base: any;
export default class SchmnacySpinner extends SchmnacySpinner_base {
    color: string;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-spinner': SchmnacySpinner;
    }
}
export {};
