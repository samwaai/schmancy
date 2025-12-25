// Organization NGTeco Face Registration API Types

export interface OrganizationNgtecoFaceRegistrationRequest {
  orgId: string;
  deviceId: string;
  personId: string;
  pin: string;
  enrollType?: number;
  fid?: string;
}

export interface OrganizationNgtecoFaceRegistrationResponse {
  status: number;
  code: string;
  message: string;
  data: {
    code: string;
    message: string;
    mid: string;
    data: any;
  };
}