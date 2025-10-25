import dayjs from 'dayjs';
export type PresetUnit = dayjs.OpUnitType | 'quarter';
export interface DateRangePreset {
    label: string;
    range: {
        dateFrom: string;
        dateTo: string;
    };
    step: PresetUnit;
}
export interface PresetCategory {
    name: string;
    presets: DateRangePreset[];
}
/**
 * Generate date range presets for different time periods
 */
export declare function generatePresetCategories(format: string, includeTime?: boolean): PresetCategory[];
