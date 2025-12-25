import { z } from "zod";

// Schema for menu item matching result
export const MenuItemMatchResultSchema = z.object({
  matchedItemId: z.string().nullable(),
  confidence: z.number(),
  reasoning: z.string()
});

// Schema for menu item classification result
export const MenuItemClassificationResultSchema = z.object({
  type: z.enum(["inventoryItem", "recipe", "unclassified"]),
  confidence: z.number(),
  matchedInventoryItemIds: z.array(z.string()).optional(),
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
      quantity: z.number(),
      confidence: z.number().optional(),
      notes: z.string().optional()
    })
  ).optional(),
  cookTime: z.number().optional(),
  prepTime: z.number().optional(),
  reasoning: z.string()
});

export type MenuItemMatchResult = z.infer<typeof MenuItemMatchResultSchema>;
export type MenuItemClassificationResult = z.infer<typeof MenuItemClassificationResultSchema>;