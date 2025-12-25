import { z } from "zod";

/**
 * Process Catalog Request - Discriminated Union
 *
 * Accepts either text OR file input for catalog processing
 */
export type ProcessCatalogRequest =
  | {
      flowId: string;
      inputType: 'text';
      content: string;
      supplierId?: string;
      orgId: string;
      uploadedBy: string;
    }
  | {
      flowId: string;
      inputType: 'file';
      documentId: string;
      fileName: string;
      fileType: string;
      supplierId?: string;
      orgId: string;
      uploadedBy: string;
    };

/**
 * Process Catalog Response
 */
export interface ProcessCatalogResponse {
  flowId: string;
  status: 'completed' | 'requires_supplier_match';

  // Only when completed
  itemsCreated?: number;
  itemsDuplicate?: number;
  itemsFailed?: number;
  items?: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Zod Schemas for validation
 */
export const ProcessCatalogRequestSchema = z.discriminatedUnion('inputType', [
  z.object({
    flowId: z.string(),
    inputType: z.literal('text'),
    content: z.string(),
    supplierId: z.string().optional(),
    orgId: z.string(),
    uploadedBy: z.string(),
  }),
  z.object({
    flowId: z.string(),
    inputType: z.literal('file'),
    documentId: z.string(),
    fileName: z.string(),
    fileType: z.string(),
    supplierId: z.string().optional(),
    orgId: z.string(),
    uploadedBy: z.string(),
  }),
]);

export const ProcessCatalogResponseSchema = z.object({
  flowId: z.string(),
  status: z.enum(['completed', 'requires_supplier_match']),
  itemsCreated: z.number().optional(),
  itemsDuplicate: z.number().optional(),
  itemsFailed: z.number().optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
});
