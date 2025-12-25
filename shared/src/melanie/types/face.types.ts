// Face Registration Types for NGTeco integration

export interface FaceRegistrationRequest {
  deviceId: string; // Device ID from NGTeco
  enrollType: number; // Always 9 for face registration
  pin: string; // Employee code
  fid: string; // Face ID (typically "4")
  personId: string; // NGTeco person ID
}

export interface FaceRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    deviceSN: string;
    personId: string;
    faceId: string;
    enrollType: number;
  };
}

// NGTeco API Response Structure (matches exact API response)
export interface NGTecoFaceRegistrationResponse {
  status: number;
  code: string;
  message: string;
  data: {
    code: string;
    message: string;
    mid: string;
    data: {
      sessionId: string;
    };
  };
}
