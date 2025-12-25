import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { OrderUnitType } from "./orders.types";
import { roundQuantity } from "../../utils/number";

/**
 * Audit trail for transaction changes.
 * Extended to support inventory preservation operations for surgical revert.
 */
export interface TransactionAudit {
  timestamp: string;
  quantityBefore: number;
  quantityAfter: number;
  reason?: string;
  userId?: string;

  // Inventory preservation context
  preservationType?: "COMPENSATING_SALE" | "SALE_REDUCED";
  orderId?: string; // The order that triggered this preservation
  delta?: number; // The PURCHASE quantity change that triggered preservation
}

export interface ITransaction {
  id: string;
  userId: string;
  itemId: string;
  warehouseID: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  orderId: string;
  type?: TransactionType;
  orgId: string;
  unitType: OrderUnitType;
  audits?: TransactionAudit[];
}

export enum TransactionType {
  ALL = "All",
  PURCHASE = "Purchase", // Positive quantity
  SALE = "Sale", // Negative quantity with no order
  TRANSFER = "Transfer", // Part of a transfer order
}

export class Transaction implements ITransaction {
  userId: string;
  itemId: string;
  warehouseID: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  orderId: string;
  orgId: string;
  unitType: OrderUnitType;
  type?: TransactionType;
  audits?: TransactionAudit[];
  constructor(
    userId: string,
    itemId: string,
    warehouseID: string,
    quantity: number,
    orderId: string,
    orgId: string,
    unitType: OrderUnitType,
    id = uuidv4(),
  ) {
    // Runtime validation: ensure quantity is valid
    if (!Number.isFinite(quantity)) {
      throw new Error(`Invalid transaction quantity: ${quantity}. Quantity must be a finite number.`);
    }

    if (Number.isNaN(quantity)) {
      throw new Error('Invalid transaction quantity: NaN. Quantity cannot be NaN.');
    }

    // Clean and round quantity to standard precision (5 decimals)
    const cleanedQuantity = roundQuantity(quantity);

    this.userId = userId;
    this.itemId = itemId;
    this.warehouseID = warehouseID;
    this.quantity = cleanedQuantity;
    this.createdAt = dayjs().toISOString();
    this.updatedAt = dayjs().toISOString();
    this.id = id;
    this.orderId = orderId;
    this.orgId = orgId;
    this.unitType = unitType;
  }
}
