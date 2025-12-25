// packages/shared/src/schemas/order-number-extraction.schema.ts

import { z } from "zod";

/**
 * Schema for order number extraction
 */
export const OrderNumberExtractionSchema = z.object({
  orderNumber: z.number().describe('The extracted order number'),
});

// Type export (not exported to avoid conflicts)
type OrderNumberExtractionSchemaType = z.infer<typeof OrderNumberExtractionSchema>;