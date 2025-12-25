import { z } from "zod";

// Schema for item extraction result
export const ExtractedItemSchema = z.object({
  name: z.string(),
  brand: z.string().nullable(),
  pricePerUnit: z.number().nullable(),
  unit: z.object({
    type: z.string(),
    measurement: z.object({
      value: z.number(),
      label: z.string()
    }).nullable()
  }).nullable(),
  set: z.object({
    label: z.string().nullable(),
    quantity: z.number()
  }).nullable()
});

export const ExtractedItemsResultSchema = z.array(ExtractedItemSchema);

// Schema for item matching result
export const ItemMatchResultSchema = z.object({
  matchFound: z.boolean(),
  matchId: z.string().nullable(),
  confidence: z.number(),
  reasoning: z.string()
});

// Schema for category assignments
export const CategoryAssignmentsSchema = z.record(z.string(), z.string());

export type ExtractedItem = z.infer<typeof ExtractedItemSchema>;
export type ExtractedItemsResult = z.infer<typeof ExtractedItemsResultSchema>;
export type ItemMatchResult = z.infer<typeof ItemMatchResultSchema>;
export type CategoryAssignments = z.infer<typeof CategoryAssignmentsSchema>;