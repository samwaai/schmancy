import { z } from "zod";

// Schema for document analysis result
export const DocumentAnalysisResultSchema = z.object({
  documentType: z.string(),
  supplierName: z.string()
});

// Schema for supplier details extraction
export const SupplierDetailsSchema = z.object({
  name: z.string(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  bankIBAN: z.string().nullable(),
  bankIBAN2: z.string().nullable(),
  bankName: z.string().nullable(),
  bankSWIFT: z.string().nullable(),
  contactName: z.string().nullable(),
  contactPhone: z.string().nullable(),
  contactEmail: z.string().nullable()
});

// Schema for supplier match result
export const SupplierMatchResultSchema = z.object({
  matchFound: z.boolean(),
  matchId: z.string().nullable(),
  confidence: z.number(),
  reasoning: z.string()
});

export type DocumentAnalysisResult = z.infer<typeof DocumentAnalysisResultSchema>;
export type SupplierDetails = z.infer<typeof SupplierDetailsSchema>;
export type SupplierMatchResult = z.infer<typeof SupplierMatchResultSchema>;