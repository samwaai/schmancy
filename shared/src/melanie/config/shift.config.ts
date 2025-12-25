/**
 * Global Shift Management Configuration
 * Default configuration for shift processing and scheduling rules
 * These values are used when business-specific configuration is not provided
 * This is a pure object that can be stored in database later
 */

export const SHIFT_CONFIG = {
  /**
   * Default shift start hour (0-23)
   * Determines when a work shift begins and the previous one ends
   * 
   * A shift runs from SHIFT_CUTOFF_HOUR on Day X to (SHIFT_CUTOFF_HOUR - 1):59 on Day X+1
   * Example: If set to 6, shift runs from 6:00 AM to 5:59 AM next day
   * 
   * This can be overridden per business in Business.shiftConfig.shiftStartHour
   */
  SHIFT_CUTOFF_HOUR: 6, // 6 AM default
  
  /**
   * Default duplicate punch threshold in minutes
   * Punches from the same device within this time window are considered duplicates
   * and only the first punch is kept
   * 
   * This can be overridden per business in Business.shiftConfig.duplicatePunchThresholdMinutes
   */
  DUPLICATE_PUNCH_THRESHOLD_MINUTES: 15,
  
  /**
   * Future global defaults can include:
   * - DEFAULT_BREAK_DURATION_MINUTES: 30
   * - DEFAULT_OVERTIME_THRESHOLD_HOURS: 8
   * - DEFAULT_NIGHT_SHIFT_DIFFERENTIAL: 1.5
   */
} as const;
