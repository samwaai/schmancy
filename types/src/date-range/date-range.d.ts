import SchmancyMenu from '@schmancy/menu/menu';
import moment from 'moment';
declare const SchmancyDateRange_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A date range selector that supports presets and manual date input.
 */
export default class SchmancyDateRange extends SchmancyDateRange_base {
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
    checkInInput: HTMLInputElement;
    checkOutInput: HTMLInputElement;
    schmancyMenu: SchmancyMenu;
    selectedDateRange: string;
    presetRanges: Array<{
        label: string;
        range: {
            dateFrom: string;
            dateTo: string;
        };
        step: moment.unitOfTime.DurationConstructor;
        selected?: boolean;
    }>;
    connectedCallback(): void;
    updated(changedProps: Map<string, unknown>): void;
    /**
     * Returns the date format string based on the current type.
     */
    private getDateFormat;
    /**
     * Returns the display format for showing dates.
     */
    private getDisplayFormat;
    /**
     * Initializes the preset date ranges.
     */
    private initPresetRanges;
    /**
     * Updates the selectedDateRange state based on the current dateFrom and dateTo values.
     */
    private updateSelectedDateRange;
    /**
     * Updates the internal date range state and dispatches a change event.
     */
    setDateRange(fromDate: string, toDate: string): void;
    /**
     * Called when a preset is selected. Updates the date range and closes the menu.
     */
    handlePresetChange(presetLabel: string): void;
    /**
     * Called when the user applies a manual date change.
     */
    handleDateRangeChange(): void;
    /**
     * Shifts the current date range by multiplying the range length with the given factor.
     * Use a negative factor to shift backward.
     */
    private shiftDateRange;
    render(): import("lit-html").TemplateResult<1>;
}
/**
 * The payload for a date range change event.
 */
export type TSchmancDateRangePayload = {
    dateFrom?: string;
    dateTo?: string;
};
/**
 * A custom event fired when the date range is updated.
 */
export type SchmancyDateRangeChangeEvent = CustomEvent<TSchmancDateRangePayload>;
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-date-range': SchmancyDateRange;
    }
}
export {};
