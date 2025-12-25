import { OperatorFunction, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type {
  Punch,
  AttendanceRecord,
  ProcessedAttendanceRecord,
  AttendancePunch,
  Employee,
  Shift
} from '../types/index';
// Functions moved to this file from attendance-hours.ts
import { SHIFT_CONFIG } from '../config/shift.config';
import { normalizeNgtecoDate } from '../../utils/ngteco-date-normalizer';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export interface ShiftConfig {
  shiftStartHour?: number;
  duplicatePunchThresholdMinutes?: number;
}

/**
 * Converts various input formats (Map, Array, QuerySnapshot) to Punch[]
 * Ensures that all punches have an 'id' field set correctly
 */
export function normalizePunchesSource<T>(): OperatorFunction<T, Punch[]> {
  return pipe(
    map((source: T): Punch[] => {
      // Handle Map<string, Punch> - from FirestoreService.subscribeToCollection()
      // The Map key is the document ID, value is the punch data
      // Ensure ID is always set by using Map key as fallback
      if (source instanceof Map) {
        return Array.from(source.entries()).map(([docId, punch]) => ({
          ...punch,
          id: punch.id || docId  // Use existing id or fallback to Map key (doc ID)
        }));
      }

      // Handle Array<Punch>
      if (Array.isArray(source)) {
        return source as Punch[];
      }

      // Handle Firestore QuerySnapshot (backend)
      if (source && typeof source === 'object' && 'docs' in source) {
        const querySnapshot = source as any;
        return querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as Punch[];
      }

      // Handle plain object with data array
      if (source && typeof source === 'object' && 'data' in source) {
        const obj = source as any;
        if (Array.isArray(obj.data)) {
          return obj.data as Punch[];
        }
      }

      // Fallback to empty array
      return [];
    })
  );
}

/**
 * Filters out punches that have been marked as ignored
 * Ignored punches are excluded from all attendance calculations
 */
export function filterIgnoredPunches(): OperatorFunction<Punch[], Punch[]> {
  return pipe(
    map((punches: Punch[]): Punch[] =>
      punches.filter(punch => !punch.ignored)
    )
  );
}

/**
 * Enriches punches with employee data from employees collection
 * This adds employee_name, first_name, last_name, and department_name at runtime
 */
export function enrichPunchesWithEmployeeData(
  employees: Employee[]
): OperatorFunction<Punch[], Punch[]> {
  return pipe(
    map((punches: Punch[]): Punch[] => {
      // Create employee map for fast lookup
      const employeeMap = new Map<string, Employee>(
        employees.map(emp => [emp.employee_code, emp])
      );
      
      // Enrich each punch with employee data
      return punches.map(punch => {
        const employee = employeeMap.get(punch.employeeId);
        
        // Add employee fields if found, otherwise use empty strings
        return {
          ...punch,
          first_name: employee?.first_name || '',
          last_name: employee?.last_name || '',
          department_name: '',
          iban: employee?.iban || '',
          bic: employee?.bic || '',
          ibanRecipientName: employee?.ibanRecipientName || '',
          paymentType: employee?.paymentType || '',
          hourlyRate: employee?.hourlyRate,
          flatPaymentAmount: employee?.flatPaymentAmount,
          excludeFromTips: employee?.excludeFromTips || false
        };
      });
    })
  );
}

/**
 * Groups punches by employee|date combination
 * Handles both NGTeco punches (att_date + attendance_status) and QR scanner punches (punchTime ISO)
 */
export function groupPunchesByEmployeeDate(): OperatorFunction<Punch[], Map<string, AttendanceRecord>> {
  return pipe(
    map((punches: Punch[]): Map<string, AttendanceRecord> => {
      const grouped = new Map<string, AttendanceRecord>();

      punches.forEach(punch => {
        // Extract date and time - handle both NGTeco and QR scanner formats
        let dateStr: string;
        let punchTimeStr: string;

        if (punch.att_date && punch.attendance_status) {
          // NGTeco format: att_date + attendance_status
          dateStr = normalizeNgtecoDate(punch.att_date);
          punchTimeStr = punch.attendance_status;
        } else if (punch.punchTime || punch.punchTimestampUTC) {
          // QR scanner format: punchTime or punchTimestampUTC is ISO timestamp
          const isoTime = punch.punchTime || punch.punchTimestampUTC;
          const punchMoment = dayjs(isoTime).tz('Europe/Berlin');
          dateStr = punchMoment.format('YYYY-MM-DD');
          punchTimeStr = punchMoment.format('HH:mm:ss');
        } else {
          // Fallback: skip this punch if no valid timestamp
          console.warn('Punch missing date/time fields:', punch.id);
          return;
        }

        const key = `${punch.employeeId}|${dateStr}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            employee_code: punch.employeeId,
            first_name: punch.first_name,
            last_name: punch.last_name,
            date: dateStr,
            department: '',
            iban: punch.iban || '',
            bic: punch.bic || '',
            ibanRecipientName: punch.ibanRecipientName || '',
            paymentType: punch.paymentType || '',
            hourlyRate: punch.hourlyRate,
            flatPaymentAmount: punch.flatPaymentAmount,
            excludeFromTips: punch.excludeFromTips || false,
            punches: []
          });
        }

        const record = grouped.get(key)!;
        record.punches.push({
          id: punch.id,
          punch_time: punchTimeStr,
          punch_from: punch.punch_from,
          punch_date: dateStr,
          ignored: punch.ignored || false
        });
      });

      return grouped;
    })
  );
}

/**
 * Handles shift boundaries (6 AM to 6 AM), moving early morning punches to previous day
 * This matches the logic from ngteco-attendance-fetcher.ts lines 237-342
 */
export function applyShiftBoundaries(
  startDate: string,
  endDate: string,
  shiftConfig?: ShiftConfig
): OperatorFunction<Map<string, AttendanceRecord>, Map<string, AttendanceRecord>> {
  return pipe(
    map((groupedData: Map<string, AttendanceRecord>): Map<string, AttendanceRecord> => {
      const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
      
      // Create a new map to avoid mutating the original
      const processedMap = new Map<string, AttendanceRecord>();
      
      // Process each date in the requested range
      const datesToProcess = [];
      let currentDate = dayjs(startDate);
      const endDateObj = dayjs(endDate);
      
      while (currentDate.isBefore(endDateObj) || currentDate.isSame(endDateObj)) {
        datesToProcess.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
      }
      
      // Get all unique employee codes
      const employeeCodes = new Set<string>();
      groupedData.forEach(record => employeeCodes.add(record.employee_code));
      
      // For each date in the range, collect all punches that belong to that shift
      datesToProcess.forEach(dateStr => {
        const nextDayDate = dayjs(dateStr).add(1, 'day').format('YYYY-MM-DD');
        
        employeeCodes.forEach(empCode => {
          const currentDayKey = `${empCode}|${dateStr}`;
          const nextDayKey = `${empCode}|${nextDayDate}`;
          
          const currentDayRecord = groupedData.get(currentDayKey);
          const nextDayRecord = groupedData.get(nextDayKey);
          
          // Collect all punches for this shift (cutoff hour today to cutoff hour tomorrow)
          const shiftPunches: AttendancePunch[] = [];
          
          // From current day, take punches at cutoff hour or later
          if (currentDayRecord) {
            currentDayRecord.punches.forEach(punch => {
              const [hours] = punch.punch_time.split(':').map(Number);
              if (hours >= shiftCutoffHour) {
                shiftPunches.push(punch);
              }
            });
          }
          
          // From next day, take punches before cutoff hour
          // This is crucial for cross-midnight shifts
          if (nextDayRecord) {
            nextDayRecord.punches.forEach(punch => {
              const [hours] = punch.punch_time.split(':').map(Number);
              if (hours < shiftCutoffHour) {
                shiftPunches.push(punch);
              }
            });
          }
          
          // If we have shift punches, create/update the record for this shift date
          if (shiftPunches.length > 0) {
            // Use existing record data or create new one
            const recordData = currentDayRecord || nextDayRecord;
            if (recordData) {
              processedMap.set(currentDayKey, {
                ...recordData,  // Spread first to preserve all fields
                // Then override specific fields
                date: dateStr,
                punches: shiftPunches
              });
            }
          }
        });
      });
      
      return processedMap;
    })
  );
}

/**
 * Sorts punches considering cross-midnight shifts
 * Early morning punches (before cutoff hour) are treated as end of shift
 */
export function sortPunchesWithCrossMidnight(
  shiftConfig?: ShiftConfig
): OperatorFunction<Map<string, AttendanceRecord>, AttendanceRecord[]> {
  return pipe(
    map((groupedData: Map<string, AttendanceRecord>): AttendanceRecord[] => {
      const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
      
      return Array.from(groupedData.values()).map(record => {
        // Sort punches considering early morning punches are end of shift
        record.punches.sort((a, b) => {
          const timeA = a.punch_time.split(':').map(Number);
          const timeB = b.punch_time.split(':').map(Number);

          // Convert to seconds, treating early morning (before cutoff hour) as end of day
          let secondsA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2];
          let secondsB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2];

          // If before cutoff hour, add 24 hours to make it sort after evening punches
          if (timeA[0] < shiftCutoffHour) secondsA += 24 * 3600;
          if (timeB[0] < shiftCutoffHour) secondsB += 24 * 3600;

          return secondsA - secondsB;
        });
        
        return record;
      });
    })
  );
}

/**
 * Calculates hours using existing functions and converts to ProcessedAttendanceRecord[]
 */
export function calculateHoursAndFinalize(
  startDate: string,
  endDate: string,
  userTimezone = 'Europe/Berlin',
  dataTimezone = 'Europe/Berlin',
  shiftConfig?: ShiftConfig
): OperatorFunction<AttendanceRecord[], ProcessedAttendanceRecord[]> {
  return pipe(
    map((attendanceRecords: AttendanceRecord[]): ProcessedAttendanceRecord[] => {
      return attendanceRecords
        .filter(record => {
          // Only include records within the requested date range AND that have at least one punch
          return record.date >= startDate && 
                 record.date <= endDate && 
                 record.punches && 
                 record.punches.length > 0;
        })
        .map(record => {
          // Calculate total hours using the sophisticated logic
          const totalHours = calculateSingleAttendanceHours(record, userTimezone, dataTimezone, shiftConfig);
          const shifts = calculateAttendanceHoursPerDevice(record, userTimezone, dataTimezone, shiftConfig);

          if (totalHours > 0) {
            // totalHours is included in the returned object below
          }

          return {
            ...record,
            shifts,
            totalHours
          };
        });
    })
  );
}

/**
 * Filters records to specific devices
 */
export function filterToRestaurantDevices(
  restaurantDevices?: string[]
): OperatorFunction<ProcessedAttendanceRecord[], ProcessedAttendanceRecord[]> {
  return pipe(
    map((records: ProcessedAttendanceRecord[]): ProcessedAttendanceRecord[] => {
      if (!restaurantDevices || restaurantDevices.length === 0) {
        return records;
      }

      const filteredRecords = records.map(record => {
        // Filter shifts to restaurant devices
        const filteredShifts = record.shifts.filter(shift => {
          return restaurantDevices.includes(shift.device) ||
                 shift.device.toLowerCase().includes('manual') ||
                 shift.device.startsWith('qr-'); // Include QR scanner punches
        });

        // Recalculate total hours based on filtered shifts
        const totalHours = filteredShifts.reduce((sum, device) =>
          sum + device.hours, 0);

        return {
          ...record,
          shifts: filteredShifts,
          totalHours
        };
      });

      return filteredRecords;
    })
  );
}


/**
 * Main pipeline combining all operators for unified attendance processing
 */
export function unifiedAttendanceProcessingPipeline<T>(
  startDate: string,
  endDate: string,
  userTimezone = 'Europe/Berlin',
  dataTimezone = 'Europe/Berlin',
  shiftConfig?: ShiftConfig
): OperatorFunction<T, ProcessedAttendanceRecord[]> {
  return pipe(
    normalizePunchesSource<T>(),
    groupPunchesByEmployeeDate(),
    applyShiftBoundaries(startDate, endDate, shiftConfig),
    sortPunchesWithCrossMidnight(shiftConfig),
    calculateHoursAndFinalize(startDate, endDate, userTimezone, dataTimezone, shiftConfig)
  );
}

/**
 * Filter by department
 */
export function filterByDepartment(departments: string[]): OperatorFunction<ProcessedAttendanceRecord[], ProcessedAttendanceRecord[]> {
  if (!departments || departments.length === 0) {
    return pipe(map(x => x));
  }
  return pipe(
    map((records: ProcessedAttendanceRecord[]) => 
      records // Department filtering removed
    )
  );
}

/**
 * Filter by attendance status (working/missed/complete)
 */
export function filterByAttendanceStatus(status: 'all' | 'working' | 'missed' | 'complete'): OperatorFunction<ProcessedAttendanceRecord[], ProcessedAttendanceRecord[]> {
  if (status === 'all') {
    return pipe(map(x => x));
  }
  
  return pipe(
    map((records: ProcessedAttendanceRecord[]) => {
      const now = dayjs();
      return records.filter(record => {
        const hasData = record.punches?.length > 0;
        const isToday = dayjs(record.date).isSame(now, 'day');
        const isCurrentlyWorking = hasData && record.punches!.length === 1 && isToday;
        const isMissedCheckout = hasData && record.punches!.length === 1 && !isToday;
        
        switch (status) {
          case 'working': return isCurrentlyWorking;
          case 'missed': return isMissedCheckout;
          case 'complete': return hasData && record.punches!.length > 1;
          default: return true;
        }
      });
    })
  );
}

/**
 * Filter by search keyword with fuzzy matching
 */
export function filterBySearchKeyword(keyword: string): OperatorFunction<ProcessedAttendanceRecord[], ProcessedAttendanceRecord[]> {
  if (!keyword?.trim()) {
    return pipe(map(x => x));
  }
  
  const lowerKeyword = keyword.toLowerCase();
  return pipe(
    map((records: ProcessedAttendanceRecord[]) => 
      records.filter(record => {
        // Simple substring matching for now (similarity function would need to be imported)
        const name = record.first_name?.toLowerCase() || '';
        const code = record.employee_code?.toLowerCase() || '';

        return name.includes(lowerKeyword) ||
               code.includes(lowerKeyword);
      })
    )
  );
}

/**
 * Complete attendance pipeline with all filters
 */
export function completeAttendancePipeline<T>(
  startDate: string,
  endDate: string,
  shiftConfig?: ShiftConfig,
  restaurantDevices?: string[],
  departments?: string[],
  attendanceStatus?: 'all' | 'working' | 'missed' | 'complete',
  searchKeyword?: string,
  employees?: Employee[]
): OperatorFunction<T, ProcessedAttendanceRecord[]> {
  return pipe(
    normalizePunchesSource<T>(),
    // Enrich with employee data if provided
    employees?.length ? enrichPunchesWithEmployeeData(employees) : map((x: Punch[]) => x),
    groupPunchesByEmployeeDate(),
    applyShiftBoundaries(startDate, endDate, shiftConfig),
    sortPunchesWithCrossMidnight(shiftConfig),
    // Hours calculation will filter ignored punches internally
    calculateHoursAndFinalize(startDate, endDate, 'Europe/Berlin', 'Europe/Berlin', shiftConfig),
    restaurantDevices?.length ? filterToRestaurantDevices(restaurantDevices) : map((x: ProcessedAttendanceRecord[]) => x),
    departments?.length ? filterByDepartment(departments) : map((x: ProcessedAttendanceRecord[]) => x),
    attendanceStatus && attendanceStatus !== 'all' ? filterByAttendanceStatus(attendanceStatus) : map((x: ProcessedAttendanceRecord[]) => x),
    searchKeyword ? filterBySearchKeyword(searchKeyword) : map((x: ProcessedAttendanceRecord[]) => x)
  ) as OperatorFunction<T, ProcessedAttendanceRecord[]>;
}

/**
 * Tips-specific pipeline with enrichment
 */
export function tipsAttendanceProcessingPipeline<T>(
  startDate: string,
  endDate: string,
  restaurantDevices?: string[],
  userTimezone = 'Europe/Berlin',
  dataTimezone = 'Europe/Berlin',
  shiftConfig?: ShiftConfig
): OperatorFunction<T, ProcessedAttendanceRecord[]> {
  return pipe(
    unifiedAttendanceProcessingPipeline<T>(startDate, endDate, userTimezone, dataTimezone, shiftConfig),
    filterToRestaurantDevices(restaurantDevices)
  );
}

/**
 * Filter out duplicate/accidental punches from the same device within a short time window
 * This handles cases where employees might punch multiple times by mistake
 * Only filters punches from the SAME device within the threshold (default: from config)
 * Punches from different devices are never filtered as they may indicate location changes
 * @param punches - Array of punches with punch_time, punch_from (device), and optional punch_date
 * @param date - The date of the punches (fallback if punch_date not provided)
 * @param dataTimezone - Timezone of the punch data
 * @param thresholdMinutes - Optional threshold in minutes (uses global default if not provided)
 * @param shiftConfig - Optional restaurant-specific shift configuration
 * @returns Filtered array of punches with duplicates removed
 */
export function filterCloseProximityPunches(
  punches: Array<{ punch_time: string; punch_from: string; punch_date?: string }>,
  date: string,
  dataTimezone: string = 'Europe/Berlin',
  thresholdMinutes?: number,
  shiftConfig?: { shiftStartHour?: number; duplicatePunchThresholdMinutes?: number; defaultShiftHours?: number }
): Array<{ punch_time: string; punch_from: string; punch_date?: string }> {
  if (punches.length <= 1) return punches;

  const filtered = [punches[0]]; // Always keep the first punch

  for (let i = 1; i < punches.length; i++) {
    const currPunch = punches[i];
    let isDuplicate = false;

    // Check against all previously kept punches from the same device
    for (const prevPunch of filtered) {
      // Only filter if from the same device
      if (prevPunch.punch_from !== currPunch.punch_from) {
        continue;
      }

      // Create dayjs objects for comparison - use punch_date when available
      const prevPunchDate = prevPunch.punch_date || date;
      const currPunchDate = currPunch.punch_date || date;

      const prevTime = dayjs.tz(
        `${prevPunchDate} ${prevPunch.punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      let currTime = dayjs.tz(
        `${currPunchDate} ${currPunch.punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      // Only handle cross-midnight scenarios if punch_date is not provided
      if (!currPunch.punch_date) {
        const [prevHour] = prevPunch.punch_time.split(':').map(Number);
        const [currHour] = currPunch.punch_time.split(':').map(Number);

        // Use config value instead of hardcoded 4
        const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
        if (currHour < prevHour || (currHour < shiftCutoffHour && prevHour >= 20)) {
          currTime = currTime.add(1, 'day');
        }
      }

      // Check if within duplicate threshold (use parameter or fall back to config)
      const diffMinutes = Math.abs(currTime.diff(prevTime, 'minute'));
      const threshold = thresholdMinutes ?? SHIFT_CONFIG.DUPLICATE_PUNCH_THRESHOLD_MINUTES;

      if (diffMinutes < threshold) {
        isDuplicate = true;
        break;
      }
    }

    // Only add if not a duplicate
    if (!isDuplicate) {
      filtered.push(currPunch);
    }
  }

  return filtered;
}

/**
 * Detect and group punches into work sessions
 * @param punches - Array of punches (already filtered for proximity) with optional punch_date
 * @param date - The date of the punches (fallback if punch_date not provided)
 * @param dataTimezone - Timezone of the punch data
 * @returns Array of work sessions with start and end times
 */
export function detectWorkSessions(
  punches: Array<{ punch_time: string; punch_from: string; punch_date?: string }>,
  date: string,
  dataTimezone: string = 'Europe/Berlin',
  shiftConfig?: { shiftStartHour?: number; duplicatePunchThresholdMinutes?: number; defaultShiftHours?: number }
): Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> {
  if (punches.length === 0) return [];

  // Single punch - check if it's today
  if (punches.length === 1) {
    const now = dayjs();

    const punchDate = punches[0].punch_date || date;
    const punchDateObj = dayjs.tz(punchDate, 'YYYY-MM-DD', dataTimezone);

    if (punchDateObj.isSame(now.tz(dataTimezone), 'day')) {
      // Today - create session from punch to now
      const punchTime = dayjs.tz(
        `${punchDate} ${punches[0].punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      // Only create session if punch is before now
      if (punchTime.isBefore(now)) {
        return [{ start: punchTime, end: now }];
      }
    }
    // Past date or future punch - no session
    return [];
  }

  // Check if all punches are from the same device
  const allSameDevice = punches.every(p => p.punch_from === punches[0].punch_from);

  // Special handling for consecutive punches from the same device
  if (allSameDevice) {
    // For odd number of punches from same device (3+), use first and last only
    // Note: single punch (1) already handled above
    if (punches.length % 2 !== 0) {
      const firstPunchDate = punches[0].punch_date || date;
      const lastPunchDate = punches[punches.length - 1].punch_date || date;

      const firstPunch = dayjs.tz(
        `${firstPunchDate} ${punches[0].punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      let lastPunch = dayjs.tz(
        `${lastPunchDate} ${punches[punches.length - 1].punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      // Only handle cross-midnight if punch_date is not provided for the last punch
      if (!punches[punches.length - 1].punch_date) {
        const [firstHour] = punches[0].punch_time.split(':').map(Number);
        const [lastHour] = punches[punches.length - 1].punch_time.split(':').map(Number);

        // Use configured shift cutoff hour
        const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
        if (lastHour < firstHour || (lastHour < shiftCutoffHour && firstHour >= 20)) {
          lastPunch = lastPunch.add(1, 'day');
        }
      }

      return [{ start: firstPunch, end: lastPunch }];
    }

    // For even number of punches from same device, process as pairs (multiple shifts)
    const sessions: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> = [];

    for (let i = 0; i < punches.length; i += 2) {
      const startPunchDate = punches[i].punch_date || date;
      const endPunchDate = punches[i + 1].punch_date || date;

      const startPunch = dayjs.tz(
        `${startPunchDate} ${punches[i].punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      let endPunch = dayjs.tz(
        `${endPunchDate} ${punches[i + 1].punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      // Only handle cross-midnight when punch_date is not provided
      if (!punches[i].punch_date || !punches[i + 1].punch_date) {
        const [startHour] = punches[i].punch_time.split(':').map(Number);
        const [endHour] = punches[i + 1].punch_time.split(':').map(Number);

        // Also check if we're crossing from previous pair
        if (i > 0 && !punches[i].punch_date) {
          const [prevEndHour] = punches[i - 1].punch_time.split(':').map(Number);
          // If current start is before previous end, we're in next day
          const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
          if (startHour < prevEndHour || (startHour < shiftCutoffHour && prevEndHour >= 20)) {
            // Both start and end are in next day
            const adjustedStart = startPunch.add(1, 'day');
            const adjustedEnd = endPunch.add(1, 'day');
            sessions.push({ start: adjustedStart, end: adjustedEnd });
            continue;
          }
        }

        // Check if end punch crosses midnight relative to start
        if (!punches[i + 1].punch_date) {
          const endShiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
          if (endHour < startHour || (endHour < endShiftCutoffHour && startHour >= 20)) {
            endPunch = endPunch.add(1, 'day');
          }
        }
      }

      sessions.push({ start: startPunch, end: endPunch });
    }

    return sessions;
  }

  // For punches from different devices, use gap detection
  // For odd number of punches (more than 1), treat as single session using first and last
  if (punches.length % 2 !== 0) {
    // Note: single punch case already handled above, so this is 3+ punches
    const firstPunchDate = punches[0].punch_date || date;
    const lastPunchDate = punches[punches.length - 1].punch_date || date;

    const firstPunch = dayjs.tz(
      `${firstPunchDate} ${punches[0].punch_time}`,
      'YYYY-MM-DD HH:mm:ss',
      dataTimezone
    );

    const lastPunch = dayjs.tz(
      `${lastPunchDate} ${punches[punches.length - 1].punch_time}`,
      'YYYY-MM-DD HH:mm:ss',
      dataTimezone
    );

    return [{ start: firstPunch, end: lastPunch }];
  }

  // For even number of punches from different devices, use gap detection
  // A gap > 15 minutes between an OUT punch and next IN punch indicates separate shifts
  const sessions: Array<{ start: dayjs.Dayjs; end: dayjs.Dayjs }> = [];
  const GAP_THRESHOLD_MINUTES = 15; // Minimum break time to consider as separate shifts

  // Convert all punches to dayjs objects
  const punchTimes = punches.map((punch, index) => {
    // Use punch_date when available, fallback to date parameter
    const punchDate = punch.punch_date || date;
    let punchTime = dayjs.tz(
      `${punchDate} ${punch.punch_time}`,
      'YYYY-MM-DD HH:mm:ss',
      dataTimezone
    );

    // Only handle cross-midnight for subsequent punches when punch_date is not provided
    if (index > 0 && !punch.punch_date) {
      const [prevHour] = punches[index - 1].punch_time.split(':').map(Number);
      const [currHour] = punch.punch_time.split(':').map(Number);

      // Use configured shift cutoff hour
      const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
      if (currHour < prevHour || (currHour < shiftCutoffHour && prevHour >= 20)) {
        punchTime = punchTime.add(1, 'day');
      }
    }

    return punchTime;
  });

  // Process punches in pairs to detect multiple shifts
  // If gap between OUT (odd index) and next IN (even index) > 15 min, it's a new shift
  let sessionStart = 0;

  for (let i = 1; i < punchTimes.length - 1; i += 2) {
    // Check gap between punch i (OUT) and punch i+1 (IN)
    const checkOut = punchTimes[i];
    const nextCheckIn = punchTimes[i + 1];
    const gapMinutes = nextCheckIn.diff(checkOut, 'minute');

    if (gapMinutes > GAP_THRESHOLD_MINUTES) {
      // Significant break found - this indicates separate shifts
      sessions.push({
        start: punchTimes[sessionStart],
        end: punchTimes[i]
      });
      sessionStart = i + 1;
    }
  }

  // Add the last session
  sessions.push({
    start: punchTimes[sessionStart],
    end: punchTimes[punchTimes.length - 1]
  });

  return sessions;
}

/**
 * Check if a single punch before shift start should be considered a checkout from previous day
 * @param attendance - The attendance record
 * @param shiftConfig - Optional shift configuration with shiftStartHour (defaults to 6) and defaultShiftHours (defaults to 8)
 * @returns true if this is a previous day checkout that should be ignored
 */
export function isPreviousDayCheckout(
  attendance: AttendanceRecord,
  shiftConfig?: { shiftStartHour?: number; defaultShiftHours?: number }
): boolean {
  // Only consider single punch records
  if (!attendance.punches || attendance.punches.length !== 1) {
    return false;
  }

  const punchTime = attendance.punches[0].punch_time;
  const [hour] = punchTime.split(':').map(Number);

  // Use configured shift start hour or default to 6 AM
  const shiftStartHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;

  // If punch is before shift start hour, it's likely a checkout from previous day
  return hour < shiftStartHour;
}

/**
 * Calculate hours for a single attendance record
 * @param attendance - Attendance record with punches in Europe/Berlin timezone
 * @param userTimezone - User's timezone for display
 * @param dataTimezone - Timezone of the punch data (default: Europe/Berlin)
 * @param shiftConfig - Optional restaurant-specific shift configuration
 */
export function calculateSingleAttendanceHours(
  attendance: AttendanceRecord,
  userTimezone: string = dayjs.tz.guess(),
  dataTimezone: string = 'Europe/Berlin',
  shiftConfig?: { shiftStartHour?: number; duplicatePunchThresholdMinutes?: number; defaultShiftHours?: number }
): number {
  // Skip if this is a previous day checkout
  if (isPreviousDayCheckout(attendance, shiftConfig)) {
    return 0;
  }

  if (attendance.total_hours) {
    // Return pre-calculated hours (now stored as a number)
    return attendance.total_hours;
  } else if (attendance.punches && attendance.punches.length === 1) {
    // Single punch - check if it's today or a past date
    const now = dayjs().tz(userTimezone);
    const attendanceDate = dayjs.tz(attendance.date, 'YYYY-MM-DD', dataTimezone);

    if (attendanceDate.isSame(now.tz(dataTimezone), 'day')) {
      // Today - employee might still be working
      const punchTime = dayjs.tz(
        `${attendance.date} ${attendance.punches[0].punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      // Convert both to user timezone for calculation
      const punchUserTz = punchTime.tz(userTimezone);
      const nowUserTz = now;

      // Calculate hours from punch time to now
      const hoursWorked = nowUserTz.diff(punchUserTz, 'hour', true);

      // Only count positive hours (punch must be before now)
      return hoursWorked > 0 ? hoursWorked : 0;
    } else {
      // Past date - employee forgot to check out
      return 0;
    }
  } else if (attendance.punches && attendance.punches.length >= 2) {
    // Multiple punches - filter and detect sessions

    // Step 0: Filter out ignored punches first
    const nonIgnoredPunches = attendance.punches.filter(p => !p.ignored);

    // Step 1: Filter out punches that are too close together
    const filteredPunches = filterCloseProximityPunches(
      nonIgnoredPunches,
      attendance.date,
      dataTimezone,
      undefined,
      shiftConfig
    );

    // Step 2: Detect work sessions
    const sessions = detectWorkSessions(
      filteredPunches,
      attendance.date,
      dataTimezone,
      shiftConfig
    );

    // Step 3: Calculate total hours across all sessions
    let totalHours = 0;

    for (const session of sessions) {
      // Convert to user timezone for calculation
      const startUserTz = session.start.tz(userTimezone);
      const endUserTz = session.end.tz(userTimezone);

      const sessionHours = endUserTz.diff(startUserTz, 'hour', true);
      totalHours += sessionHours;
    }

    return totalHours;
  }

  return 0;
}

/**
 * Calculate hours per device/location for a single attendance record
 * Groups consecutive punches by device and calculates hours for each device
 *
 * @param attendance - The attendance record
 * @param userTimezone - The user's timezone (defaults to browser timezone)
 * @param dataTimezone - The timezone of the attendance data (defaults to Europe/Berlin)
 * @param shiftConfig - Optional restaurant-specific shift configuration
 * @returns Array of hours per device
 */
export function calculateAttendanceHoursPerDevice(
  attendance: AttendanceRecord,
  userTimezone: string = dayjs.tz.guess(),
  dataTimezone: string = 'Europe/Berlin',
  shiftConfig?: { shiftStartHour?: number; duplicatePunchThresholdMinutes?: number; defaultShiftHours?: number }
): Shift[] {
  if (!attendance.punches || attendance.punches.length === 0) {
    return [];
  }

  // Skip if this is a previous day checkout
  if (isPreviousDayCheckout(attendance, shiftConfig)) {
    return [];
  }

  // For simplicity when all punches are from the same device,
  // just use the total hours calculated with session detection
  const allSameDevice = attendance.punches.every(
    p => p.punch_from === attendance.punches[0].punch_from
  );

  if (allSameDevice) {
    // Use the same session detection logic as calculateSingleAttendanceHours
    const totalHours = calculateSingleAttendanceHours(attendance, userTimezone, dataTimezone, shiftConfig);

    return [{
      device: attendance.punches[0].punch_from,
      hours: totalHours,
      punches: attendance.punches
    }];
  }

  // Special case: exactly 2 punches from different devices (common with manual corrections)
  // Treat as a single session check-in/check-out
  // Always attribute hours to the first device (check-in device) and 0 to second
  // This matches the employee-view behavior
  if (attendance.punches.length === 2 &&
      attendance.punches[0].punch_from !== attendance.punches[1].punch_from) {
    const totalHours = calculateSingleAttendanceHours(attendance, userTimezone, dataTimezone, shiftConfig);

    // Return hours for first device, 0 for second (matching employee-view logic)
    return [
      {
        device: attendance.punches[0].punch_from,
        hours: totalHours,
        punches: [attendance.punches[0]]
      },
      {
        device: attendance.punches[1].punch_from,
        hours: 0,
        punches: [attendance.punches[1]]
      }
    ];
  }

  // If punches are from different devices (3+ punches), we need more complex logic
  // First, filter out ignored punches
  const nonIgnoredPunches = attendance.punches.filter(p => !p.ignored);

  // Then filter and detect sessions for the entire attendance
  const filteredPunches = filterCloseProximityPunches(
    nonIgnoredPunches,
    attendance.date,
    dataTimezone,
    undefined,
    shiftConfig
  );

  const sessions = detectWorkSessions(
    filteredPunches,
    attendance.date,
    dataTimezone,
    shiftConfig
  );

  // Now distribute the session hours to devices
  const shiftsMap = new Map<string, Shift>();

  // For each session, determine which device(s) were used
  sessions.forEach(session => {
    // Find punches within this session timeframe
    const sessionPunches = filteredPunches.filter((punch, index) => {
      const punchDate = punch.punch_date || attendance.date;
      const punchTime = dayjs.tz(
        `${punchDate} ${punch.punch_time}`,
        'YYYY-MM-DD HH:mm:ss',
        dataTimezone
      );

      // Handle cross-midnight for comparison only when punch_date is not provided
      let adjustedPunchTime = punchTime;
      if (index > 0 && !punch.punch_date) {
        const [prevHour] = filteredPunches[index - 1].punch_time.split(':').map(Number);
        const [currHour] = punch.punch_time.split(':').map(Number);
        // Use configured shift cutoff hour
        const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
        if (currHour < prevHour || (currHour < shiftCutoffHour && prevHour >= 20)) {
          adjustedPunchTime = punchTime.add(1, 'day');
        }
      }

      return adjustedPunchTime.isSameOrAfter(session.start) &&
             adjustedPunchTime.isSameOrBefore(session.end);
    });

    if (sessionPunches.length > 0) {
      // Group consecutive punches by device within this session
      let i = 0;
      while (i < sessionPunches.length) {
        const currentDevice = sessionPunches[i].punch_from;
        const deviceSessionPunches = [];

        // Collect consecutive punches from the same device
        while (i < sessionPunches.length && sessionPunches[i].punch_from === currentDevice) {
          deviceSessionPunches.push(sessionPunches[i]);
          i++;
        }

        // Calculate hours for this device segment
        let segmentHours = 0;

        if (deviceSessionPunches.length === 1) {
          // Single punch - determine end time
          const punchDate = deviceSessionPunches[0].punch_date || attendance.date;
          const punchTime = dayjs.tz(
            `${punchDate} ${deviceSessionPunches[0].punch_time}`,
            'YYYY-MM-DD HH:mm:ss',
            dataTimezone
          );

          // Adjust for cross-midnight if needed (only when punch_date is not provided)
          let adjustedPunchTime = punchTime;
          const punchIndex = filteredPunches.indexOf(deviceSessionPunches[0]);
          if (punchIndex > 0 && !deviceSessionPunches[0].punch_date) {
            const [prevHour] = filteredPunches[punchIndex - 1].punch_time.split(':').map(Number);
            const [currHour] = deviceSessionPunches[0].punch_time.split(':').map(Number);
            const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
            if (currHour < prevHour || (currHour < shiftCutoffHour && prevHour >= 20)) {
              adjustedPunchTime = punchTime.add(1, 'day');
            }
          }

          // End time is either next punch or session end
          let endTime: dayjs.Dayjs;
          if (i < sessionPunches.length) {
            // There's a next punch (different device)
            const nextPunchDate = sessionPunches[i].punch_date || attendance.date;
            const nextPunchTime = dayjs.tz(
              `${nextPunchDate} ${sessionPunches[i].punch_time}`,
              'YYYY-MM-DD HH:mm:ss',
              dataTimezone
            );

            // Adjust for cross-midnight (only when punch_date is not provided)
            let adjustedNextTime = nextPunchTime;
            const nextIndex = filteredPunches.indexOf(sessionPunches[i]);
            if (nextIndex > 0 && !sessionPunches[i].punch_date) {
              const [prevHour] = filteredPunches[nextIndex - 1].punch_time.split(':').map(Number);
              const [currHour] = sessionPunches[i].punch_time.split(':').map(Number);
              // Use configured shift cutoff hour
              const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
              if (currHour < prevHour || (currHour < shiftCutoffHour && prevHour >= 20)) {
                adjustedNextTime = nextPunchTime.add(1, 'day');
              }
            }

            endTime = adjustedNextTime.tz(userTimezone);
          } else {
            // Last punch in session - use session end
            endTime = session.end.tz(userTimezone);
          }

          const startTime = adjustedPunchTime.tz(userTimezone);
          segmentHours = endTime.diff(startTime, 'hour', true);
        } else {
          // Multiple punches from same device - use first to last
          const firstPunchDate = deviceSessionPunches[0].punch_date || attendance.date;
          const lastPunchDate = deviceSessionPunches[deviceSessionPunches.length - 1].punch_date || attendance.date;

          const firstPunchTime = dayjs.tz(
            `${firstPunchDate} ${deviceSessionPunches[0].punch_time}`,
            'YYYY-MM-DD HH:mm:ss',
            dataTimezone
          );
          const lastPunchTime = dayjs.tz(
            `${lastPunchDate} ${deviceSessionPunches[deviceSessionPunches.length - 1].punch_time}`,
            'YYYY-MM-DD HH:mm:ss',
            dataTimezone
          );

          // Adjust for cross-midnight (only when punch_date is not provided)
          let adjustedFirstTime = firstPunchTime;
          let adjustedLastTime = lastPunchTime;

          const firstIndex = filteredPunches.indexOf(deviceSessionPunches[0]);
          if (firstIndex > 0 && !deviceSessionPunches[0].punch_date) {
            const [prevHour] = filteredPunches[firstIndex - 1].punch_time.split(':').map(Number);
            const [currHour] = deviceSessionPunches[0].punch_time.split(':').map(Number);
            const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
            if (currHour < prevHour || (currHour < shiftCutoffHour && prevHour >= 20)) {
              adjustedFirstTime = firstPunchTime.add(1, 'day');
            }
          }

          const lastIndex = filteredPunches.indexOf(deviceSessionPunches[deviceSessionPunches.length - 1]);
          if (lastIndex > firstIndex && !deviceSessionPunches[deviceSessionPunches.length - 1].punch_date) {
            const [firstHour] = deviceSessionPunches[0].punch_time.split(':').map(Number);
            const [lastHour] = deviceSessionPunches[deviceSessionPunches.length - 1].punch_time.split(':').map(Number);
            // Use configured shift cutoff hour
            const shiftCutoffHour = shiftConfig?.shiftStartHour ?? SHIFT_CONFIG.SHIFT_CUTOFF_HOUR;
            if (lastHour < firstHour || (lastHour < shiftCutoffHour && firstHour >= 20)) {
              adjustedLastTime = lastPunchTime.add(1, 'day');
            }
          }

          const startTime = adjustedFirstTime.tz(userTimezone);
          const endTime = adjustedLastTime.tz(userTimezone);
          segmentHours = endTime.diff(startTime, 'hour', true);
        }

        // Add to device hours
        const existing = shiftsMap.get(currentDevice);
        if (existing) {
          existing.hours += segmentHours;
          existing.punches.push(...deviceSessionPunches);
        } else {
          shiftsMap.set(currentDevice, {
            device: currentDevice,
            hours: segmentHours,
            punches: deviceSessionPunches
          });
        }
      }
    }
  });

  return Array.from(shiftsMap.values());
}
