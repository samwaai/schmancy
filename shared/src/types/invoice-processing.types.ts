import { FieldValue } from 'firebase-admin/firestore';

export type InvoiceProcessingStatus = 
  | 'pending'
  | 'uploading'
  | 'uploaded'
  | 'extracting'
  | 'identifying_organization'
  | 'identifying_supplier'
  | 'matching_orders'
  | 'reconciling'
  | 'storing'
  | 'completed'
  | 'failed'
  | 'no_match'
  | 'manual_review_required';

export type InvoiceProcessingStage = 
  | 'upload'
  | 'validation'
  | 'extraction'
  | 'organization_identification'
  | 'supplier_identification'
  | 'temporal_validation'
  | 'candidate_discovery'
  | 'verification'
  | 'decision'
  | 'persistence';

export interface InvoiceProcessingError {
  code: string;
  message: string;
  stage: InvoiceProcessingStage;
  timestamp: Date | FieldValue;
  details?: any;
}

export interface InvoiceProcessingLog {
  stage: InvoiceProcessingStage;
  status: 'started' | 'completed' | 'failed';
  message: string;
  timestamp: Date | FieldValue;
  duration?: number; // milliseconds
}

export interface ToBeProcessedInvoice {
  // Document ID is the checksum
  checksum: string;
  
  // File metadata
  fileName: string;
  fileSize: number;
  uploadedAt: Date | FieldValue;
  uploadedBy: string; // User ID
  
  // Organization context
  organizationId: string;
  
  // Processing status
  status: InvoiceProcessingStatus;
  currentStage?: InvoiceProcessingStage;
  progress: number; // 0-100
  
  // Processing attempts
  attemptCount: number;
  lastAttemptAt?: Date | FieldValue;
  nextRetryAt?: Date | FieldValue;
  
  // Processing details
  statusMessage?: string;
  processingLogs: InvoiceProcessingLog[];
  errors: InvoiceProcessingError[];
  
  // Results (once processed)
  extractedData?: {
    invoiceNumber?: string;
    invoiceDate?: string;
    senderName?: string;
    totalAmount?: number;
    currency?: string;
  };
  
  // Matching results
  matchConfidence?: number;
  matchDecision?: 'AUTO_MATCH' | 'REVIEW_SUGGESTED' | 'MANUAL_REQUIRED' | 'NO_ORDER_EXISTS';
  
  // Storage references
  temporaryStorageUrl?: string;
  permanentStorageUrl?: string;
  
  // Timestamps
  createdAt: Date | FieldValue;
  updatedAt: Date | FieldValue;
  completedAt?: Date | FieldValue;
}

// Helper type for frontend usage (with dates as Date objects)
export interface ToBeProcessedInvoiceDoc extends Omit<
  ToBeProcessedInvoice, 
  'uploadedAt' | 'createdAt' | 'updatedAt' | 'completedAt' | 'lastAttemptAt' | 'nextRetryAt'
> {
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  processingLogs: Array<Omit<InvoiceProcessingLog, 'timestamp'> & { timestamp: Date }>;
  errors: Array<Omit<InvoiceProcessingError, 'timestamp'> & { timestamp: Date }>;
}

// Status message templates
export const PROCESSING_STATUS_MESSAGES: Record<InvoiceProcessingStatus, string> = {
  pending: 'Waiting to process',
  uploading: 'Uploading file...',
  uploaded: 'File uploaded successfully',
  extracting: 'Extracting invoice data...',
  identifying_organization: 'Identifying organization...',
  identifying_supplier: 'Identifying supplier...',
  matching_orders: 'Matching to orders...',
  reconciling: 'Reconciling amounts...',
  storing: 'Storing results...',
  completed: 'Processing completed',
  failed: 'Processing failed',
  no_match: 'No matching order found',
  manual_review_required: 'Manual review required'
};

// Stage progress mapping
export const STAGE_PROGRESS_MAP: Record<InvoiceProcessingStage, number> = {
  upload: 10,
  validation: 15,
  extraction: 25,
  organization_identification: 40,
  supplier_identification: 50,
  temporal_validation: 60,
  candidate_discovery: 70,
  verification: 80,
  decision: 90,
  persistence: 100
};