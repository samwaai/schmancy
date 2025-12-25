import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with timezone plugin
dayjs.extend(timezone);

/**
 * Get list of common timezones for the selector
 */
export function getCommonTimezones() {
  return [
    { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
    { value: 'Europe/London', label: 'London (UTC+0)' },
    { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
    { value: 'Europe/Rome', label: 'Rome (UTC+1)' },
    { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (UTC+8)' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+11)' },
  ];
}

/**
 * Get user's browser timezone
 */
export function getUserTimezone(): string {
  return dayjs.tz.guess();
}