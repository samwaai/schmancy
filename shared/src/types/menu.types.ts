// packages/shared/src/types/menu.types.ts
export interface RecipeIngredient {
  ingredient: string; // The standardized ingredient name (e.g., "tomato", "chicken breast")
  quantity: number;
  confidence?: number; // How confident is the AI in this mapping (0.0-1.0)
  notes?: string; // Optional preparation notes
  excludeItemIds?: string[]; // IDs of inventory items to exclude from this ingredient
}

export type MenuItemMapType = "inventoryItem" | "recipe" | "unclassified";

/**
 * Interface for inventory mapping with consumption ratio and priority
 * This allows more detailed control over how menu items are mapped to inventory
 */
export interface InventoryMapping {
  itemId: string;        // ID of the inventory item
  ratio: number;         // Consumption ratio (how much of this item is used per sale)
  priority: number;      // Order in which items should be consumed (FIFO)
  isAlternative?: boolean; // Whether this is an alternative item (e.g., barrel vs bottle)
}

// Consolidated MenuItem that includes recipe information directly
export interface MenuItem {
  id: string;
  orgId: string; // Organization ID
  name: string;
  description?: string;
  price?: number;
  category?: string; // e.g., "Appetizers", "Entrees", "Desserts"
  inventoryItemIds?: string[]; // Legacy: Array of Item ids when mapsTo is "inventoryItem"
  inventoryMappings?: InventoryMapping[]; // Enhanced inventory mapping with ratios and priorities
  mapsTo: MenuItemMapType;
  source: "ai" | "user";
  createdAt: string;
  updatedAt: string;
  reviewed?: boolean; // Indicates if the item has been reviewed
  pos_descriptions?: string[]; // Array of POS descriptions that map to this menu item

  // Former Recipe properties now directly in MenuItem
  ingredients?: RecipeIngredient[]; // Only populated when mapsTo === "recipe"
  prepTime?: number; // In minutes
  cookTime?: number; // In minutes
}

// PDF parsing input/output interfaces
export interface ParseMenuRequest {
  pdfContent: string; // Base64-encoded PDF content
  orgId: string; // Organization ID to associate with menu items
}
export interface ParseMenuResponse {
  flowId?: string; // Optional AI flow ID for progress tracking
  metadata: {
    restaurantName: string;
    menuType: string;
    extractedText: string; // For debugging/reference
  };
  menuItems: MenuItem[]; // Now contains basic menu items without classification
}

// Menu item classification interfaces
export interface MenuItemClassifierRequest {
  menuItem: {
    id: string; // Menu item ID
    name: string;
    description?: string;
    price?: number;
    category?: string;
  };
  userFeedback?: string; // Optional user guidance
}

export interface MenuItemClassifierResponse {
  type: MenuItemMapType;
  confidence: number;
  matchedInventoryItemIds?: string[]; // Legacy: Array of matched item IDs
  inventoryMappings?: InventoryMapping[]; // Enhanced: Structured inventory mappings
  ingredients?: RecipeIngredient[];
  cookTime?: number;
  prepTime?: number;
  reasoning: string;
}

export interface MenuItemSales {
  menuItemId: string;
  salesCount: number;
  revenue: number;
  timeframe: string; // daily, weekly, monthly
  startDate: string;
  endDate: string;
}
