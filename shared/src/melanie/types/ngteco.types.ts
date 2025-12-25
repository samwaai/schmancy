// NGTeco Attendance API Response Types
export interface NGTecoAttendanceItem {
  employee_code: string;
  employee_name: string;
  first_name: string;
  last_name: string;
  employee_updated_at: string;
  department_code: string;
  department_name: string;
  designation_code: string;
  designation_name: string;
  att_date: string; // e.g. "2025-01-31 "
  attendance_status: string; // e.g. "11:22:56"
  timezone: string; // e.g. "+01:00"
  punch_from: string; // e.g. "NMR2242100913"
  id: string;
}

export interface NGTecoAttendanceApiResponse {
  status: number;
  code: string;
  message: string;
  data: {
    total: number;
    num_pages: number;
    page: number;
    page_size: number;
    data: NGTecoAttendanceItem[];
  };
}

// NGTeco Employee data structure
export interface NGTecoEmployee {
  id: string;
  employee_id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  email: string | null;
  department_code: string;
  department_name: string;
  designation_code: string;
  designation_name: string;
  role: string;
  credentialCount: {
    fingerPrint: number;
    face: number;
    card: number;
    passcode: number;
    [key: string]: number;
  };
}

export interface NGTecoEmployeesApiResponse {
  success: boolean;
  data?: {
    total: number;
    page: number;
    num_pages: number;
    page_size: number;
    data: NGTecoEmployee[];
  };
  message?: string;
}

export interface NGTecoEmployeeRequest {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentIdOrCode: string;
  dept: {
    id: string;
    name: string;
    code?: string;
    created_at?: string;
    update_at?: string;
  };
  oldData?: {
    firstName: string;
    lastName: string;
    email: string | null;
    dept: {
      id: string;
      name: string;
    };
  };
}

export interface NGTecoEmployeeResponse {
  status: number;
  code: string;
  message: string;
  data: {
    employee_id: string;
  };
}

export interface NGTecoDeletePersonRequest {
  personId: string;
}

export interface NGTecoDeletePersonResponse {
  status: number;
  code: string;
  message: string;
  data: null;
}


export interface NGTecoAuthHeaders {
  Authorization: string;
  'Content-Type': string;
  'Accept': string;
  'Accessor': string;
  'Timezone': string;
  'sec-ch-ua': string;
  'sec-ch-ua-mobile': string;
  'sec-ch-ua-platform': string;
  'User-Agent': string;
  'Referer': string;
}

// =============================================================================
// Raw Punch Data (extends NGTecoAttendanceItem with employee field)
// =============================================================================

/** Raw punch data as received from NGTeco API */
export interface RawPunchData extends NGTecoAttendanceItem {
  employee: string; // NGTeco employee ID
}

// =============================================================================
// NGTeco Configuration API Types
// =============================================================================

export interface GetNgtecoDefaultCompanyRequest {
  username: string;
  password: string;
}

export interface GetNgtecoDefaultCompanyResponse {
  success: boolean;
  companyId?: string;
  message?: string;
}

export interface SaveNgtecoPrivateConfigRequest {
  organizationId: string;
  username: string;
  password: string;
  companyId: string;
}

export interface SaveNgtecoPrivateConfigResponse {
  success: boolean;
  message: string;
}

export interface TestNgtecoConnectionRequest {
  organizationId: string;
}

export interface TestNgtecoConnectionResponse {
  success: boolean;
  message: string;
}

export interface ClearNgtecoConfigRequest {
  organizationId: string;
}

export interface ClearNgtecoConfigResponse {
  success: boolean;
  message: string;
}

export interface UpdateNgtecoConfigurationRequest {
  organizationId: string;
  companyId?: string;
  selectedDevices: string[];
  selectedDepartments: string[];
}

export interface UpdateNgtecoConfigurationResponse {
  success: boolean;
  message: string;
}