/**
 * Hannah Table Types
 * Restaurant tables with QR code support
 */

export type HannahTableServiceType = 'self-service' | 'table-service';

export interface HannahTable {
  id: string;
  orgId: string;
  businessId: string;
  tableNumber: string;
  qrCode: string;  // URL for QR code
  active: boolean;
  serviceType?: HannahTableServiceType; // Defaults to 'self-service' if not set
}
