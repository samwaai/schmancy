export interface Device {
  id: string;
  name: string;
  type: string;
  sn: string; // Serial number
}

export interface DeviceApiResponse {
  success: boolean;
  data: Device[];
  total: number;
  message?: string;
  error?: string;
  cached?: boolean;
}

// Device-Person Assignment Types
export interface AddPersonToDeviceRequest {
  personId: string; // Person ID to add to devices
  deviceIds: string[]; // Array of device IDs to add the person to
}

export interface PersonAssignmentResult {
  personId: string;
  deviceId?: string;
  success: boolean;
  message?: string;
}

export interface AddPersonToDeviceResponse {
  success: boolean;
  successfulAssignments: PersonAssignmentResult[];
  failedAssignments: PersonAssignmentResult[];
  message?: string;
  error?: string;
}