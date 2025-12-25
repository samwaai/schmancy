import { z } from "zod";
import { InvoiceExtractionSchema } from "../schemas/invoice-extraction.schemas.js";

export interface BankInfo {
  bank: string | null;
  iban: string | null;
}

// Define the valid document types
export const validDocumentTypes = [
  "Invoice",
  "Purchase Order",
  "Delivery Note",
  "Credit Note",
  "Remittance Advice",
  "Quotation",
  "Bill of Lading",
  "Packing List",
  "Customs Declaration",
] as const;

export type DocumentType = (typeof validDocumentTypes)[number];

export interface InvoiceExtractionOutput {
  originalData: any | null;
  validatedData: Invoice | null;
  validationErrors: string[] | null;
  extractedText: string | null;
  documentType: string | null;
  unpredicted?: boolean;
  autoCorrections?: string[];
  enhancedWithLearnings?: boolean; // New field to track learning enhancement
  checksum?: string; // For backward compatibility
  enhancedWithSupplierPattern?: boolean;
}

// Database schema - extends extraction schema with system fields
export const InvoiceDatabaseSchema = InvoiceExtractionSchema.extend({
  // System identification fields
  id: z.string().nullable(),
  supplierID: z.string().nullable(),
  orderId: z.string().nullable(),
  url: z.string().nullable(),
  checksum: z.string().nullable(),

  // Organization and file metadata
  orgId: z.string().nullable(),
  filename: z.string().nullable(),
  mimeType: z.string().nullable(),

  // Processing status and matching fields
  status: z.enum(['matched', 'no_order_exists', 'pending_review', 'processed', 'unprocessed']).nullable(),
  matchDecision: z.enum(['AUTO_MATCH', 'REVIEW_SUGGESTED', 'MANUAL_REQUIRED', 'NO_ORDER_EXISTS']).nullable(),
  matchConfidence: z.number().nullable(),
  matchReason: z.string().nullable(),
  supplierMatchType: z.enum(['EXACT', 'FUZZY', 'NONE']).nullable(),
  supplierMatchConfidence: z.number().nullable(),

  // Metadata fields
  extractionMetadata: z.any().nullable(),
  createdAt: z.any().nullable(),
  updatedAt: z.any().nullable(),
});

// Extract the invoice item schema from the main schema for reuse
const invoiceItemSchema = z.object({
  description: z.string().nullable(),
  quantity: z.number().nullable(),
  unit_price: z.number().nullable(),
  amount: z.number().nullable(),
  vat_rate: z.number().nullable(),
  vat_amount: z.number().nullable(),
});

const invoiceFlowOutputSchema = z.object({
  originalData: z.any().nullable(),
  validatedData: InvoiceDatabaseSchema.nullable(),
  validationErrors: z.array(z.string()).nullable(),
  extractedText: z.string().nullable(),
  documentType: z.string().nullable(),
  unpredicted: z.boolean().optional(),
  autoCorrections: z.array(z.string()).optional(),
  enhancedWithLearnings: z.boolean().optional(), // New field to track learning enhancement
});

// Type definitions
export type Invoice = z.infer<typeof InvoiceDatabaseSchema>;
export type InvoiceExtraction = z.infer<typeof InvoiceExtractionSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

// Exports - removed invoiceFlowInputSchema as it's replaced by InvoiceDatabaseSchema
export { invoiceFlowOutputSchema, invoiceItemSchema };
