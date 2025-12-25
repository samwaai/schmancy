import { OrderUnitType } from "../types";

export interface UpdateOrderRequest {
  orderId: string;
  items?: UpdatedItem[];
  deliveryDate?: string;
  notes?: string;
  warehouseID?: string;
}

export interface UpdateOrderResponse {
  success: boolean;
  message: string;
}

interface UpdatedItem {
  id: string;
  quantity: number;
  delivered?: number;
  unitType: OrderUnitType;
}

export interface ConfirmInvoiceReceptionRequest {
  orderId: string;
}

export interface ConfirmInvoiceReceptionResponse {
  success: boolean;
  message: string;
}
