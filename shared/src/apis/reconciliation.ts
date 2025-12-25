// packages/shared/src/types/reconciliation/reconciliation.types.ts
import { z } from "zod";

// Define base Zod schemas
export const reconciliationInputSchema = z.object({
  invoiceId: z.string(),
  orderId: z.string(),
  itemId: z.string().optional(),
  invoiceDescription: z.string(),
  invoiceQuantity: z.number(),
  invoicePrice: z.number(),
  orderQuantity: z.number(),
  orderPrice: z.number(),
  itemDetails: z
    .object({
      name: z.string(),
      brand: z
        .object({
          name: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
      pricePerUnit: z.number().optional().nullable(),
      unit: z
        .object({
          type: z.string(),
          measurement: z.object({
            value: z.number(),
            label: z.string(),
          }),
        })
        .optional()
        .nullable(),
      set: z
        .object({
          label: z.string().optional().nullable(),
          quantity: z.number(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  currency: z.string().default("EUR"),
  // Add these two fields:
  quantityFactor: z.number().optional(),
  forceRespect: z.boolean().optional(),
});

export const reconciliationEngineOutputSchema = z.object({
  quantityMatch: z.boolean(),
  priceMatch: z.boolean(),
  normalizedInvoiceQuantity: z.number(),
  normalizedOrderQuantity: z.number(),
  normalizedInvoicePrice: z.number(),
  normalizedOrderPrice: z.number(),
  explanation: z.string(),
  confidence: z.number().min(0).max(1),
});

export const reconciliationResultSchema =
  reconciliationEngineOutputSchema.extend({
    success: z.boolean(),
    decisionId: z.string(),
    alreadyExists: z.boolean(),
  });

export const reconciliationDecisionSchema =
  reconciliationEngineOutputSchema.extend({
    id: z.string(),
    invoiceId: z.string(),
    orderId: z.string(),
    itemId: z.string().nullable(),
    invoiceDescription: z.string(),
    invoiceQuantity: z.number(),
    invoicePrice: z.number(),
    orderQuantity: z.number(),
    orderPrice: z.number(),
    createdAt: z.string(),
    lastUsed: z.string(),
  });

// Export TypeScript types inferred from Zod schemas
export type ReconciliationInput = z.infer<typeof reconciliationInputSchema>;
export type ReconciliationEngineOutput = z.infer<
  typeof reconciliationEngineOutputSchema
>;
export type ReconciliationResult = z.infer<typeof reconciliationResultSchema>;
export type ReconciliationDecision = z.infer<
  typeof reconciliationDecisionSchema
>;
