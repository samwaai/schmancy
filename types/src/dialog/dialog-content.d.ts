declare const SchmancyDialogContent_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A basic dialog content component that doesn't add any padding or styling
 * Used for rendering raw content in a dialog
 *
 * @element schmancy-dialog-content
 * @slot default - Content slot for dialog content without any styling
 */
export declare class SchmancyDialogContent extends SchmancyDialogContent_base {
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-dialog-content': SchmancyDialogContent;
    }
}
export {};
