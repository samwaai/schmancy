export class User {
  // Existing fields
  email: string;
  name: string;
  emailVerified: boolean;
  // Current active organization ID - the organization the user is currently working in
  organizationID?: string | null;
  id: string;
  photoURL?: string | null;
  onboarded?: boolean;
  createdAt?: string; // Iso string date
  updatedAt?: string; // Iso string date
  updatedBy?: string;
  createdBy?: string;

  // New field for multiple organizations
  organizations: Record<
    string,
    {
      role?: string; // Single role per organization
      active?: boolean;
      popularity?: number; // Visit count for smart sorting
      lastVisited?: string; // ISO date string of last visit
      businessAccess?: string[]; // Business IDs user can access. Empty/undefined = all businesses
    }
  > = {};

  // Global permissions (apply across all organizations)
  permissions?: string[];

  constructor() {
    this.name = "";
    this.email = "";
    this.id = "";
    this.organizationID = null;
    this.photoURL = null;
    this.onboarded = false;
    this.emailVerified = false;
    this.permissions = [];
  }
}
