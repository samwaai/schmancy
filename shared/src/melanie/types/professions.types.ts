export interface Profession {
  id: string;
  name: string;
  description?: string;
  source: 'VERIFIED' | 'LOCAL';
  businessTypes: string[];
  usageCount: number;
  orgId?: string; // Only for LOCAL professions
  createdAt: string;
  updatedAt: string;
}