import { PresetCategory } from './date-range-presets';
declare const SchmancyDateRangeDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Dialog content component for date range selection
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
    private handleFromDateChange;
    private handleToDateChange;
    private handlePresetSelection;
    private applyManualDateSelection;
    render(): any;
}
export {};
