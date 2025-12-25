export interface ConfirmInvoiceReceiptionRequest {
  orderId: string;
}

export interface ConfirmInvoiceReceiptionResponse {
  success: boolean;
  message: string;
}

export interface CancelOrderRequest {
  orderId: string;
  reason?: string;
  skipEmail?: boolean;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
}

export interface RestoreOrderRequest {
  orderId: string;
}

export interface RestoreOrderResponse {
  success: boolean;
  message: string;
}

export interface MergeOrderRequest {
  mergedOrderId: string;
  masterOrderId: string;
}

export interface MergeOrderResponse {
  success: boolean;
  message: string;
}

export interface ProcessInvoiceToOrderRequest {
  invoiceId: string;
  orgId: string;
}

export interface ProcessInvoiceToOrderResponse {
  success: boolean;
  message: string;
  invoiceId?: string;
  orderId?: string;
  matchingResult?: any;
}

export interface ConnectInvoiceToOrderRequest {
  invoiceId: string;
  orderId: string;
  orgId: string;
  supplierUpdate?: {
    supplierId: string;
    supplierName: string;
  };
}

export interface ConnectInvoiceToOrderResponse {
  success: boolean;
  message: string;
}


export interface CreateOrderWithInvoiceRequest {
  invoiceId: string;
  orgId: string;
  userId: string;
  supplierId: string;
  warehouseId: string;
  items: any[];
  invoiceDate: string;
}

export interface CreateOrderWithInvoiceResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

export interface ProcessOrganizationInvoicesRequest {
  orgId: string;
  invoiceIds?: string[];
  invoiceChecksum?: string;
}

export interface ProcessOrganizationInvoicesResponse {
  success: boolean;
  processedCount: number;
  matchedCount: number;
  totalFiles: number;
  errors?: Array<{ checksum: string; error: string }>;
  message?: string;
}