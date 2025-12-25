/**
 * Hannah Ingredient Types
 * Universal ingredient library shared across all restaurants
 */

/**
 * EU Regulation 1169/2011 - 14 Mandatory Allergens
 */
export type AllergenCode =
  | 'gluten'       // Cereals containing gluten
  | 'crustaceans'  // Crustaceans and products thereof
  | 'eggs'         // Eggs and products thereof
  | 'fish'         // Fish and products thereof
  | 'peanuts'      // Peanuts and products thereof
  | 'soybeans'     // Soybeans and products thereof
  | 'milk'         // Milk and products thereof (including lactose)
  | 'nuts'         // Nuts (tree nuts)
  | 'celery'       // Celery and products thereof
  | 'mustard'      // Mustard and products thereof
  | 'sesame'       // Sesame seeds and products thereof
  | 'sulphites'    // Sulphur dioxide and sulphites
  | 'lupin'        // Lupin and products thereof
  | 'molluscs';    // Molluscs and products thereof

/**
 * Human-readable labels for allergens (for UI display)
 */
export const ALLERGEN_LABELS: Record<AllergenCode, { label: string; icon: string }> = {
  gluten: { label: 'Gluten', icon: '🌾' },
  crustaceans: { label: 'Crustaceans', icon: '🦞' },
  eggs: { label: 'Eggs', icon: '🥚' },
  fish: { label: 'Fish', icon: '🐟' },
  peanuts: { label: 'Peanuts', icon: '🥜' },
  soybeans: { label: 'Soy', icon: '🫘' },
  milk: { label: 'Milk', icon: '🥛' },
  nuts: { label: 'Tree Nuts', icon: '🌰' },
  celery: { label: 'Celery', icon: '🥬' },
  mustard: { label: 'Mustard', icon: '🌭' },
  sesame: { label: 'Sesame', icon: '🫘' },
  sulphites: { label: 'Sulphites', icon: '⚗️' },
  lupin: { label: 'Lupin', icon: '🌸' },
  molluscs: { label: 'Molluscs', icon: '🦪' },
};

export interface HannahIngredient {
  id: string;
  name: string;  // e.g., "Tomato", "Cheese", "Gluten"

  // Dietary classifications (AI-generated)
  isVegan?: boolean;
  isVegetarian?: boolean;

  // EU-mandated allergens (AI-generated)
  allergens?: AllergenCode[];

  // Classification metadata
  classifiedAt?: string;  // ISO timestamp
  classificationConfidence?: number;  // 0-1 confidence score
}
