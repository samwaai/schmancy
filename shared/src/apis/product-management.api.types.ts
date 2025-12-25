export interface LookupProductFromBarcodeRequest {
  barcode: string;
  orgId: string;
}

export interface LookupProductFromBarcodeResponse {
  success: boolean;
  product?: any;
  message?: string;
}

export interface ExtractItemFromProductRequest {
  product: any;
  orgId: string;
}

export interface ExtractItemFromProductResponse {
  success: boolean;
  item?: any;
  message?: string;
}

export interface ProcessSupplierDocumentRequest {
  pdfContent: string;
  orgId: string;
  fileName: string;
}

export interface ProcessSupplierDocumentResponse {
  success: boolean;
  items?: any[];
  message?: string;
}