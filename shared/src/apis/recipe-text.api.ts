// packages/shared/src/types/recipe-text.types.ts

/**
 * Interface for parsed recipe ingredients
 */
export interface ParsedIngredient {
  ingredient: string;
  quantity: number;
  unit?: string;
  matched?: boolean;
  confidence?: number;
}

/**
 * Interface for recipe ingredients with inventory items
 */
export interface RecipeIngredientWithInventory {
  ingredient: string;
  quantity: number;
  confidence?: number;
  notes?: string;
  inventoryItemIds?: string[];
}

/**
 * Interface for matched menu items
 */
export interface MatchedMenuItem {
  id: string;
  name: string;
  mapsTo?: string;
  ingredients?: RecipeIngredientWithInventory[];
  confidence?: number;
  reasoning?: string;
}

/**
 * Interface for extracted menu items from chef's text
 */
export interface ExtractedMenuItem {
  id: string;
  name: string;
  ingredients: ParsedIngredient[];
  matched: boolean;
  matchedItem?: MatchedMenuItem;
  updated?: boolean;
  error?: string;
}

/**
 * Request interface for parseRecipeText function
 */
export interface ParseRecipeTextRequest {
  text: string;
  orgId: string;
}

/**
 * Response interface for parseRecipeText function
 */
export interface ParseRecipeTextResponse {
  success: boolean;
  results: ExtractedMenuItem[];
  error?: string;
}

/**
 * Request interface for updateMenuItemRecipe function
 */
export interface UpdateMenuItemRecipeRequest {
  menuItemId: string;
  recipe: {
    ingredients: ParsedIngredient[];
  };
}

/**
 * Response interface for updateMenuItemRecipe function
 */
export interface UpdateMenuItemRecipeResponse {
  success: boolean;
  message: string;
  updatedItem?: any;
}
