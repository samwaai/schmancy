import type { EmailTemplate, EmailAttachment, EmailComposeConfig } from './types';
import './email-layout-selector';
declare const SchmancyEmailEditor_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Email editor component with rich text formatting and file attachments
 *
 * Features:
 * - Template selection
 * - Markdown formatting toolbar
 * - Image upload and insertion
 * - File attachments with drag & drop
 * - Layout templates (columns, sidebars, image rows)
 * - Real-time character/word count
 *
 * @example
 * ```html
 * <schmancy-email-editor
 *   .subject="Welcome to our service"
 *   .body="Email content..."
 *   .templates=${emailTemplates}
 *   @editor-change=${handleChange}
 * ></schmancy-email-editor>
 * ```
 */
export declare class SchmancyEmailEditor extends SchmancyEmailEditor_base {
    /** Email subject */
    subject: string;
    /** Email body content (markdown) */
    body: string;
    /** Available email templates */
    templates: EmailTemplate[];
    /** Disable all interactions */
    disabled: boolean;
    /** Email attachments */
    attachments: EmailAttachment[];
    /** Configuration for upload handlers */
    config: EmailComposeConfig;
    /** Internal state */
    private selectedTemplate;
    private dragOver;
    private isUploading;
    /** Element references */
    private subjectInputRef;
    private bodyTextAreaRef;
    private fileInputRef;
    private imageInputRef;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private addKeyboardListeners;
    private addDragListeners;
    /** Handle keyboard shortcuts and tab indentation */
    private handleKeyDown;
    /** Handle paste events for image pasting */
    private handlePaste;
    /** Handle subject input changes */
    private handleSubjectChange;
    /** Handle body textarea changes */
    private handleBodyChange;
    /** Select and apply a template */
    private selectTemplate;
    /** Clear template selection */
    private clearTemplate;
    /** Dispatch composer change event */
    private dispatchChange;
    /** Insert text at cursor position */
    private insertAtCursor;
    /** Wrap selected text with formatting */
    private wrapSelection;
    /** Open layout selection dialog */
    private openLayoutDialog;
    /** Apply layout template to content */
    private applyLayout;
    /** Upload image with configurable handler */
    private uploadImage;
    /** Create data URL for local preview */
    private createDataUrl;
    /** Get image dimensions */
    private getImageDimensions;
    /** Insert image markdown at cursor */
    private insertImageMarkdown;
    /** Handle file input changes */
    private handleFileChange;
    /** Handle image selection */
    private handleImageSelect;
    /** Drag and drop handlers */
    private handleDrop;
    private handleDragEnter;
    private handleDocumentDragLeave;
    private handleDocumentDrop;
    private handleDragOver;
    private handleDragLeave;
    /** Add file as attachment */
    private addFile;
    /** Remove attachment */
    private removeAttachment;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-email-editor': SchmancyEmailEditor;
    }
}
export {};
