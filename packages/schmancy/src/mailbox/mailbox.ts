import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import type { 
	EmailTemplate, 
	EmailAttachment, 
	EmailComposeConfig, 
	SendEmailRequest,
	ImportSource 
} from './types'

/**
 * Main mailbox component that orchestrates the entire email composition flow
 * 
 * Features:
 * - Responsive layout with composer and preview panels
 * - Recipients management with floating boat interface
 * - Template selection and content editing
 * - Attachment handling
 * - Email validation and sending
 * 
 * @example
 * ```html
 * <schmancy-mailbox
 *   .config=${{ sendEndpoint: '/api/send-email' }}
 *   .templates=${emailTemplates}
 *   .importSources=${recipientSources}
 * ></schmancy-mailbox>
 * ```
 */
@customElement('schmancy-mailbox')
export class SchmancyMailbox extends $LitElement(css`
	:host {
		display: block;
		height: 100%;
	}
`) {
	/** Configuration for endpoints and handlers */
	@property({ type: Object }) config: EmailComposeConfig = {}
	
	/** Available email templates */
	@property({ type: Array }) templates: EmailTemplate[] = []
	
	/** Import sources for recipients panel */
	@property({ type: Array }) importSources: ImportSource[] = []
	
	/** Disable all interactions */
	@property({ type: Boolean }) disabled = false
	
	/** Recipients panel title */
	@property({ type: String }) recipientsTitle = 'Recipients'
	
	/** Empty state title for recipients */
	@property({ type: String }) recipientsEmptyTitle = 'No recipients yet'
	
	/** Empty state message for recipients */
	@property({ type: String }) recipientsEmptyMessage = 'Import from sources or upload a CSV'
	
	/** Enable CSV import functionality */
	@property({ type: Boolean }) enableCsvImport = true
	
	/** Enable drag and drop for files */
	@property({ type: Boolean }) enableDragDrop = true

	/** Email composition state */
	@state() private recipients: string[] = []
	@state() private selectedRecipients: string[] = []
	@state() private subject = ''
	@state() private body = ''
	@state() private templateId: string | null = null
	@state() private attachments: EmailAttachment[] = []
	@state() private isSending = false

	connectedCallback() {
		super.connectedCallback()
		this.setSending(this.disabled)
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)
		
		// Sync sending state
		if (changedProperties.has('disabled')) {
			this.setSending(this.disabled)
		}
	}

	/** Handle emails imported from various sources */
	private handleEmailsImported = (event: CustomEvent) => {
		const { emails } = event.detail
		
		// Add unique emails to recipients list
		const uniqueEmails = [...new Set([...this.recipients, ...emails])]
		const newEmails = emails.filter((email: string) => !this.recipients.includes(email))
		
		this.recipients = uniqueEmails
		
		// Auto-select imported emails
		this.selectedRecipients = [...new Set([...this.selectedRecipients, ...newEmails])]
		
		// Dispatch event to parent
		this.dispatchEvent(new CustomEvent('emails-imported', {
			detail: { emails: newEmails, source: event.detail.source },
			bubbles: true,
			composed: true
		}))
	}

	/** Handle individual recipient removal */
	private handleRecipientRemoved = (event: CustomEvent) => {
		const { email } = event.detail
		this.recipients = this.recipients.filter(e => e !== email)
		this.selectedRecipients = this.selectedRecipients.filter(e => e !== email)
		
		this.dispatchEvent(new CustomEvent('recipient-removed', {
			detail: { email },
			bubbles: true,
			composed: true
		}))
	}

	/** Handle clearing all recipients */
	private handleRecipientsCleared = () => {
		this.recipients = []
		this.selectedRecipients = []
		
		this.dispatchEvent(new CustomEvent('recipients-cleared', {
			bubbles: true,
			composed: true
		}))
	}

	/** Handle recipient selection changes */
	private handleSelectionChanged = (event: CustomEvent) => {
		const { selectedEmails } = event.detail
		this.selectedRecipients = selectedEmails
		
		this.dispatchEvent(new CustomEvent('selection-changed', {
			detail: { selectedEmails },
			bubbles: true,
			composed: true
		}))
	}

	/** Handle composer content changes */
	private handleEditorChange = (event: CustomEvent) => {
		const { subject, body, templateId, attachments } = event.detail
		this.subject = subject
		this.body = body
		this.templateId = templateId
		this.attachments = attachments
		
		this.dispatchEvent(new CustomEvent('compose-changed', {
			detail: { subject, body, templateId, attachments },
			bubbles: true,
			composed: true
		}))
	}

	/** Handle email sending */
	private handleSend = async () => {
		// Validation
		if (this.selectedRecipients.length === 0) {
			this.dispatchEvent(new CustomEvent('send-error', {
				detail: { error: 'Please select at least one recipient' },
				bubbles: true,
				composed: true
			}))
			return
		}

		if (!this.subject.trim()) {
			this.dispatchEvent(new CustomEvent('send-error', {
				detail: { error: 'Please enter a subject' },
				bubbles: true,
				composed: true
			}))
			return
		}

		if (!this.body.trim()) {
			this.dispatchEvent(new CustomEvent('send-error', {
				detail: { error: 'Please enter a message body' },
				bubbles: true,
				composed: true
			}))
			return
		}

		this.isSending = true

		try {
			const request: SendEmailRequest = {
				recipients: this.selectedRecipients,
				subject: this.subject,
				body: this.body,
				attachments: this.attachments,
				templateId: this.templateId
			}

			// Dispatch event for parent to handle
			this.dispatchEvent(new CustomEvent('send-email', {
				detail: { request },
				bubbles: true,
				composed: true
			}))

		} catch (error) {
			this.dispatchEvent(new CustomEvent('send-error', {
				detail: { error: error instanceof Error ? error.message : 'Failed to send email' },
				bubbles: true,
				composed: true
			}))
		} finally {
			this.isSending = false
		}
	}

	// Public API methods for external control

	/** Add recipients programmatically */
	public addRecipients(emails: string[]) {
		const uniqueEmails = [...new Set([...this.recipients, ...emails])]
		const newEmails = emails.filter(email => !this.recipients.includes(email))
		
		this.recipients = uniqueEmails
		this.selectedRecipients = [...new Set([...this.selectedRecipients, ...newEmails])]
	}

	/** Set email subject */
	public setSubject(subject: string) {
		this.subject = subject
	}

	/** Set email body */
	public setBody(body: string) {
		this.body = body
	}

	/** Set selected template */
	public setTemplate(templateId: string | null) {
		this.templateId = templateId
	}

	/** Clear all compose data */
	public clearCompose() {
		this.recipients = []
		this.selectedRecipients = []
		this.subject = ''
		this.body = ''
		this.templateId = null
		this.attachments = []
	}

	/** Set sending state */
	public setSending(sending: boolean) {
		this.isSending = sending
	}

	render() {
		const canSend = this.selectedRecipients.length > 0 && 
		                this.subject.trim() && 
		                this.body.trim() && 
		                !this.isSending && 
		                !this.disabled

		return html`
			<!-- Main Layout Container -->
			<div class="flex flex-col h-full gap-6 p-6">
				
				<!-- Main Content Section: Composer and Preview -->
				<div class="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
					
					<!-- Composer Section - Full width on mobile/tablet, half on large screens -->
					<div class="w-full xl:w-1/2 min-h-0 flex flex-col">
						<schmancy-email-editor
							.subject=${this.subject}
							.body=${this.body}
							.templates=${this.templates}
							.attachments=${this.attachments}
							.disabled=${this.disabled}
							.config=${this.config}
							@editor-change=${this.handleEditorChange}
							class="h-full"
						></schmancy-email-editor>
					</div>

					<!-- Preview Section - Full width on mobile/tablet, half on large screens -->
					<div class="w-full xl:w-1/2 min-h-0 flex flex-col">
						<schmancy-email-viewer
							.subject=${this.subject}
							.body=${this.body}
							.recipients=${this.selectedRecipients}
							.attachments=${this.attachments}
							class="h-full"
						></schmancy-email-viewer>
					</div>
					
				</div>

				<!-- Send Section - Sticky bottom bar -->
				<div class="flex-shrink-0">
					<schmancy-surface 
						type="container" 
						rounded="all" 
						class="p-4"
					>
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<!-- Send Info -->
							<div class="flex flex-col gap-1">
								<schmancy-typography type="body" token="sm" class="font-medium">
									${this.selectedRecipients.length} recipient${this.selectedRecipients.length === 1 ? '' : 's'} selected
								</schmancy-typography>
								${when(this.attachments.length > 0, () => html`
									<schmancy-typography type="body" token="xs">
										${this.attachments.length} attachment${this.attachments.length === 1 ? '' : 's'}
									</schmancy-typography>
								`)}
							</div>

							<!-- Send Button -->
							<schmancy-button
								variant="filled"
								?disabled=${!canSend}
								?loading=${this.isSending}
								@click=${this.handleSend}
								class="w-full sm:w-auto"
							>
								<schmancy-icon slot="prefix" size="18px">send</schmancy-icon>
								${this.isSending ? 'Sending...' : 'Send Email'}
							</schmancy-button>
						</div>
					</schmancy-surface>
				</div>
				
			</div>

			<!-- Recipients Panel as Floating Boat -->
			<schmancy-email-recipients
				.recipients=${this.recipients}
				.selectedRecipients=${this.selectedRecipients}
				.importSources=${this.importSources}
				.disabled=${this.disabled}
				.enableCsvImport=${this.enableCsvImport}
				.enableDragDrop=${this.enableDragDrop}
				.title=${this.recipientsTitle}
				.emptyStateTitle=${this.recipientsEmptyTitle}
				.emptyStateMessage=${this.recipientsEmptyMessage}
				@emails-imported=${this.handleEmailsImported}
				@recipient-removed=${this.handleRecipientRemoved}
				@recipients-cleared=${this.handleRecipientsCleared}
				@selection-changed=${this.handleSelectionChanged}
			></schmancy-email-recipients>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-mailbox': SchmancyMailbox
	}
}