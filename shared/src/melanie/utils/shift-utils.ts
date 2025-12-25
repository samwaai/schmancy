import dayjs from 'dayjs';
import { SHIFT_CONFIG } from '../config/shift.config';

/**
 * Check if the shift period for a given date is still active
 * Shift runs from shiftStartHour on date to shiftStartHour on date+1
 * e.g., for 6 AM shift, 2025-12-18 shift runs from 2025-12-18 06:00 to 2025-12-19 06:00
 *
 * @param date - The date string in YYYY-MM-DD format
 * @param shiftStartHour - The hour when the shift starts/ends (default: 6 AM from SHIFT_CONFIG)
 * @returns true if the current time is before the shift end time
 */
export function isShiftStillActive(date: string, shiftStartHour: number = SHIFT_CONFIG.SHIFT_CUTOFF_HOUR): boolean {
  const now = dayjs();
  const recordDate = dayjs(date);
  const shiftEndTime = recordDate.add(1, 'day').hour(shiftStartHour).minute(0).second(0);
  return now.isBefore(shiftEndTime);
}

/**
 * Check if attendance record indicates missed checkout
 * Uses shift-aware logic: missed only if shift period has ended
 *
 * @param record - Object with date and punches array
 * @param shiftStartHour - The hour when the shift starts/ends (optional, uses default from SHIFT_CONFIG)
 * @returns true if the record has exactly 1 punch and the shift period has ended
 */
export function isMissedCheckout(record: { date: string; punches?: any[] }, shiftStartHour?: number): boolean {
  const hasData = record.punches && record.punches.length > 0;
  return hasData && record.punches!.length === 1 && !isShiftStillActive(record.date, shiftStartHour);
}

/**
 * Check if employee is still working
 * Uses shift-aware logic: working if shift period is still active
 *
 * @param record - Object with date and punches array
 * @param shiftStartHour - The hour when the shift starts/ends (optional, uses default from SHIFT_CONFIG)
 * @returns true if the record has exactly 1 punch and the shift period is still active
 */
export function isStillWorking(record: { date: string; punches?: any[] }, shiftStartHour?: number): boolean {
  const hasData = record.punches && record.punches.length > 0;
  return hasData && record.punches!.length === 1 && isShiftStillActive(record.date, shiftStartHour);
}
