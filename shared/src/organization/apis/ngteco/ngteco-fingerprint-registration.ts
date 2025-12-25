// Organization NGTeco Fingerprint Registration API Types

export interface OrganizationNgtecoFingerprintRegistrationRequest {
  orgId: string;
  deviceId: string;
  personId: string;
  pin: string;
  enrollType?: number;
  fid?: string;
}

export interface OrganizationNgtecoFingerprintRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    deviceId: string;
    personId: string;
    fingerId: string;
    enrollType: number;
  };
}
