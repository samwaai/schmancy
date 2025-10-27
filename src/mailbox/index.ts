/**
 * Schmancy Mailbox Components
 * 
 * Comprehensive email composition and management system
 */

// Export types
export * from './types'

// Export components
export { SchmancyMailbox } from './mailbox'
export { SchmancyEmailEditor } from './email-editor'
export { SchmancyEmailViewer } from './email-viewer'
export { SchmancyEmailRecipients } from './email-recipients'
export { SchmancyEmailLayoutSelector } from './email-layout-selector'

// Re-export key types for convenience
export type {
	EmailTemplate,
	EmailAttachment,
	EmailComposeConfig,
	SendEmailRequest,
	SendEmailResponse,
	ImportSource,
	EmailCampaign,
	EmailRecipient,
	MailboxState,
	CurrentComposeState,
	BoatState,
	EmailPreviewMode
} from './types'