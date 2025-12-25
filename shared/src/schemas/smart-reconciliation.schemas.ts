// packages/shared/src/schemas/smart-reconciliation.schema.ts

import { z } from "zod";

/**
 * Schema for item matching result
 */
export const ItemMatchSchema = z.object({
  invoiceItemIndex: z.number().describe('Index of the invoice item'),
  orderItemIndex: z.number().nullable().describe('Index of the matched order item, or null if no match'),
  confidence: z.number().min(0).max(1).describe('Match confidence score'),
  reason: z.string().describe('Reason for match or no-match'),
  quantityMatch: z.boolean().describe('Whether quantities match'),
  priceMatch: z.boolean().describe('Whether prices match'),
});

/**
 * Schema for reconciliation discrepancy details
 */
export const DiscrepancyDetailSchema = z.object({
  discrepancy: z.string().describe('Description of the discrepancy'),
  orderItemIndex: z.number().nullable().describe('Index of order item, or null'),
  invoiceItemIndex: z.number().nullable().describe('Index of invoice item, or null'),
  expectedQuantity: z.number().nullable().describe('Expected quantity from order'),
  actualQuantity: z.number().nullable().describe('Actual quantity from invoice'),
  expectedPrice: z.number().nullable().describe('Expected price from order'),
  actualPrice: z.number().nullable().describe('Actual price from invoice'),
  severity: z.enum(['low', 'medium', 'high']).describe('Severity of the discrepancy'),
});

/**
 * Main schema for reconciliation result
 */
export const ReconciliationResultSchema = z.object({
  matches: z.array(ItemMatchSchema).describe('List of item matches'),
  hasDiscrepancies: z.boolean().describe('Whether discrepancies were found'),
  discrepancyDetails: z.array(DiscrepancyDetailSchema).describe('Details of discrepancies'),
  summary: z.string().describe('Human-readable summary of reconciliation'),
  totalConfidence: z.number().min(0).max(1).describe('Overall reconciliation confidence'),
});

// Type exports (not exported to avoid conflicts with existing types)
type ItemMatchSchemaType = z.infer<typeof ItemMatchSchema>;
type DiscrepancyDetailSchemaType = z.infer<typeof DiscrepancyDetailSchema>;
type ReconciliationResultSchemaType = z.infer<typeof ReconciliationResultSchema>;