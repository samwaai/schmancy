// Organization NGTeco Employee CRUD API Types
import type { NGTecoEmployeeRequest } from '../../../melanie/types/ngteco.types';

// Create Employee
export interface OrganizationNgtecoEmployeeCreateRequest {
  orgId: string;
  employeeData: NGTecoEmployeeRequest;
}

export interface OrganizationNgtecoEmployeeCreateResponse {
  status: number;
  code: string;
  message: string;
  data?: any;
}

// Update Employee
export interface OrganizationNgtecoEmployeeUpdateRequest {
  orgId: string;
  employeeId: string;
  employeeData: Partial<NGTecoEmployeeRequest>;
}

export interface OrganizationNgtecoEmployeeUpdateResponse {
  status: number;
  code: string;
  message: string;
  data?: any;
}

// Delete Employee
export interface OrganizationNgtecoEmployeeDeleteRequest {
  orgId: string;
  employeeId: string;
}

export interface OrganizationNgtecoEmployeeDeleteResponse {
  status: number;
  code: string;
  message: string;
  data?: any;
}

// Get Single Employee
export interface OrganizationNgtecoEmployeeGetRequest {
  orgId: string;
  employeeId: string;
}

export interface OrganizationNgtecoEmployeeGetResponse {
  status: number;
  code: string;
  message: string;
  data?: {
    department_code: string;
    department_name: string;
    designation_code: string;
    designation_name: string;
    id: string;
    fullName: string;
    name: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    departmentIdOrCode: string;
    designationIdOrCode: string;
    email: string | null;
    group: string | null;
    credentialCount: {
      fingerPrint: number;
      face: number;
      card: number;
      passcode: number;
      [key: string]: number;
    };
    role: string;
    employee_id: string;
  };
}