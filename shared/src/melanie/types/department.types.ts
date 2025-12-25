// Department types for the application
// These types consolidate all department-related interfaces

// Core Department entity
export interface Department {
  id: string;
  name: string;
  code?: string; // Made optional as it may not always be present
  createdAt?: string;
  updatedAt?: string;
}

// API Request/Response types for fetching departments
export interface GetDepartmentsRequest {
  current?: number;
  pageSize?: number;
  keyword?: string;
}

export interface GetDepartmentsResponse {
  status: number;
  code: string;
  message: string;
  data: {
    pageInfo: {
      totalCount: number;
      currentPage: number;
      pageSize: number;
    };
    data: Department[];
  };
}

// API Request/Response types for creating departments
export interface CreateDepartmentRequest {
  code: string;
  name: string;
}

export interface CreateDepartmentResponse {
  status: number;
  code: string;
  message: string;
  data: {
    name: string;
    code: string;
  };
}

// NGTeco-specific department types (for external API integration)
export interface NGTecoDepartment {
  id: string;
  name: string;
  code?: string;
  created_at?: string;
  update_at?: string;
}

export interface NGTecoDepartmentRequest {
  code: string;
  name: string;
}

export interface NGTecoDepartmentResponse {
  status: number;
  code: string;
  message: string;
  data: {
    name: string;
    code: string;
  };
}

export interface NGTecoDepartmentListResponse {
  status: number;
  code: string;
  message: string;
  data: {
    pageInfo: {
      totalCount: number;
      currentPage: number;
      pageSize: number;
    };
    data: NGTecoDepartment[];
  };
}