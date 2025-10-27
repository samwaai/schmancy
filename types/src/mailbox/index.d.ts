/**
 * Schmancy Mailbox Components
 *
 * Comprehensive email composition and management system
 */
export * from './types';
export { SchmancyMailbox } from './mailbox';
export { SchmancyEmailEditor } from './email-editor';
export { SchmancyEmailViewer } from './email-viewer';
export { SchmancyEmailRecipients } from './email-recipients';
export { SchmancyEmailLayoutSelector } from './email-layout-selector';
export type { EmailTemplate, EmailAttachment, EmailComposeConfig, SendEmailRequest, SendEmailResponse, ImportSource, EmailCampaign, EmailRecipient, MailboxState, CurrentComposeState, BoatState, EmailPreviewMode } from './types';
