import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export type OrderUnitType = "unit" | "set";

export type OrderItem = {
  id: string;
  quantity: number;
  // status: ITEM_STATUSES
  supplierID: string;
  delivered?: number;
  unitType: OrderUnitType;
};

export enum ORDER_STATUSES {
  //  'Draft' | 'Open' | 'Paid' | 'Cancelled'
  Draft = "Draft",
  SENT = "Sent",
  RECEIVED = "Received",
  Cancelled = "Cancelled",
  Initialization = "Initialization",
  Transfer = "Transfer",
  ERROR = "Error",
  MERGED = "Merged", // New status for merged orders
  RETURN = "Return", // New status for return orders
}

// This is a partial update for packages/shared/src/types/owl/orders.types.ts

// Update the Order class to include merged order fields
export class Order {
  id: string;
  createdBy: string;
  items: OrderItem[] = [];
  totalAmount: number = 0;
  status = ORDER_STATUSES.Draft;
  createdAt = dayjs().toISOString();
  updatedAt = dayjs().toISOString();
  confirmationSentAt?: string;
  invoiceConfirmedAt?: string;
  confirmedInvoiceBy?: string;
  warehouseID;
  paid = false;
  deliveryDate?: string;
  orgId: string;
  confirmedDeliveryBy?: string;
  deliveryConfirmedAt?: string;
  orderNumber?: number;
  gmailMessageID?: string;
  emailMessageID?: string;
  emailThreadID?: string;
  deliveryNote?: string;
  invoice?: string;
  invoiceId?: string;
  fromWarehouseID?: string;
  notes?: string; // Optional notes about the order/transfer
  supplierID: string = "";
  wasTransferOrder?: boolean; // Indicates if this was a transfer order

  // Add these fields for order merging support
  merged?: boolean; // Indicates if this order has been merged into another
  masterOrderId?: string; // ID of the order this one is merged into
  mergedOrders?: string[]; // IDs of orders merged into this one
  mergedAt?: string; // When this order was merged
  mergedBy?: string; // User who performed the merge

  // Add these fields for return order support
  returnReason?: string; // Reason for the return
  returnConfirmedAt?: string; // When the return was confirmed
  returnConfirmedBy?: string; // User who confirmed the return

  constructor(
    warehouseID: string,
    createdBy: string,
    organization: string,
    status: ORDER_STATUSES,
  ) {
    this.id = uuidv4();
    this.warehouseID = warehouseID;
    this.createdBy = createdBy;
    this.status = status;
    this.orgId = organization;
  }
}
