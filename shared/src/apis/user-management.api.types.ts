export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  sendWelcomeEmail?: boolean;
}

export interface CreateUserResponse {
  userId: string;
  user: any;
  success: boolean;
  message: string;
}

export interface CreateUserAndOrganizationRequest {
  user: CreateUserRequest;
  organization?: any;
}

export interface CreateUserAndOrganizationResponse {
  userId: string;
  organizationId: string;
  user: any;
  organization: any;
}

export interface UpdateOrganizationRequest {
  userId: string;
  organization: any & { id: string };
}

export interface UpdateOrganizationResponse {
  organizationId: string;
  organization: any;
}

export interface AddUserToOrganizationRequest {
  email: string;
  name?: string;
  organizationID: string;
  role: string;
  businessAccess?: string[]; // Business IDs user can access. Empty/undefined = all businesses
}

export interface AddUserToOrganizationResponse {
  success: boolean;
  message: string;
  userCreated: boolean;
}

export interface InviteUserRequest {
  email: string;
  orgId: string;
  role?: string;
}

export interface InviteUserResponse {
  success: boolean;
  message: string;
}

export interface DeleteUserRequest {
  userId: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

