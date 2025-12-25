/**
 * Invoices Create Order With Invoice API Types
 * Request/response types for createOrderWithInvoice Cloud Function
 */

/**
 * Request to create an order from an invoice
 */
export interface Request {
  /** Invoice ID to create order from */
  invoiceId: string;
  /** Organization ID */
  orgId: string;
  /** User ID creating the order */
  userId: string;
  /** Supplier ID for the order */
  supplierId: string;
  /** Warehouse ID for inventory */
  warehouseId: string;
  /** Items in the order */
  items: Array<{
    /** Item ID */
    id: string;
    /** Quantity ordered */
    quantity: number;
    /** Unit type (unit or set) */
    unitType?: string;
  }>;
  /** Invoice date (ISO string) */
  invoiceDate?: string;
}

/**
 * Response from creating an order with invoice
 */
export interface Response {
  /** Whether order creation succeeded */
  success: boolean;
  /** Status message */
  message: string;
  /** Created order ID */
  orderId?: string;
  /** Order number */
  orderNumber?: number;
}
