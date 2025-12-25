// packages/shared/src/utils/inventory-ingredient.utils.ts

/**
 * Utility functions for working with ingredient-to-inventory item mappings
 */
export class InventoryIngredientUtils {
  /**
   * Get all inventory items that match a given ingredient
   *
   * @param ingredient The ingredient name to match
   * @param allItems Map of all inventory items
   * @param excludeItemIds Optional array of item IDs to exclude
   * @returns Array of matching inventory item IDs
   */
  static getInventoryItemsForIngredient(
    ingredient: string,
    allItems: Map<string, any>,
    excludeItemIds: string[] = [],
  ): string[] {
    if (!ingredient) return [];

    const normalizedIngredient = ingredient.toLowerCase().trim();
    const matchingItemIds: string[] = [];

    // Find all inventory items with matching ingredient classification
    Array.from(allItems.entries()).forEach(([id, item]) => {
      if (
        item.ingredient &&
        item.ingredient.toLowerCase().trim() === normalizedIngredient &&
        !excludeItemIds.includes(id)
      ) {
        matchingItemIds.push(id);
      }
    });

    return matchingItemIds;
  }
  
  /**
   * Check if an ingredient name matches an inventory item
   * This is a simplistic match that could be enhanced with fuzzy matching
   *
   * @param ingredientName The name of the ingredient to match
   * @param item The inventory item to check against
   * @param excludeItemIds Optional array of item IDs to exclude from matching
   * @returns Boolean indicating if the ingredient matches the item
   */
  static ingredientMatchesItem(
    ingredientName: string, 
    item: any, 
    excludeItemIds: string[] = []
  ): boolean {
    // If this item ID is in the exclude list, it doesn't match
    if (excludeItemIds?.includes(item.id)) {
      return false;
    }
    
    // Normalize both strings for better matching
    const normalizedIngredient = ingredientName.toLowerCase().trim();
    const normalizedItemName = item.name.toLowerCase().trim();

    // Simple contains check
    return (
      normalizedItemName.includes(normalizedIngredient) ||
      normalizedIngredient.includes(normalizedItemName) ||
      (item.ingredient && item.ingredient.toLowerCase().trim() === normalizedIngredient)
    );
  }

  /**
   * Find newly excluded item IDs by comparing previous selection with current selection
   *
   * @param previousSelectedIds Previously selected item IDs
   * @param currentSelectedIds Currently selected item IDs
   * @param allMatchingIds All matching item IDs for this ingredient
   * @returns Array of excluded item IDs
   */
  static calculateExcludedItemIds(
    previousSelectedIds: string[] = [],
    currentSelectedIds: string[] = [],
    allMatchingIds: string[] = [],
  ): string[] {
    // If we have no previous selection data, we can't determine exclusions
    if (previousSelectedIds.length === 0) {
      // For newly created ingredients, exclude any matching items not in the current selection
      return allMatchingIds.filter((id) => !currentSelectedIds.includes(id));
    }

    // Find items that were previously selected but are no longer selected
    const newlyExcluded = previousSelectedIds.filter(
      (id) => !currentSelectedIds.includes(id),
    );

    // Also include any items that were already excluded
    const alreadyExcluded = allMatchingIds.filter(
      (id) =>
        !previousSelectedIds.includes(id) && !currentSelectedIds.includes(id),
    );

    return [...new Set([...newlyExcluded, ...alreadyExcluded])];
  }
}
