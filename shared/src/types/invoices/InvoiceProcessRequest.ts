export interface InvoiceDocument {
  filename: string;
  mimeType: string;
  content: Buffer;
  storageUrl?: string;
  checksum: string;
}
