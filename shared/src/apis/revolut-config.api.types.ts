// Get Revolut Private Config
export interface GetRevolutPrivateConfigRequest {
  organizationId: string;
}

export interface GetRevolutPrivateConfigResponse {
  isConfigured: boolean;
  privateConfigSaved?: boolean;
  message?: string;
  clientId?: string;
  privateKey?: string;
  jwtIssuer?: string;
  tokens?: {
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: string;
  };
  updatedAt?: string;
  updatedBy?: string;
}

// Save Revolut Private Config
export interface SaveRevolutPrivateConfigRequest {
  organizationId: string;
  config: {
    clientId: string;
    privateKey: string;
    jwtIssuer: string;
  };
}

export interface SaveRevolutPrivateConfigResponse {
  success: boolean;
  message: string;
}

// Clear Revolut Config
export interface ClearRevolutConfigRequest {
  organizationId: string;
}

export interface ClearRevolutConfigResponse {
  success: boolean;
  message: string;
}