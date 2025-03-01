import SchmancyMenu from '@schmancy/menu/menu';
import dayjs from 'dayjs';
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
        step: dayjs.OpUnitType;
    }>;
    connectedCallback(): void;
    /**
     * Update the internal date range and fire a 'change' event to notify external code.
     */
    private setDateRange;
    updated(changedProps: Map<string, unknown>): void;
    /**
     * Format strings for the internal <input> and for display text.
     */
    private getDateFormat;
    private getDisplayFormat;
    /**
     * Build up a list of preset ranges (yesterday, today, etc.).
     */
    private initPresetRanges;
    /**
     * Based on the current dateFrom/dateTo, see if it matches a preset.
     * Otherwise display a "Custom" range: "Jan 01, 2023 - Jan 07, 2023".
     */
    private updateSelectedDateRange;
    private handlePresetChange;
    /**
     * Shift the current date range forward or backward by the same number of days.
     * If the range is 7 days wide, shift 7 days, etc.
     */
    private shiftDateRange;
    /**
     * Applies the date range from the inputs.
     * Closes the menu when done.
     */
    private handleDateRangeChange;
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
