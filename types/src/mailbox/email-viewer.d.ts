import type { EmailAttachment } from './types';
declare const SchmancyEmailViewer_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Email viewer component showing formatted HTML and plain text versions
 *
 * Features:
 * - HTML and plain text preview modes
 * - Email client-compatible styling
 * - Layout parsing (columns, sidebars, image rows)
 * - Markdown to HTML conversion
 * - Attachment display
 * - Email header simulation
 * - Character/word statistics
 *
 * @example
 * ```html
 * <schmancy-email-viewer
 *   subject="Welcome!"
 *   body="**Hello** world"
 *   .attachments=${attachments}
 *   .recipients=${['user@example.com']}
 * ></schmancy-email-viewer>
 * ```
 */
export declare class SchmancyEmailViewer extends SchmancyEmailViewer_base {
    /** Email subject */
    subject: string;
    /** Email body content (markdown) */
    body: string;
    /** Email attachments */
    attachments: EmailAttachment[];
    /** Selected recipients for preview */
    recipients: string[];
    /** From address for preview */
    fromAddress: string;
    /** To address for preview (uses first recipient if not provided) */
    toAddress: string;
    /** Current view mode */
    private viewMode;
    /**
     * Parse layout blocks (:::layout type) and convert to email-safe table layouts
     */
    private parseLayoutBlocks;
    /**
     * Parse columns layout (2 or 3 columns)
     */
    private parseColumnsLayout;
    /**
     * Parse sidebar layout (left or right sidebar)
     */
    private parseSidebarLayout;
    /**
     * Parse image row layout
     */
    private parseImageRowLayout;
    /**
     * Parse image attributes from markdown syntax
     */
    private parseImageAttributes;
    /**
     * Generate email-safe image styles based on attributes
     */
    private generateImageStyles;
    /**
     * Parse basic markdown within layout content (simplified version)
     */
    private parseBasicMarkdown;
    /**
     * Email-compliant HTML generator for email clients (Gmail, Outlook, Apple Mail)
     * Uses table-based layouts with inline styles only - no CSS classes or modern features
     */
    private parseExtendedMarkdown;
    /**
     * Convert markdown to plain text for plain text preview
     */
    private convertToPlainText;
    /** Format file size for display */
    private formatFileSize;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-email-preview': SchmancyEmailPreview;
    }
}
export {};
