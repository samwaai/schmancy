import { PropertyValues } from 'lit';
import './date-range-dialog';
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
    step?: 'day' | 'week' | 'month' | 'year' | number;
    private isOpen;
    private selectedDateRange;
    private activePreset;
    private announceMessage;
    private isMobile;
    private presetRanges;
    private presetCategories;
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
    private toggleDropdown;
    private openDropdown;
    private closeDropdown;
    /**
     * Shifts the date range based on the step property
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
    /**
     * Check if view is mobile
     */
    private checkMobileView;
    /**
     * Check if we can navigate backward
     */
    private canNavigateBackward;
    /**
     * Check if we can navigate forward
     */
    private canNavigateForward;
    /**
     * Announce messages to screen readers
     */
    private announceToScreenReader;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
