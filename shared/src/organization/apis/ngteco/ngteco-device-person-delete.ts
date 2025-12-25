// Organization NGTeco Device Person Delete API Types

export interface OrganizationNgtecoDevicePersonDeleteRequest {
  orgId: string;
  devicePersonId: string;  // The device-person association ID used in URL
  personId: string;        // The person ID sent in request body
}

export interface OrganizationNgtecoDevicePersonDeleteResponse {
  success: boolean;
  message: string;
}
