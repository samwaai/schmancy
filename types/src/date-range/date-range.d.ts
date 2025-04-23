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
    private isOpen;
    private selectedDateRange;
    private activePreset;
    private presetRanges;
    private triggerRef;
    private dropdownRef;
    private cleanupPositioner?;
    connectedCallback(): void;
    private setupEventHandlers;
    disconnectedCallback(): void;
    updated(changedProps: PropertyValues): void;
    private setupDropdownPosition;
    private initPresetRanges;
    private getDateFormat;
    /**
     * Creates a concise display format for the selected date range
     */
    private updateSelectedDateRange;
    private setDateRange;
    private handlePresetSelection;
    private handleClearSelection;
    private toggleDropdown;
    private openDropdown;
    private closeDropdown;
    /**
     * Shifts the date range based on its type (preset or custom)
     * Improved to respect the unit (day, week, month) of presets
     * For custom ranges, it shifts by the exact range duration
     */
    private shiftDateRange;
    /**
     * Checks if the current date range matches any predefined preset,
     * and updates the activePreset accordingly
     */
    private checkAndUpdateActivePreset;
    private applyManualDateSelection;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
