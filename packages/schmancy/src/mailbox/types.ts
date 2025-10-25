/**
 * Mailbox component types and interfaces
 * Extracted from funkhaus-events and generalized for reusability
 */

/**
 * Email template definition
 */
export interface EmailTemplate {
	id: string
	name: string
	subject: string
	body: string
	isDefault?: boolean
	createdAt?: Date | string
	category?: string
	description?: string
	thumbnail?: string
}

/**
 * Email attachment definition
 */
export interface EmailAttachment {
	id: string
	file: File
	name: string
	size: number
	type: string
	url?: string // For attachments that have been uploaded
}

/**
 * Configuration for email composer component
 */
export interface EmailComposeConfig {
	/** Endpoint for sending emails */
	sendEndpoint?: string
	/** Endpoint for fetching templates */
	templatesEndpoint?: string
	/** Endpoint for uploading files */
	uploadEndpoint?: string
	/** Function to authenticate requests */
	authenticateRequest?: (request: RequestInit) => RequestInit
	/** Custom upload handler for attachments */
	uploadHandler?: (file: File) => Promise<string>
	/** Custom image upload handler */
	imageUploadHandler?: (file: File) => Promise<string>
}

/**
 * Email send request structure
 */
export interface SendEmailRequest {
	recipients: string[]
	subject: string
	body: string
	attachments: EmailAttachment[]
	templateId?: string | null
}

/**
 * Email send response structure
 */
export interface SendEmailResponse {
	success: boolean
	message: string
	campaignId?: string
}

/**
 * Import source definition for recipients panel
 */
export interface ImportSource {
	id: string
	label: string
	icon: string
	handler: () => void
}

/**
 * CSV parsing result
 */
export interface CsvParseResult {
	validEmails: string[]
	invalidEmails: string[]
	totalRows: number
	duplicates: string[]
}

/**
 * Email recipient status
 */
export type EmailRecipientStatus = 'pending' | 'sent' | 'failed'

/**
 * Email recipient definition
 */
export interface EmailRecipient {
	email: string
	name?: string
	status: EmailRecipientStatus
	error?: string
	sentAt?: Date | string
}

/**
 * Email campaign definition
 */
export interface EmailCampaign {
	id?: string
	subject: string
	body: string
	plainText?: string
	recipients: EmailRecipient[]
	status: 'draft' | 'sent' | 'failed' | 'sending'
	createdAt?: Date | string
	sentAt?: Date | string
	createdBy?: string
	templateId?: string
	attachments?: EmailAttachment[]
	stats?: {
		totalRecipients: number
		sent: number
		failed: number
		batches?: number
		retries?: number
		opened?: number
		clicked?: number
	}
}

/**
 * Mailbox state for context management
 */
export interface MailboxState {
	campaigns: EmailCampaign[]
	templates: EmailTemplate[]
	loading: boolean
	error: string | null
	currentCampaign: Partial<EmailCampaign> | null
}

/**
 * Current compose state for context management
 */
export interface CurrentComposeState {
	selectedEmails: string[]
	subject: string
	body: string
	templateId: string | null
	attachments: EmailAttachment[]
}

/**
 * Email compose events
 */
export type EmailComposeEvents = {
	'emails-imported': CustomEvent<{ emails: string[]; source: string }>
	'recipient-removed': CustomEvent<{ email: string }>
	'recipients-cleared': CustomEvent<{}>
	'selection-changed': CustomEvent<{ selectedEmails: string[] }>
	'compose-changed': CustomEvent<{
		subject: string
		body: string
		templateId: string | null
		attachments: EmailAttachment[]
	}>
	'send-email': CustomEvent<{ request: SendEmailRequest }>
	'send-error': CustomEvent<{ error: string }>
}

/**
 * Boat state options for recipients panel
 */
export type BoatState = 'hidden' | 'minimized' | 'expanded'

/**
 * Email preview view modes
 */
export type EmailPreviewMode = 'html' | 'plaintext'