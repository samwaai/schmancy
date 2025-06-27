import { PropertyValues } from 'lit';
export type SchmancyDateRangeChangeEvent = CustomEvent<{
    dateFrom: string;
    dateTo: string;
}>;
declare const SchmancyDateRange_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A date range selector that supports presets and manual date input.
 *
 * @element schmancy-date-range
 * @fires change - Fired when the date range changes with dateFrom and dateTo values
 */
export declare class SchmancyDateRange extends SchmancyDateRange_base {
    type: 'date' | 'datetime-local';
    dateFrom: {
        label: string;
        value: string;
    };
    dateTo: {
        label: string;
        value: string;
    };
    minDate?: string;
    maxDate?: string;
    customPresets: Array<{
        label: string;
        dateFrom: string;
        dateTo: string;
    }>;
    format?: string;
    disabled: boolean;
    required: boolean;
    placeholder: string;
    clearable: boolean;
    allowDirectInput: boolean;
    private isOpen;
    private selectedDateRange;
    private activePreset;
    private announceMessage;
    private isMobile;
    private isTyping;
    private typedValue;
    private presetRanges;
    private presetCategories;
    private inputRef;
    private memoizedPresets;
    connectedCallback(): void;
    private setupEventHandlers;
    disconnectedCallback(): void;
    updated(changedProps: PropertyValues): void;
    private initPresetRanges;
    private getDateFormat;
    /**
     * Creates a concise display format for the selected date range
     */
    private updateSelectedDateRange;
    private setDateRange;
    private handlePresetSelection;
    private toggleDropdown;
    private openDropdown;
    private closeDropdown;
    /**
     * Helper method to safely add/subtract quarter values
     */
    private adjustQuarter;
    /**
     * Shifts the date range based on its type (preset or custom)
     * Enhanced to properly handle various time units and preserve date patterns
     */
    private shiftDateRange;
    /**
     * Handle keyboard navigation for accessibility
     */
    private handleKeyboardNavigation;
    /**
     * Checks if the current date range matches any predefined preset,
     * and updates the activePreset accordingly
     */
    private checkAndUpdateActivePreset;
    private applyManualDateSelection;
    /**
     * Check if view is mobile
     */
    private checkMobileView;
    /**
     * Handle direct text input
     */
    private handleDirectInput;
    /**
     * Parse typed date range
     */
    private parseTypedDateRange;
    /**
     * Handle input blur to parse typed dates
     */
    private handleInputBlur;
    /**
     * Create dialog content
     */
    private createDialogContent;
    /**
     * Announce messages to screen readers
     */
    private announceToScreenReader;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
