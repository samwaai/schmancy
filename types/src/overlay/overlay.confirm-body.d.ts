import { type TemplateResult } from 'lit';
declare const SchmancyOverlayPromptBody_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Internal body component used by the `confirm()` / `prompt()` sugar.
 *
 * Minimal, dependency-free — plain HTML buttons / input so this file
 * doesn't need to import schmancy-form / schmancy-button (avoids the
 * risk of circular module graphs during early imports of $overlay).
 *
 * Emits a `close` CustomEvent with the typed result; the overlay picks
 * that up as the primary return channel. For custom-styled confirms,
 * callers pass their own component to `show()`.
 */
export declare class SchmancyOverlayPromptBody extends SchmancyOverlayPromptBody_base {
    heading?: string;
    subtitle?: string;
    message?: string;
    confirmText: string;
    cancelText: string;
    variant: 'default' | 'danger';
    /** Presence of `mode` switches between confirm (boolean) and prompt (string). */
    mode: 'confirm' | 'prompt';
    label?: string;
    defaultValue: string;
    placeholder?: string;
    inputType: string;
    pattern?: string;
    required: boolean;
    private _input?;
    firstUpdated(): void;
    private dismiss;
    private handleCancel;
    private handleConfirm;
    private handleSubmit;
    protected render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-overlay-prompt-body': SchmancyOverlayPromptBody;
    }
}
export {};
