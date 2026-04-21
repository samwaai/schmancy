import dayjs from 'dayjs';
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
