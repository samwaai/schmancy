// packages/shared/src/schemas/match-invoice-to-order.schema.ts

import { z } from "zod";

/**
 * Schema for invoice-to-order matching result
 */
export const MatchInvoiceToOrderSchema = z.object({
  matchedOrderId: z.string().nullable().describe('The ID of the matched order, or null if no match found'),
  confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1'),
  reason: z.string().describe('Explanation for the match or no-match decision'),
  matchingDetails: z.object({
    supplierMatch: z.boolean().describe('Whether the supplier matches'),
    amountMatch: z.boolean().describe('Whether the amounts match'),
    dateValid: z.boolean().describe('Whether the dates are valid'),
    itemsMatch: z.number().describe('Number of matching items'),
    emailMatch: z.boolean().describe('Whether the email references match'),
  }).optional().describe('Detailed breakdown of matching criteria'),
});

// Type export (not exported to avoid conflicts)
type MatchInvoiceToOrderSchemaType = z.infer<typeof MatchInvoiceToOrderSchema>;