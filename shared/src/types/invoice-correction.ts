// packages/shared/src/types/invoice-correction.ts

import { Invoice } from "./invoices.types";

// Update in shared/dist/index.js or shared types

export interface InvoiceCorrectionRequest {
  invoiceId: string;
  correctedInvoice: Invoice;
  userNotes?: string; // New field for user notes about the correction
  enableLearning?: boolean;
}

export interface InvoiceCorrectionResponse {
  success: boolean;
  message: string;
  supplementId?: string; // ID of created learning if applicable
}
