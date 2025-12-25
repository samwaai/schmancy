import { z } from 'zod'

// Zod schema for address
export const TAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string().optional(),
  zip: z.string(),
  country: z.string(),
})

// TypeScript type derived from schema
export type TAddress = z.infer<typeof TAddressSchema>

export type TBilling = TAddress & {
  name: string;
  email?: string;
  vatID?: string;
};

// Public Speedy configuration (stored in main organization document)
export type SpeedyPublicConfig = {
  isConfigured: boolean;
  connectedAt?: Date;
  connectedBy?: string;
};

// Private Speedy configuration (stored in private subcollection)
export type SpeedyPrivateConfig = {
  accountEmail: string;
  accountPassword: string;
  sessionTokens?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
};

// Combined type for backward compatibility
export type SpeedyConfig = SpeedyPublicConfig & SpeedyPrivateConfig;

// Public Revolut configuration (stored in main organization document)
export type RevolutPublicConfig = {
  isConfigured: boolean;
  connectedAt?: Date;
  connectedBy?: string;
};

// Private Revolut configuration (stored in private subcollection)
export type RevolutPrivateConfig = {
  clientId: string;
  privateKey: string; // Base64 encoded
  jwtIssuer: string;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    refreshingAt?: Date;  // Lock to prevent concurrent refreshes
    refreshingBy?: string; // Identifier of the function that's refreshing
  };
};

// Combined type for backward compatibility
export type RevolutConfig = RevolutPublicConfig & RevolutPrivateConfig;

// Public NGTeco configuration (stored in main organization document)
export type NgtecoPublicConfig = {
  isConfigured: boolean;
  connectedAt?: Date;
  connectedBy?: string;
  selectedDevices?: string[]; // Array of selected device IDs
  selectedDepartments?: string[]; // Array of selected department IDs
  timezone?: string; // IANA timezone for NGTeco API (e.g., 'Europe/Berlin')
};

// Private NGTeco configuration (stored in private subcollection)
export type NgtecoPrivateConfig = {
  username: string;
  password: string;
  companyId: string;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    refreshingAt?: Date;  // Lock to prevent concurrent refreshes
    refreshingBy?: string; // Identifier of the function that's refreshing
    companySwitchedAt?: Date; // Track when company was last switched
  };
};

// Combined type for backward compatibility
export type NgtecoConfig = NgtecoPublicConfig & NgtecoPrivateConfig;

// Public Resend configuration (stored in main organization document)
export type ResendPublicConfig = {
  isConfigured: boolean;
  connectedAt?: Date;
  connectedBy?: string;
};

// Private Resend configuration (stored in private subcollection)
export type ResendPrivateConfig = {
  apiKey: string;
};

// Combined type for backward compatibility
export type ResendConfig = ResendPublicConfig & ResendPrivateConfig;

// Organization bank account
export type OrganizationBankAccount = {
  id: string;
  iban: string;
  bic?: string;
  bankName?: string;
  accountHolder?: string;
};

export class Organization {
  id: string;
  name: string;
  abbreviation?: string;
  address: TAddress;
  vatID?: string;
  taxID?: string;
  website?: string;
  billing: TBilling;
  logo?: string;
  accounts?: OrganizationBankAccount[];
  speedyConfig?: SpeedyPublicConfig;
  revolutConfig?: RevolutPublicConfig;
  ngtecoConfig?: NgtecoPublicConfig;
  resendConfig?: ResendPublicConfig;
  hannahPaymentConfig?: import('../types/hannah/order.types.js').HannahPaymentConfig;
  customRoles?: Record<string, { name: string; description: string; permissions: string[] }>;

  constructor() {
    this.id = "";
    this.name = "";
    this.address = {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };
    this.billing = {
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };
  }
}


