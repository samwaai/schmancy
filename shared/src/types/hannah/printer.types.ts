/**
 * Thermal printer configuration for kitchen ticket printing
 *
 * Supports two connection types:
 * - 'epson-tm': Direct Epson ePOS SDK connection (legacy, requires SSL setup)
 * - 'qz-tray': QZ Tray bridge (recommended, no SSL issues)
 */
export interface HannahPrinter {
  id: string
  orgId: string
  businessId: string
  name: string
  type: 'epson-tm' | 'qz-tray'
  // For epson-tm type
  ipAddress: string
  port: number // default 8008 for Epson ePOS (8043 for SSL)
  // For qz-tray type
  qzPrinterName?: string // System printer name as shown in QZ Tray
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Data needed to print a kitchen ticket
 */
export interface KitchenTicketData {
  orderNumber: number
  tableNumber: string
  items: Array<{
    name: string
    quantity: number
    extras?: string[]  // Each extra on its own line, indented under main item
    notes?: string
  }>
  notes?: string
  createdAt: string
  // Payment info for footer
  total: number      // In cents
  tip: number        // In cents
  currency: string   // ISO 4217 code (EUR, USD, etc.)
  // Order type for VAT compliance
  consumptionType?: 'dine-in' | 'takeaway'
}

/**
 * Connection state for the print service
 */
export type PrinterConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'
