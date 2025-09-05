import type { EmailTemplate, EmailComposeConfig, ImportSource } from './types';
declare const SchmancyMailbox_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Main mailbox component that orchestrates the entire email composition flow
 *
 * Features:
 * - Responsive layout with composer and preview panels
 * - Recipients management with floating boat interface
 * - Template selection and content editing
 * - Attachment handling
 * - Email validation and sending
 *
 * @example
 * ```html
 * <schmancy-mailbox
 *   .config=${{ sendEndpoint: '/api/send-email' }}
 *   .templates=${emailTemplates}
 *   .importSources=${recipientSources}
 * ></schmancy-mailbox>
 * ```
 */
export declare class SchmancyMailbox extends SchmancyMailbox_base {
    /** Configuration for endpoints and handlers */
    config: EmailComposeConfig;
    /** Available email templates */
    templates: EmailTemplate[];
    /** Import sources for recipients panel */
    importSources: ImportSource[];
    /** Disable all interactions */
    disabled: boolean;
    /** Recipients panel title */
    recipientsTitle: string;
    /** Empty state title for recipients */
    recipientsEmptyTitle: string;
    /** Empty state message for recipients */
    recipientsEmptyMessage: string;
    /** Enable CSV import functionality */
    enableCsvImport: boolean;
    /** Enable drag and drop for files */
    enableDragDrop: boolean;
    /** Email composition state */
    private recipients;
    private selectedRecipients;
    private subject;
    private body;
    private templateId;
    private attachments;
    private isSending;
    connectedCallback(): void;
    updated(changedProperties: Map<string, any>): void;
    /** Handle emails imported from various sources */
    private handleEmailsImported;
    /** Handle individual recipient removal */
    private handleRecipientRemoved;
    /** Handle clearing all recipients */
    private handleRecipientsCleared;
    /** Handle recipient selection changes */
    private handleSelectionChanged;
    /** Handle composer content changes */
    private handleEditorChange;
    /** Handle email sending */
    private handleSend;
    /** Add recipients programmatically */
    addRecipients(emails: string[]): void;
    /** Set email subject */
    setSubject(subject: string): void;
    /** Set email body */
    setBody(body: string): void;
    /** Set selected template */
    setTemplate(templateId: string | null): void;
    /** Clear all compose data */
    clearCompose(): void;
    /** Set sending state */
    setSending(sending: boolean): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-mailbox': SchmancyMailbox;
    }
}
export {};
