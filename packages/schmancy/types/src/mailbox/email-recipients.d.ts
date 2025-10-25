/**
 * CSV parser interface (optional dependency)
 * Can be provided via global window object or imported
 */
interface CSVParser {
    parse(csvContent: string, config: any): {
        data: any[];
        meta: {
            fields?: string[];
        };
    };
}
declare const SchmancyEmailRecipients_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Email recipients management component with floating boat interface
 *
 * Features:
 * - Floating boat UI that can be minimized/expanded
 * - CSV import with drag & drop
 * - Multiple import sources (configurable)
 * - Bulk selection and management
 * - Search and filtering
 * - Email validation
 *
 * @example
 * ```html
 * <schmancy-email-recipients
 *   .recipients=${['user1@example.com', 'user2@example.com']}
 *   @emails-imported=${handleEmailsImported}
 * ></schmancy-email-recipients>
 * ```
 */
export declare class SchmancyEmailRecipients extends SchmancyEmailRecipients_base {
    /** Disable all interactions */
    disabled: boolean;
    /** All available recipients */
    recipients: string[];
    /** Currently selected recipients */
    selectedRecipients: string[];
    /** Enable CSV import functionality */
    enableCsvImport: boolean;
    /** Enable drag and drop for files */
    enableDragDrop: boolean;
    /** Panel title */
    title: string;
    /** Empty state title */
    emptyStateTitle: string;
    /** Empty state message */
    emptyStateMessage: string;
    /** CSV parser function (optional) */
    csvParser?: CSVParser;
    /** Internal state */
    private dragOver;
    private localSelectedRecipients;
    private searchQuery;
    private filteredRecipients;
    private boatState;
    /** File input reference */
    private fileInputRef;
    connectedCallback(): void;
    private handleEmailsImported;
    updated(changedProperties: Map<string, any>): void;
    /** Handle CSV import trigger */
    private handleImportFromCSV;
    /** Handle file selection */
    private handleFileSelect;
    /** Handle drag and drop */
    private handleDrop;
    /** Process CSV file */
    private processCSVFile;
    /** Parse CSV content */
    private parseCSV;
    /** Simple CSV parsing fallback */
    private simpleCSVParse;
    /** Validate email format */
    private isValidEmail;
    /** Toggle recipient selection */
    private toggleRecipientSelection;
    /** Select all filtered recipients */
    private selectAll;
    /** Clear all selections */
    private selectNone;
    /** Remove individual recipient */
    private removeRecipient;
    /** Clear all recipients */
    private clearAll;
    /** Update filtered recipients based on search */
    private updateFilteredRecipients;
    /** Handle search input */
    private handleSearchInput;
    /** Clear search query */
    private clearSearch;
    /** Dispatch selection change event */
    private dispatchSelectionChange;
    /** Handle boat state changes */
    private handleBoatStateChange;
    /** Add recipients programmatically */
    addRecipients(emails: string[]): void;
    /** Show boat */
    showBoat(): void;
    /** Hide boat */
    hideBoat(): void;
    /** Expand boat */
    expandBoat(): void;
    /** Toggle boat state */
    toggleBoat(): void;
    render(): import("lit-html").TemplateResult<1>;
    /** Render floating boat layout */
    private renderBoatLayout;
    /** Render boat content */
    private renderBoatContent;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-email-recipients': SchmancyEmailRecipients;
    }
}
export {};
