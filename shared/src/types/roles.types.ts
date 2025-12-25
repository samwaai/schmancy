/**
 * Role interface representing permissions and organization associations
 */
export interface Role {
  id: string;
  name: string;
  organizationId?: string | null; // null for system-wide default roles
  isSystem: boolean; // true for immutable system roles like Owner
  permissions: Record<string, boolean>; // Dot notation permission keys
  createdAt?: any; // Firestore Timestamp or ISO string
  createdBy?: string;
  updatedAt?: any; // Firestore Timestamp or ISO string
  updatedBy?: string;
}

/**
 * Request/Response types for role management functions
 */
export interface CreateRoleRequest {
  name: string;
  organizationId: string;
  permissions: Record<string, boolean>;
}

export interface CreateRoleResponse {
  success: boolean;
  roleId: string;
  role: Role;
}

export interface UpdateRoleRequest {
  roleId: string;
  name?: string;
  permissions?: Record<string, boolean>;
}

export interface UpdateRoleResponse {
  success: boolean;
  role: Role;
}

export interface DeleteRoleRequest {
  roleId: string;
}

export interface DeleteRoleResponse {
  success: boolean;
}

export interface GetRolesRequest {
  organizationId?: string;
  includeSystemRoles?: boolean;
}

export interface GetRolesResponse {
  success: boolean;
  roles: Role[];
}

export interface AssignRoleToUserRequest {
  userId: string;
  roleId: string;
  organizationId: string;
}

export interface AssignRoleToUserResponse {
  success: boolean;
  userId: string;
  roleId: string;
}


/**
 * Predefined system roles
 */
export const SYSTEM_ROLES = {
  OWNER: "owner",
} as const;

export type SystemRoleType = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES];

/**
 * OrganizationRole interface for roles stored in the organization subcollection
 * This is specifically designed for Firestore subcollection storage with ISO timestamps
 */
export interface OrganizationRole {
  /** Role identifier */
  id: string;
  /** Display name for the role */
  name: string;
  /** Optional description of the role */
  description?: string;
  /** Array of permission strings (using dot notation like 'owl.orders.view') */
  permissions: string[];
  /** ISO timestamp when role was created */
  createdAt: string;
  /** User ID who created this role */
  createdBy: string;
  /** Optional ISO timestamp when role was last updated */
  updatedAt?: string;
  /** Optional user ID who last updated this role */
  updatedBy?: string;
  /** Whether the role is active (default true, used for soft deletes) */
  active: boolean;
  /** Whether this is a system-wide role like owner */
  isSystem?: boolean;
}