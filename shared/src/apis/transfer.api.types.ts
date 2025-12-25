import { Order } from '../types';

export interface ConfirmTransferRequest extends Order {
  // Transfer orders must have these fields
  fromWarehouseID: string;
  warehouseID: string; // Destination warehouse
  supplierID: string; // Source warehouse stored here for transfers
}

export interface ConfirmTransferResponse {
  success: boolean;
  orderNumber: string;
  message: string;
}