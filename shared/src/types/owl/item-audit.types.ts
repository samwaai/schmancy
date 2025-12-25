export interface ItemAudit {
  timestamp: string
  userId: string
  userName?: string
  action: ItemAuditAction
  fieldChanges: ItemFieldChange[]
  reason?: string
  metadata?: {
    sourceType?: 'manual' | 'invoice' | 'system' | 'api'
    sourceId?: string
    ipAddress?: string
    userAgent?: string
  }
}

export type ItemAuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'archive'
  | 'restore'
  | 'price_change'
  | 'stock_adjustment'
  | 'supplier_change'
  | 'category_change'
  | 'image_upload'
  | 'invoice_match'

export interface ItemFieldChange {
  field: string
  oldValue: any
  newValue: any
  displayOldValue?: string // Human-readable version
  displayNewValue?: string // Human-readable version
}

export interface ItemWithAudits {
  audits?: ItemAudit[]
}