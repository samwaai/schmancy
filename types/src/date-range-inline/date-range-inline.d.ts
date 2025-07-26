declare global {
    interface HTMLElementTagNameMap {
        'schmancy-date-range-inline': SchmancyDateRangeInline;
    }
}
export type SchmancyDateRangeInlineChangeEvent = CustomEvent<{
    dateFrom: string;
    dateTo: string;
    isValid: boolean;
}>;
declare const SchmancyDateRangeInline_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Smart inline date range picker that handles all the heavy lifting.
 * Auto-corrects invalid ranges, provides smart defaults, and validates dates.
 */
export default class SchmancyDateRangeInline extends SchmancyDateRangeInline_base {
    /**
     * Input type - 'date' or 'datetime-local'
     */
    type: 'date' | 'datetime-local';
    /**
     * From date configuration
     */
    dateFrom: {
        label: string;
        value: string;
    };
    /**
     * To date configuration
     */
    dateTo: {
        label: string;
        value: string;
    };
    /**
     * Minimum allowed date
     */
    minDate?: string;
    /**
     * Maximum allowed date
     */
    maxDate?: string;
    /**
     * Compact mode for smaller UI
     */
    compact: boolean;
    /**
     * Auto-correct invalid date ranges
     */
    autoCorrect: boolean;
    /**
     * Minimum gap between dates (in days)
     */
    minGap: number;
    /**
     * Maximum gap between dates (in days)
     */
    maxGap?: number;
    /**
     * Default gap when auto-setting dates (in days)
     */
    defaultGap: number;
    /**
     * Whether to allow same date selection
     */
    allowSameDate: boolean;
    /**
     * Internal validation state
     */
    private validationState;
    connectedCallback(): void;
    /**
     * Set smart default dates based on context
     */
    private setSmartDefaults;
    /**
     * Format date to required string format
     */
    private formatDate;
    /**
     * Parse date string to Date object
     */
    private parseDate;
    /**
     * Calculate days between two dates
     */
    private getDaysBetween;
    /**
     * Handle from date change with validation and auto-correction
     */
    private handleDateFromChange;
    /**
     * Handle to date change with validation and auto-correction
     */
    private handleDateToChange;
    /**
     * Validate dates and auto-correct if enabled
     */
    private validateAndCorrect;
    /**
     * Get computed min date for the "to" field based on "from" value
     */
    private getComputedMinDateTo;
    /**
     * Get computed max date for the "from" field based on "to" value
     */
    private getComputedMaxDateFrom;
    emitChange(): void;
    protected render(): any;
}
export {};
