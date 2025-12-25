// Base properties shared by all tips groups
export interface BaseTipsGroup {
  id: string;
  name: string;
  parentId?: string;
  employeeDistribution: 'by_hours' | 'equal';
  professionIds: string[]; // Use profession IDs instead of names
  fallbackGroupId?: string; // Group to receive unallocated tips if this group has no employees
}

// Fixed percentage group
export interface FixedPercentageGroup extends BaseTipsGroup {
  type: 'fixed';
  percentage: number;
}

// Category-based group
export interface CategoryBasedGroup extends BaseTipsGroup {
  type: 'category';
  categories: string[];
}

// Union type for tips groups
export type TipsGroup = FixedPercentageGroup | CategoryBasedGroup;

/**
 * Business entity type - represents any business that manages employees and shifts
 * This is a more generic version of the Restaurant type
 */
export interface Business {
  id?: string;
  name: string;
  orgId?: string; // Organization ID for multi-tenancy support

  // Business type (defaults to "restaurant" for migrated data)
  type?: "restaurant" | "retail" | "service" | "events" | "other";

  // Attendance tracking device configuration
  attendanceDevices?: Array<{
    source: 'ngteco' | 'qr';  // Device type/source (ngteco hardware or QR code)
    deviceId: string;  // Device serial number or QR station ID
  }>;

  // POS terminal configuration
  posIds?: string[]; // List of POS terminal IDs for this business (empty = all)

  // Shift management configuration
  shiftConfig?: {
    // Shift boundary configuration
    // Defines when a work shift starts and ends
    // Example: If set to 6, shift runs from 6:00 AM to 5:59 AM next day
    shiftStartHour?: number; // Hour when shift starts (0-23), defaults to SHIFT_CONFIG.SHIFT_CUTOFF_HOUR

    // Duplicate punch filtering
    // Punches from the same device within this time window are considered duplicates
    duplicatePunchThresholdMinutes?: number; // Defaults to SHIFT_CONFIG.DUPLICATE_PUNCH_THRESHOLD_MINUTES

    // Future configurations can include:
    // - Multiple shift patterns (morning, evening, night)
    // - Break time rules
    // - Overtime thresholds
    // - Weekend/holiday shift rules
  };

  // Tips distribution system (post-migration structure)
  // Uses discriminated union for type-safe distribution configuration
  tipsDistribution?: {
    [groupId: string]: TipsGroup;
  };

  // Department-specific configurations
  departmentConfig?: {
    [department: string]: {
      categories?: string[]; // Product/service categories
      roles?: string[]; // Employee roles/professions
      customRules?: any; // Department-specific rules
    };
  };

  // Business type and metadata
  businessType?:
    | "restaurant"
    | "retail"
    | "hospitality"
    | "manufacturing"
    | "service"
    | "other";
  industry?: string;
  timezone?: string; // Business timezone, defaults to system timezone
  currency?: string; // Currency code (e.g., 'EUR', 'USD')

  createdAt?: Date;
  updatedAt?: Date;
}

