/**
 * Hannah Menu Types
 * Menu items and categories for restaurant ordering system
 */

export interface HannahMenuItem {
  id: string;
  orgId: string;
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;  // Optional short description (for extras, etc.)
  price: number;     // In cents (integer) - e.g., 1999 = €19.99

  // Image handling - supports both legacy and responsive images
  image?: string;    // DEPRECATED - kept for backward compatibility, use images.medium
  images?: {
    thumbnail: string;   // 200x150 (4:3 aspect ratio)
    medium: string;      // 400x300 (4:3 aspect ratio)
    large: string;       // 800x600 (4:3 aspect ratio)
    aspectRatio: '4:3';  // Fixed aspect ratio for consistent display
  };

  ingredientIds: string[];  // References to ingredients collection
  available: boolean;
  displayOrder: number;

  // Tax rates per consumption method (decimal, e.g., 0.19 = 19%)
  taxRateDineIn: number;    // e.g., 0.19 (Germany restaurant food)
  taxRateTakeaway: number;  // e.g., 0.07 (Germany takeaway food - reduced rate)

  // If true, this item is an extra available to all non-extra items in the same category
  // Extra items are hidden from customer menu and shown in extras sheet
  extra?: boolean;

  // Estimated preparation time in minutes (default: 1.5 minutes if not set)
  // Used for queue position and wait time calculations in order tracking
  preparationTime?: number;
}

export interface HannahMenuCategory {
  id: string;
  orgId: string;
  businessId: string;
  name: string;
  displayOrder: number;
}

/**
 * Menu Parser Input - shared between frontend and backend
 */
export interface ParseMenuInput {
  flowId: string;          // Checksum (SHA256) of file
  storagePath: string;     // Path to file in Firebase Storage (e.g., "menus/orgId/businessId/checksum.pdf")
  fileName: string;        // Original filename
  contentType: string;     // MIME type: 'application/pdf', 'image/jpeg', etc.
  businessId: string;
  orgId: string;
}

/**
 * Menu Parser Output - shared between frontend and backend
 */
export interface ParseMenuOutput {
  flowId: string;          // Echo back for confirmation
}

// Result stored in AIFlow document at: aiflows/${flowId}.result
// AIFlow.result = {
//   categories: HannahMenuCategory[],
//   ingredients: HannahIngredient[],
//   menuItems: HannahMenuItem[]
// }

/**
 * AI Menu Improvement Types
 */

/**
 * Input for improving menu items with AI
 */
export interface ImproveMenuItemsInput {
  flowId: string;           // UUID for progress tracking
  itemIds: string[];        // Array of menu item IDs (chat UI sends single item)
  prompt?: string;          // User's natural language feedback (e.g., "find an image")
  businessId: string;
  orgId: string;
}

/**
 * Output from improvement function
 */
export interface ImproveMenuItemsOutput {
  flowId: string;           // Echo back for confirmation
}

/**
 * Ingredient classification update - for updating existing ingredient dietary info
 */
export interface IngredientClassificationUpdate {
  ingredientName: string;   // Name of ingredient to update (case-insensitive match)
  ingredientId?: string;    // Populated after lookup
  isVegan?: boolean;        // New vegan status (if updating)
  isVegetarian?: boolean;   // New vegetarian status (if updating)
  reasoning: string;        // Why this update was requested
}

/**
 * AI-generated improvements for a single item
 */
export interface ItemImprovement {
  itemId: string;
  itemName: string;         // For logging/UI display

  improvements: {
    // Image improvement
    image?: {
      action: 'find' | 'generate';
      url: string;          // Web URL to download from (or final storage URL after processing)
      reasoning: string;    // Why this image was chosen
      searchQuery?: string; // What was searched (for debugging)
    };

    // Ingredient improvement
    ingredients?: {
      action: 'add' | 'replace';
      ingredientNames: string[];  // Human-readable names
      ingredientIds?: string[];   // Populated after ingredient creation
      reasoning: string;
    };

    // Ingredient classification updates (for existing ingredients)
    ingredientUpdates?: IngredientClassificationUpdate[];

    // Name improvement
    name?: {
      newName: string;
      reasoning: string;
    };

    // Price improvement
    price?: {
      newPrice: number;     // In euros (AI returns euros, will be converted to cents)
      reasoning: string;
    };
  };
}

/**
 * Result stored in AIFlow.result
 */
export interface ImproveMenuItemsResult {
  flowId: string;
  itemsProcessed: number;
  improvements: ItemImprovement[];
  errors?: Array<{
    itemId: string;
    error: string;
  }>;
}
