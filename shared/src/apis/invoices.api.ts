export type reanalyzeInvoiceFnRequest = {
  invoiceUrl: string;
  orgId: string;
  orderId?: string; // Optional order ID to link invoice to order
};

export type reanalyzeInvoiceFnResponse = {
  success: boolean;
  message: string;
  updatedInvoice?: any;
  orderId?: string; // Return orderId if it was provided
};
