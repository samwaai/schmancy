declare const SchmancyDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A basic dialog web component without title or actions
 *
 * @element schmancy-dialog
 * @slot default - Content slot for dialog body
 */
export declare class SchmancyDialog extends SchmancyDialog_base {
    /**
     * Current position of the dialog
     */
    private position;
    /**
     * Current active promise resolver
     */
    private resolvePromise?;
    /**
     * Simple API: Show the dialog at a specific position
     * @returns Promise that resolves when dialog is closed
     */
    show(positionOrEvent?: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent): Promise<boolean>;
    /**
     * Simple API: Hide the dialog
     */
    hide(result?: boolean): void;
    /**
     * Calculate optimal position based on click coordinates
     * with viewport boundary checks to prevent dialogs from appearing off-screen
     */
    private calculatePosition;
    /**
     * Handle lifecycle callback when dialog is first rendered
     */
    firstUpdated(): void;
    /**
     * Handle close action
     */
    private handleClose;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-dialog': SchmancyDialog;
    }
}
export {};
