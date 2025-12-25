// packages/shared/src/schemas/invoice-extraction.schema.ts

import { z } from "zod";

/**
 * Zod schema for structured invoice extraction output
 */
export const InvoiceExtractionSchema = z.object({
  // Document identification
  documentType: z.string().nullable().describe('Type of document (Invoice, Credit Note, etc.)'),

  // Invoice identification
  invoice_number: z.string().nullable().describe('The invoice number'),
  invoice_date: z.string().nullable().describe('Invoice date in YYYY-MM-DD format'),
  due_date: z.string().nullable().describe('Payment due date in YYYY-MM-DD format'),
  order_reference: z.string().nullable().describe('Order or reference number'),

  // Sender (supplier) information
  sender_company_name: z.string().nullable().describe('Name of the company issuing the invoice'),
  sender_name: z.string().nullable().describe('Contact person name'),
  sender_iban: z.array(z.object({
    bank: z.string().nullable().describe('Bank name'),
    iban: z.string().nullable().describe('IBAN number'),
  })).nullable().describe('Sender IBAN information'),

  // Recipient information
  recipient_company_name: z.string().nullable().describe('Recipient company name'),
  recipient_name: z.string().nullable().describe('Recipient contact name'),

  // Financial information
  total_amount: z.number().nullable().describe('Total invoice amount'),
  net_amount: z.number().nullable().describe('Net amount before VAT'),
  due_amount: z.number().nullable().describe('Amount due for payment'),
  vat: z.number().nullable().describe('VAT amount'),
  currency: z.string().nullable().describe('ISO 4217 currency code (e.g., EUR)'),

  // Invoice items
  invoice_items: z.array(z.object({
    description: z.string().nullable().describe('Item description'),
    quantity: z.number().nullable().describe('Quantity'),
    unit_price: z.number().nullable().describe('Price per unit'),
    amount: z.number().nullable().describe('Total price for this line'),
    vat_rate: z.number().nullable().describe('VAT rate in decimal (0.19 for 19%)'),
    vat_amount: z.number().nullable().describe('VAT amount for this line'),
  })).nullable().describe('Invoice line items'),

  // Additional fields
  payment_terms: z.string().nullable().describe('Payment terms'),
  notes: z.string().nullable().describe('Additional notes or comments'),

  // Boolean flags
  is_valid_invoice: z.boolean().nullable().describe('Whether this is a valid invoice'),
  late_payment_reminder: z.boolean().nullable().describe('Is this a payment reminder'),
  multiple_invoices_found: z.boolean().nullable().describe('Multiple invoices in document'),
  has_payment_schedule: z.boolean().nullable().describe('Has payment schedule'),
  direct_debit: z.boolean().nullable().describe('Direct debit payment'),
});

/**
 * Simplified schema for initial supplier identification
 */
export const SupplierIdentificationSchema = z.object({
  sender_company_name: z.string().nullable(),
  sender_iban: z.array(z.object({
    bank: z.string().nullable(),
    iban: z.string().nullable(),
  })).nullable(),
});

// Type exports
export type InvoiceExtractionType = z.infer<typeof InvoiceExtractionSchema>;
export type SupplierIdentificationType = z.infer<typeof SupplierIdentificationSchema>;