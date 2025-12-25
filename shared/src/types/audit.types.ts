/**
 * Generic Audit Types for tracking changes to documents
 *
 * These types provide a simple, lightweight audit trail for document modifications.
 * Use these for field-level change tracking on any document type.
 */

import { z } from 'zod'

/**
 * Zod schema for a single field change in a document
 */
export const AuditChangeSchema = z.object({
  field: z.string(),           // The field that was changed (e.g., 'ignored', 'status')
  oldValue: z.unknown(),       // Previous value (use unknown for type safety)
  newValue: z.unknown(),       // New value (use unknown for type safety)
  changedBy: z.string(),       // User email or ID who made the change
  changedAt: z.string(),       // ISO 8601 timestamp when change was made
  reason: z.string().optional(), // Optional reason for the change
})

/**
 * TypeScript interface for a single field change
 */
export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

/**
 * Zod schema for document audit log
 */
export const DocumentAuditLogSchema = z.object({
  changes: z.array(AuditChangeSchema), // Array of all changes, newest first
})

/**
 * TypeScript interface for document audit log
 */
export interface DocumentAuditLog {
  changes: AuditChange[];
}
