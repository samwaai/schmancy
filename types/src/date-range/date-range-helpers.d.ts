import dayjs from 'dayjs';
import { PresetUnit } from './date-range-presets';
/**
 * Format a date range into a human-readable string
 */
export declare function formatDateRange(fromValue: string, toValue: string, type: 'date' | 'datetime-local', placeholder: string): string;
/**
 * Detect the type of date range (full month, full quarter, etc.)
 */
export interface DateRangeType {
    isFullMonth: boolean;
    isFullQuarter: boolean;
    isFullYear: boolean;
    isFullWeek: boolean;
}
export declare function detectDateRangeType(fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs): DateRangeType;
/**
 * Calculate the appropriate shift unit and amount for a date range
 */
export declare function calculateShiftParams(fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs, activePresetStep?: PresetUnit): {
    unit: PresetUnit;
    amount: number;
};
/**
 * Helper method to safely add/subtract quarter values
 */
export declare function adjustQuarter(date: dayjs.Dayjs, amount: number, direction: 1 | -1): dayjs.Dayjs;
