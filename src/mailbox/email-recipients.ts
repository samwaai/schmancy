import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { when } from 'lit/directives/when.js'
import { $notify } from '../notification'
import type { BoatState } from './types'

/**
 * CSV parser interface (optional dependency)
 * Can be provided via global window object or imported
 */
interface CSVParser {
	parse(csvContent: string, config: any): {
		data: any[]
		meta: { fields?: string[] }
	}
}

/**
 * Email recipients management component with floating boat interface
 * 
 * Features:
 * - Floating boat UI that can be minimized/expanded
 * - CSV import with drag & drop
 * - Multiple import sources (configurable)
 * - Bulk selection and management
 * - Search and filtering
 * - Email validation
 * 
 * @example
 * ```html
 * <schmancy-email-recipients
 *   .recipients=${['user1@example.com', 'user2@example.com']}
 *   @emails-imported=${handleEmailsImported}
 * ></schmancy-email-recipients>
 * ```
 */
@customElement('schmancy-email-recipients')
export class SchmancyEmailRecipients extends $LitElement(css`
	:host {
		display: block;
		height: 100%;
	}
`) {
	/** Disable all interactions */
	@property({ type: Boolean }) disabled = false
	
	/** All available recipients */
	@property({ type: Array }) recipients: string[] = []
	
	/** Currently selected recipients */
	@property({ type: Array }) selectedRecipients: string[] = []
	
	
	/** Enable CSV import functionality */
	@property({ type: Boolean }) enableCsvImport = true
	
	/** Enable drag and drop for files */
	@property({ type: Boolean }) enableDragDrop = true
	
	/** Panel title */
	@property({ type: String }) title = 'Recipients'
	
	/** Empty state title */
	@property({ type: String }) emptyStateTitle = 'No recipients yet'
	
	/** Empty state message */
	@property({ type: String }) emptyStateMessage = 'Import from sources or upload a CSV'
	
	/** CSV parser function (optional) */
	@property({ type: Object }) csvParser?: CSVParser

	/** Internal state */
	@state() private dragOver = false
	@state() private localSelectedRecipients: Set<string> = new Set()
	@state() private searchQuery = ''
	@state() private filteredRecipients: string[] = []
	@state() private boatState: BoatState = 'minimized'

	/** File input reference */
	private fileInputRef = createRef<HTMLInputElement>()

	connectedCallback() {
		super.connectedCallback()
		// Initialize local selection state from prop
		this.localSelectedRecipients = new Set(this.selectedRecipients)
		// Initialize filtered recipients
		this.updateFilteredRecipients()
		
		// Listen for emails-imported events to ensure UI updates
		this.addEventListener('emails-imported', this.handleEmailsImported as EventListener)
	}

	private handleEmailsImported = () => {
		// Force update of filtered recipients when emails are imported
		this.updateFilteredRecipients()
		this.requestUpdate()
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)
		
		// Sync selection state when selectedRecipients prop changes
		if (changedProperties.has('selectedRecipients')) {
			this.localSelectedRecipients = new Set(this.selectedRecipients)
		}
		
		// Update filtered recipients when recipients or search changes
		if (changedProperties.has('recipients') || changedProperties.has('searchQuery')) {
			this.updateFilteredRecipients()
		}
		
		// Force re-render when recipients change (e.g., after import)
		if (changedProperties.has('recipients')) {
			this.requestUpdate()
		}
	}

	/** Handle CSV import trigger */
	private handleImportFromCSV = () => {
		if (!this.enableCsvImport) return
		this.fileInputRef.value?.click()
	}

	/** Handle file selection */
	private handleFileSelect = (event: Event) => {
		const input = event.target as HTMLInputElement
		const file = input.files?.[0]
		if (file) {
			this.processCSVFile(file)
		}
	}

	/** Handle drag and drop */
	private handleDrop = (event: DragEvent) => {
		if (!this.enableDragDrop) return
		
		event.preventDefault()
		this.dragOver = false

		const file = event.dataTransfer?.files[0]
		if (file) {
			this.processCSVFile(file)
		}
	}

	/** Process CSV file */
	private processCSVFile = (file: File) => {
		if (!file.name.endsWith('.csv')) {
			$notify.error('Please select a CSV file')
			return
		}

		const reader = new FileReader()
		reader.onload = e => {
			const content = e.target?.result as string
			try {
				const emails = this.parseCSV(content)

				if (emails.length === 0) {
					$notify.error('No valid email addresses found in CSV')
					return
				}

				// Dispatch event with new emails
				this.dispatchEvent(new CustomEvent('emails-imported', {
					detail: { emails, source: 'csv' },
					bubbles: true,
					composed: true
				}))

				$notify.success(`Imported ${emails.length} emails from CSV file`)
			} catch (error) {
				$notify.error('Failed to parse CSV file')
				console.error('CSV parse error:', error)
			}
		}
		reader.readAsText(file)
	}

	/** Parse CSV content */
	private parseCSV(csvContent: string): string[] {
		const emails: string[] = []

		let parseResult: { data: any[], meta: { fields?: string[] } }

		// Try to use provided parser or fallback to simple parsing
		if (this.csvParser) {
			parseResult = this.csvParser.parse(csvContent, {
				header: true,
				skipEmptyLines: true,
				dynamicTyping: true,
				delimiter: '',
				transformHeader: (header: string) => header.trim(),
			})
		} else {
			// Simple CSV parsing fallback
			parseResult = this.simpleCSVParse(csvContent)
		}

		const data = parseResult.data
		const headers = parseResult.meta.fields || []
		let emailField = headers.find(h => h.toLowerCase().includes('email'))

		if (!emailField) {
			// Try to detect email in first column with valid emails
			for (const header of headers) {
				const firstValue = data[0]?.[header]?.toString()
				if (firstValue && this.isValidEmail(firstValue)) {
					emailField = header
					break
				}
			}
		}

		if (!emailField) {
			throw new Error('No email column found in CSV')
		}

		// Extract and validate emails
		const emailSet = new Set<string>()
		for (const row of data) {
			const emailCandidate = row[emailField!]?.toString()
			if (!emailCandidate) continue

			const email = emailCandidate.toLowerCase().trim()

			if (this.isValidEmail(email) && !emailSet.has(email)) {
				emailSet.add(email)
				emails.push(email)
			}
		}

		return emails
	}

	/** Simple CSV parsing fallback */
	private simpleCSVParse(csvContent: string): { data: any[], meta: { fields?: string[] } } {
		const lines = csvContent.split('\n').filter(line => line.trim())
		if (lines.length === 0) {
			return { data: [], meta: {} }
		}

		// Parse headers
		const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
		const data: any[] = []

		// Parse rows
		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
			const row: any = {}
			headers.forEach((header, index) => {
				row[header] = values[index] || ''
			})
			data.push(row)
		}

		return { data, meta: { fields: headers } }
	}

	/** Validate email format */
	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email.trim())
	}

	/** Toggle recipient selection */
	private toggleRecipientSelection = (email: string) => {
		if (this.localSelectedRecipients.has(email)) {
			this.localSelectedRecipients.delete(email)
		} else {
			this.localSelectedRecipients.add(email)
		}
		this.localSelectedRecipients = new Set(this.localSelectedRecipients)
		this.dispatchSelectionChange()
	}

	/** Select all filtered recipients */
	private selectAll = () => {
		this.localSelectedRecipients = new Set(this.filteredRecipients)
		this.dispatchSelectionChange()
	}

	/** Clear all selections */
	private selectNone = () => {
		this.localSelectedRecipients.clear()
		this.localSelectedRecipients = new Set()
		this.dispatchSelectionChange()
	}

	/** Remove individual recipient */
	private removeRecipient = (email: string) => {
		this.dispatchEvent(new CustomEvent('recipient-removed', {
			detail: { email },
			bubbles: true,
			composed: true
		}))
	}

	/** Clear all recipients */
	private clearAll = () => {
		this.dispatchEvent(new CustomEvent('recipients-cleared', {
			bubbles: true,
			composed: true
		}))
	}

	/** Update filtered recipients based on search */
	private updateFilteredRecipients = () => {
		// Ensure recipients is an array
		const recipientsList = Array.isArray(this.recipients) ? this.recipients : []
		
		if (!this.searchQuery.trim()) {
			this.filteredRecipients = [...recipientsList]
		} else {
			const query = this.searchQuery.toLowerCase()
			this.filteredRecipients = recipientsList.filter(email => 
				email.toLowerCase().includes(query)
			)
		}
	}

	/** Handle search input */
	private handleSearchInput = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.searchQuery = input.value
	}

	/** Clear search query */
	private clearSearch = () => {
		this.searchQuery = ''
	}

	/** Dispatch selection change event */
	private dispatchSelectionChange = () => {
		this.dispatchEvent(new CustomEvent('selection-changed', {
			detail: { selectedEmails: Array.from(this.localSelectedRecipients) },
			bubbles: true,
			composed: true
		}))
	}

	/** Handle boat state changes */
	private handleBoatStateChange = (event: CustomEvent) => {
		this.boatState = event.detail
	}

	// Public API methods

	/** Add recipients programmatically */
	public addRecipients(emails: string[]) {
		if (!emails.length) return
		
		// Update recipients prop data
		const uniqueEmails = [...new Set([...this.recipients, ...emails])]
		const newEmails = emails.filter(email => !this.recipients.includes(email))
		
		// Update internal state
		this.recipients = uniqueEmails
		this.selectedRecipients = [...new Set([...this.selectedRecipients, ...newEmails])]
		this.localSelectedRecipients = new Set(this.selectedRecipients)
		
		// Force UI update
		this.updateFilteredRecipients()
		this.requestUpdate()
	}

	/** Show boat */
	public showBoat() {
		this.boatState = 'minimized'
	}

	/** Hide boat */
	public hideBoat() {
		this.boatState = 'hidden'
	}

	/** Expand boat */
	public expandBoat() {
		this.boatState = 'expanded'
	}

	/** Toggle boat state */
	public toggleBoat() {
		this.boatState = this.boatState === 'hidden' ? 'minimized' : 
						this.boatState === 'minimized' ? 'expanded' : 'hidden'
	}

	render() {
		return this.renderBoatLayout()
	}

	/** Render floating boat layout */
	private renderBoatLayout() {
		return html`
			<!-- Hidden file input for CSV import -->
			${when(this.enableCsvImport, () => html`
				<input
					type="file"
					accept=".csv"
					${ref(this.fileInputRef)}
					@change=${this.handleFileSelect}
					class="hidden"
				/>
			`)}

			<schmancy-boat 
				.state=${this.boatState}
				@change=${this.handleBoatStateChange}
			>
				<!-- Boat Header -->
				<div slot="header" class="flex items-center justify-between w-full px-4 py-2">
					<div class="flex items-center gap-3">
						<schmancy-icon size="20px">group</schmancy-icon>
						<schmancy-typography type="title" token="md" class="font-semibold">
							${this.title}
						</schmancy-typography>
						${when(this.recipients.length > 0, () => html`
							<schmancy-badge>
								${this.localSelectedRecipients.size}/${this.recipients.length}
							</schmancy-badge>
						`)}
					</div>
				</div>

				<!-- Boat Content -->
				<div class="h-full flex flex-col max-h-[70vh]">
					${this.renderBoatContent()}
				</div>
			</schmancy-boat>
		`
	}

	/** Render boat content */
	private renderBoatContent() {
		return html`
			<!-- Search Bar and CSV Import on one line -->
			<div class="p-4 flex gap-3">
				<schmancy-input
					type="text"
					placeholder="Search recipients"
					.value=${this.searchQuery}
					@input=${this.handleSearchInput}
					class="flex-1"
				>
					${when(this.searchQuery, () => html`
						<schmancy-button
							slot="suffix" 
							variant="text"
							@click=${this.clearSearch}
						>
							<schmancy-icon size="16px">close</schmancy-icon>
						</schmancy-button>
					`)}
				</schmancy-input>
				
				${when(this.enableCsvImport, () => html`
					<schmancy-button
						variant="outlined"
						@click=${this.handleImportFromCSV}
						?disabled=${this.disabled}
					>
						<schmancy-icon slot="prefix" size="16px">upload_file</schmancy-icon>
						Import
					</schmancy-button>
				`)}
			</div>

			${when(this.recipients.length > 0, () => html`
				<!-- Bulk Actions -->
				<div class="px-4 pb-4">
					<div class="flex items-center gap-3">
						<schmancy-button 
							variant="outlined"
							@click=${this.selectAll}
							?disabled=${this.localSelectedRecipients.size === this.filteredRecipients.length}
						>
							<schmancy-icon slot="prefix" size="14px">select_all</schmancy-icon>
							Select All
						</schmancy-button>
						
						<schmancy-button 
							variant="outlined"
							@click=${this.selectNone}
							?disabled=${this.localSelectedRecipients.size === 0}
						>
							<schmancy-icon slot="prefix" size="14px">deselect</schmancy-icon>
							Clear Selection
						</schmancy-button>
						
						<div class="flex-1"></div>
						
						<schmancy-button variant="text" @click=${this.clearAll}>
							<schmancy-icon slot="prefix" size="14px">delete_forever</schmancy-icon>
							Clear All
						</schmancy-button>
					</div>
				</div>

				<!-- Recipients List -->
				<div class="flex-1 overflow-y-auto px-4 pb-4">
					${when(
						this.filteredRecipients.length > 0,
						() => html`
							<div class="flex flex-wrap gap-3">
								${repeat(
									this.filteredRecipients,
									email => email,
									email => html`
										<schmancy-button
											variant=${this.localSelectedRecipients.has(email) ? 'filled' : 'outlined'}
											@click=${(e:Event) => {
												e.stopPropagation()
												e.preventDefault()
												this.toggleRecipientSelection(email)}}
											class="cursor-pointer flex items-center gap-2"
										>
											<span class="truncate flex-1 text-left">${email}</span>
											<schmancy-icon
												@click=${(e: Event) => {
													e.stopPropagation()
													this.removeRecipient(email)
												}}
												size="16px"
												class="ml-2"
											>close</schmancy-icon>
										</schmancy-button>
									`,
								)}
							</div>
						`,
						() => html`
							<div class="text-center py-8">
								<schmancy-icon size="32px" class="opacity-50 mb-2">search_off</schmancy-icon>
								<schmancy-typography type="body" token="sm" class="mb-2">
									No recipients match "${this.searchQuery}"
								</schmancy-typography>
								<schmancy-button variant="outlined" @click=${this.clearSearch}>
									Clear Search
								</schmancy-button>
							</div>
						`
					)}
				</div>
			`, () => html`
				<!-- Empty State -->
				<div class="flex-1 flex items-center justify-center p-8">
					<div class="text-center space-y-4">
						<schmancy-icon size="48px" class="opacity-30">mail_outline</schmancy-icon>
						<schmancy-typography type="title" token="md" class="mb-2">
							${this.emptyStateTitle}
						</schmancy-typography>
						<schmancy-typography type="body" token="sm">
							${this.emptyStateMessage}
						</schmancy-typography>
					</div>
				</div>
			`)}

			<!-- Drag Overlay -->
			${when(
				this.dragOver && this.enableDragDrop,
				() => html`
					<div 
						class="absolute inset-4 flex items-center justify-center border-2 border-dashed border-primary rounded-lg z-10"
						@dragover=${(e: DragEvent) => {
							e.preventDefault()
							this.dragOver = true
						}}
						@dragleave=${() => (this.dragOver = false)}
						@drop=${this.handleDrop}
					>
						<schmancy-surface type="surfaceDim" rounded="all" class="p-6 text-center">
							<schmancy-icon size="48px" class="mb-2">upload</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Drop CSV file here
							</schmancy-typography>
						</schmancy-surface>
					</div>
				`,
			)}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-email-recipients': SchmancyEmailRecipients
	}
}