// Organization NGTeco Employees API Types

export interface OrganizationNgtecoEmployeesRequest {
  orgId: string;
  page?: string;
  pageSize?: string;
  keyword?: string;
  departments?: string; // Comma-separated department IDs to filter employees
}

export interface OrganizationNgtecoEmployeesResponse {
  success: boolean;
  data?: {
    total: number;
    page: number;
    num_pages: number;
    page_size: number;
    data: Array<{
      id: string; // NGTeco's internal ID
      employeeCode: string; // Employee code for matching
      firstName: string;
      lastName: string;
      fullName: string;
      email: string | null;
      department_code: string;
      department_name: string;
      credentialCount: {
        fingerPrint: number;
        face: number;
      };
    }>;
  };
  error?: string;
  details?: string;
}

// Alignment API Types
export interface OrganizationNgtecoEmployeesAlignRequest {
  orgId: string;
  dryRun?: boolean;
  forceResync?: boolean;
}

export interface OrganizationNgtecoEmployeesAlignResponse {
  success: boolean;
  dryRun: boolean;
  summary: {
    totalNgtecoEmployees: number;
    totalFirebaseEmployees: number;
    toSync: number;
    toRemove: number;
    toAddBack: number;
    withoutCode: number;
  };
  details?: {
    toSync: Array<{ id: string; name: string; code: string }>;
    toRemove: Array<{ id: string; name: string; code: string }>;
    toAddBack: Array<{ id: string; name: string; code: string }>;
  };
  results?: {
    synced: number;
    removed: number;
    addedBack: number;
    failed: number;
  };
}