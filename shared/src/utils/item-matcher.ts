export interface ItemMatch {
  id: string;
  invoiceDescription: string;
  normalizedDescription?: string;
  itemId: string;
  confidence: number;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
  // New field for quantity normalization
  quantityFactor?: number; // How to convert invoice quantity to standard units

  isServiceCharge?: boolean;
  serviceType?: string;
  source?: string;
}

/**
 * Generate a consistent ID for an item match
 */
export function generateMatchId(description: string): string {
  // Create a simple hash from the description
  const normalizedDesc = description.toLowerCase().trim();

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < normalizedDesc.length; i++) {
    const char = normalizedDesc.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Return a string ID
  return `match_${Math.abs(hash).toString(16)}`;
}

/**
 * Constants for item matching
 */
export const ITEM_MATCHING = {
  // Collection name for storing item matches
  COLLECTION_NAME: "item_matches",
};

/**
 * Enhanced normalization function for item descriptions
 * Makes item names more comparable by standardizing formats
 */
export function normalizeItemDescription(description: string): string {
  if (!description) return "";

  // Convert to lowercase and remove punctuation
return description
    .toLowerCase()
    .trim();

}
