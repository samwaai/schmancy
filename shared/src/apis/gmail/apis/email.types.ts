/**
 * Gmail Email API Types
 * Shared types for Gmail email operations
 */

/**
 * Email attachment structure
 */
export interface Attachment {
  /** Attachment ID from Gmail */
  id: string;
  /** Filename of the attachment */
  filename: string;
  /** MIME type of the attachment */
  mimeType: string;
  /** Content buffer */
  content: Buffer;
  /** SHA-256 checksum of content */
  checksum: string;
}

/**
 * Request to send a new email
 */
export interface SendEmailRequest {
  /** Sender email address */
  from: string;
  /** Recipient email address */
  to: string;
  /** Email subject */
  subject: string;
  /** Plain text body */
  text?: string;
  /** HTML body */
  html?: string;
  /** CC recipients */
  cc?: string;
  /** BCC recipients */
  bcc?: string;
  /** Reply-To address */
  replyTo?: string;
  /** Email attachments */
  attachments?: Array<{
    /** Filename */
    filename: string;
    /** Content as Buffer or string */
    content: Buffer | string;
    /** MIME type */
    contentType: string;
  }>;
}

/**
 * Request to reply to an email
 */
export interface ReplyEmailRequest {
  /** Sender email address */
  from: string;
  /** Recipient email address */
  to: string;
  /** Email subject */
  subject: string;
  /** Plain text body */
  text?: string;
  /** HTML body */
  html?: string;
  /** CC recipients */
  cc?: string;
  /** BCC recipients */
  bcc?: string;
  /** Reply-To address */
  replyTo?: string;
  /** Thread ID for reply */
  threadId: string;
  /** Message-ID being replied to */
  inReplyTo: string;
  /** References header for threading */
  references: string;
}

/**
 * Response from sending an email
 */
export interface SentEmailResponse {
  /** Internal Gmail message ID */
  internalMessageId: string;
  /** Thread ID */
  threadId: string;
  /** RFC Message-ID header */
  rfcMessageId?: string;
}
