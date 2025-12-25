export type ItemMatcherFnRequest = {
  itemDescription: string;
  orderId: string;
  forcedItemId?: string;
  quantityFactor?: number;
  
  // Invoice data for better matching
  invoiceUnitPrice?: number;
  invoiceQuantity?: number;
};
export type ItemMatcherFnResponse = {
  success: boolean;
  itemId?: string | null;
  confidence?: number;
  source?: string;
  message: string;

  quantityFactor?: number;

  isServiceCharge?: boolean;
  serviceType?: string;
};
