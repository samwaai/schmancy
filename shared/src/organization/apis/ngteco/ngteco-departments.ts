// NGTeco Departments API interfaces for Organization
import type { NGTecoDepartmentRequest } from '../../../melanie/types/department.types';

// GET (List Departments)
export interface OrganizationNgtecoDepartmentsListRequest {
  orgId: string;
  current?: string;
  pageSize?: string;
  keyword?: string;
}

export interface OrganizationNgtecoDepartmentsListResponse {
  success?: boolean;
  status: number;
  code: string;
  message: string;
  data: {
    pageInfo: {
      totalCount: number;
      currentPage: number;
      pageSize: number;
    };
    data: {
      id: string;
      name: string;
      code?: string;
      created_at?: string;
      update_at?: string;
    }[];
  };
  error?: string;
  details?: any;
}

// POST (Create Department)
export interface OrganizationNgtecoDepartmentCreateRequest {
  orgId: string;
  departmentData: NGTecoDepartmentRequest;
}

export interface OrganizationNgtecoDepartmentCreateResponse {
  success?: boolean;
  status: number;
  code: string;
  message: string;
  data: {
    name: string;
    code: string;
  };
  error?: string;
  details?: any;
}