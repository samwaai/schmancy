// Fingerprint Registration Types for NGTeco integration

export interface FingerprintOption {
  label: string;
  value: number;
}

export interface FingerprintRegistrationRequest {
  enrollType: number; // Always 1
  pin: string; // Employee code
  fid: string; // Selected finger ID (0-9)
  personId: string; // NGTeco person ID
}

export interface FingerprintRegistrationResponse {
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

// Predefined fingerprint options
export const FINGERPRINT_OPTIONS: FingerprintOption[] = [
  { label: 'Left Little Finger', value: 0 },
  { label: 'Left Ring Finger', value: 1 },
  { label: 'Left Middle Finger', value: 2 },
  { label: 'Left First Finger', value: 3 },
  { label: 'Left Thumb', value: 4 },
  { label: 'Right Thumb', value: 5 },
  { label: 'Right First Finger', value: 6 },
  { label: 'Right Middle Finger', value: 7 },
  { label: 'Right Ring Finger', value: 8 },
  { label: 'Right Little Finger', value: 9 }
];