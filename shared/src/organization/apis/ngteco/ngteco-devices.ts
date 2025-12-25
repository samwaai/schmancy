// Organization NGTeco Devices API Types

export interface OrganizationNgtecoDevicesRequest {
  orgId: string;
}

export interface OrganizationNgtecoDevicesResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    type: string;
    sn: string;
  }>;
  total: number;
}