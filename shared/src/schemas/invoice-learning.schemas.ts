import { z } from "zod";

// Schema for invoice learning insights
export const InvoiceLearningInsightSchema = z.object({
  promptAddition: z.string(),
  exampleText: z.string()
});

export type InvoiceLearningInsight = z.infer<typeof InvoiceLearningInsightSchema>;