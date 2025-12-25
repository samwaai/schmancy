// Organization NGTeco Device Person API Types

export interface OrganizationNgtecoDevicePersonRequest {
  orgId: string;
  personId: string;
  deviceIds: string[];
}

export interface DevicePersonAssignment {
  deviceId: string;
  devicePersonId?: string;  // Optional - NGTeco may not return association ID in all cases
  personId: string;
  success: boolean;
  message: string;
}

export interface OrganizationNgtecoDevicePersonResponse {
  success: boolean;
  successfulAssignments: DevicePersonAssignment[];
  failedAssignments: Array<{
    deviceId: string;
    personId: string;
    success: boolean;
    message: string;
  }>;
  message: string;
}