// packages/shared/src/schemas/reconciliation-normalization.schema.ts

import { z } from "zod";

/**
 * Schema for AI reconciliation normalization result
 */
export const ReconciliationNormalizationSchema = z.object({
  quantityMatch: z.boolean().describe('Whether quantities match after normalization'),
  priceMatch: z.boolean().describe('Whether prices match after normalization'),
  normalizedInvoiceQuantity: z.number().describe('Normalized invoice quantity in base units'),
  normalizedOrderQuantity: z.number().describe('Normalized order quantity in base units'),
  normalizedInvoicePrice: z.number().describe('Normalized invoice price per base unit'),
  normalizedOrderPrice: z.number().describe('Normalized order price per base unit'),
  explanation: z.string().describe('Single sentence explanation of normalization'),
  confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1'),
});

// Type export (not exported to avoid conflicts)
type ReconciliationNormalizationSchemaType = z.infer<typeof ReconciliationNormalizationSchema>;