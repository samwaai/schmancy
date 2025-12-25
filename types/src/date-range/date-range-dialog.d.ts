import { PresetCategory } from './date-range-presets';
declare const SchmancyDateRangeDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Dialog content component for date range selection
 *
 * Redesigned with chip-based horizontal flow layout:
 * - Quick Select: Today, Yesterday, This Week, This Month
 * - Days: Last 7/14/30/60/90 Days
 * - Periods: Last Week, Last Month, Last Quarter, Last Year
 * - Year to Date: This Week, This Month, This Quarter, This Year, YTD
 * - Custom Range: Manual date inputs at the bottom
 *
 * @element schmancy-date-range-dialog
 */
export declare class SchmancyDateRangeDialog extends SchmancyDateRangeDialog_base {
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
    activePreset: string | null;
    presetCategories: PresetCategory[];
    /**
     * Reorganizes presets into the new grouped layout
     */
    private getPresetGroups;
    private handleFromDateChange;
    private handleToDateChange;
    private handlePresetSelection;
    private applyManualDateSelection;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-date-range-dialog': SchmancyDateRangeDialog;
    }
}
export {};
