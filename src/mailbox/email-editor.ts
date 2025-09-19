import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { repeat } from 'lit/directives/repeat.js'
import { fromEvent, takeUntil } from 'rxjs'
import type { EmailAttachment, EmailComposeConfig, EmailTemplate } from './types'
import { $notify } from '../notification'
import { $dialog } from '../dialog'
import { sheet } from '../sheet/sheet.service'
import './email-layout-selector'
import { SchmancyEmailTemplatePicker } from './email-template-picker'

/**
 * Email editor component with rich text formatting and file attachments
 * 
 * Features:
 * - Markdown formatting toolbar
 * - Image upload and insertion
 * - File attachments with drag & drop
 * - Layout templates (columns, sidebars, image rows)
 * - Real-time character/word count
 * 
 * @example
 * ```html
 * <schmancy-email-editor
 *   .subject="Welcome to our service"
 *   .body="Email content..."
 *   @editor-change=${handleChange}
 * ></schmancy-email-editor>
 * ```
 */
@customElement('schmancy-email-editor')
export class SchmancyEmailEditor extends $LitElement(css`
	:host {
		display: block;
		height: 100%;
	}
`) {
	/** Email subject */
	@property({ type: String }) subject = ''
	
	/** Email body content (markdown) */
	@property({ type: String }) body = ''
	
	
	/** Disable all interactions */
	@property({ type: Boolean }) disabled = false
	
	/** Email attachments */
	@property({ type: Array }) attachments: EmailAttachment[] = []
	
	/** Configuration for upload handlers */
	@property({ type: Object }) config: EmailComposeConfig = {}
	
	/** Available email templates */
	@property({ type: Array }) templates: EmailTemplate[] = this.getDefaultTemplates()

	/** Internal state */
	@state() private dragOver = false
	@state() private isUploading = false

	/** Element references */
	private subjectInputRef = createRef<HTMLInputElement>()
	private bodyTextAreaRef = createRef<any>()
	private fileInputRef = createRef<HTMLInputElement>()
	private imageInputRef = createRef<HTMLInputElement>()

	connectedCallback() {
		super.connectedCallback()
		this.addEventListeners()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Event listeners are automatically cleaned up via takeUntil(this.disconnecting)
	}

	/** Get default email templates */
	private getDefaultTemplates(): EmailTemplate[] {
		return [
			{
				id: 'welcome',
				name: 'Welcome Email',
				subject: 'Welcome to Our Community! 🌟',
				description: 'A warm welcome message for new users',
				category: 'onboarding',
				body: `# Welcome to Our Community!

We're thrilled to have you on board. Thank you for joining us on this journey.

## What's Next?

* **Explore** your dashboard and discover all the features
* **Connect** with other community members
* **Get support** whenever you need it - we're here to help

---

*Need assistance? Simply reply to this email and we'll get back to you within 24 hours.*

Best regards,  
The Team`
			},
			{
				id: 'newsletter',
				name: 'Newsletter',
				subject: 'Weekly Insights & Updates',
				description: 'Regular newsletter template with updates and insights',
				category: 'communication',
				body: `# This Week's Highlights

## Featured Story

**[Article Title]**  
Brief description of the main story or update that you want to highlight this week.

[Read More](https://example.com)

## Quick Updates

* **Update 1**: Brief description of an important update
* **Update 2**: Another noteworthy development
* **Update 3**: Additional news worth sharing

## Upcoming Events

**[Event Name]** - *Date*  
Short description of the upcoming event.

---

*Thanks for reading! Forward this to a friend who might enjoy it.*

Until next week,  
The Team`
			},
			{
				id: 'product-launch',
				name: 'Product Launch',
				subject: 'Introducing Our Latest Innovation 🚀',
				description: 'Announce new products or features',
				category: 'marketing',
				body: `# Something Amazing is Here

We've been working hard behind the scenes, and today we're excited to introduce our latest creation.

## Key Features

* **Feature 1**: Benefit that matters to your users
* **Feature 2**: Another compelling capability
* **Feature 3**: The feature that sets you apart

## Early Access

As a valued member, you get **exclusive early access** starting today.

[Get Started Now](https://example.com)

---

*Questions? We'd love to hear from you. Just hit reply!*

Best,  
The Product Team`
			},
			{
				id: 'event-invitation',
				name: 'Event Invitation',
				subject: 'You\'re Invited: [Event Name]',
				description: 'Professional event invitation template',
				category: 'events',
				body: `# You're Invited!

## [Event Name]

**When**: [Date & Time]  
**Where**: [Location or Virtual Link]  
**Duration**: [Duration]

Join us for an exclusive gathering where we'll explore [brief event description].

## What to Expect

* **Networking** with industry professionals
* **Insights** from leading experts
* **Interactive** sessions and discussions

## RSVP Required

Space is limited, so please confirm your attendance by [RSVP Date].

[Confirm Attendance](https://example.com)

---

*Can't make it? Let us know and we'll share the key highlights with you.*

Looking forward to seeing you there,  
The Events Team`
			},
			{
				id: 'thank-you',
				name: 'Thank You',
				subject: 'Thank You - It Means Everything',
				description: 'Express gratitude to customers or supporters',
				category: 'appreciation',
				body: `# Thank You

Your support means the world to us.

Whether you've been with us from the beginning or just joined our community, we want you to know how much we appreciate you.

## Because of You

* We've been able to improve our service
* Our community has grown stronger
* We've achieved milestones we never thought possible

## What's Next

We're committed to continuing to earn your trust and providing even more value in the coming months.

---

*Your feedback shapes everything we do. Reply anytime with thoughts or suggestions.*

With genuine gratitude,  
The Team`
			},
			{
				id: 'feedback-request',
				name: 'Feedback Request',
				subject: 'Your Opinion Matters - 2 Minutes?',
				description: 'Request feedback or reviews from users',
				category: 'feedback',
				body: `# We'd Love Your Feedback

Your experience matters to us, and we're always looking for ways to improve.

## Quick Favor?

Could you spare **2 minutes** to share your thoughts? Your honest feedback helps us serve you better.

[Share Your Feedback](https://example.com)

## What We're Asking

* How has your experience been so far?
* What's working well for you?
* What could we improve?

## Thank You Gift

As a small token of appreciation, everyone who completes our feedback form receives [incentive].

---

*Every response is read personally by our team. We take your input seriously.*

Thanks in advance,  
The Team`
			},
			{
				id: 'password-reset',
				name: 'Password Reset',
				subject: 'Reset Your Password - Action Required',
				description: 'Secure password reset instructions',
				category: 'security',
				body: `# Password Reset Request

We received a request to reset the password for your account.

## Reset Your Password

Click the button below to create a new password. This link will expire in **24 hours** for your security.

[Reset Password](https://example.com/reset)

## Didn't Request This?

If you didn't request a password reset, please ignore this email. Your account remains secure.

## Need Help?

If you're having trouble with the reset process, contact our support team and we'll assist you right away.

---

*For security reasons, this link can only be used once and expires in 24 hours.*

Best regards,  
Security Team`
			},
			{
				id: 'order-confirmation',
				name: 'Order Confirmation',
				subject: 'Order Confirmed - #[ORDER-NUMBER]',
				description: 'Professional order confirmation template',
				category: 'commerce',
				body: `# Order Confirmation

Thanks for your order! We've received your payment and are preparing your items for shipment.

## Order Details

**Order Number**: #[ORDER-NUMBER]  
**Order Date**: [DATE]  
**Total**: $[AMOUNT]

## Items Ordered

* **[Item 1]** - Quantity: [QTY] - $[PRICE]
* **[Item 2]** - Quantity: [QTY] - $[PRICE]

## Shipping Information

**Address**: [SHIPPING ADDRESS]  
**Method**: [SHIPPING METHOD]  
**Estimated Delivery**: [DELIVERY DATE]

## Next Steps

You'll receive a tracking number via email once your order ships (usually within 1-2 business days).

[Track Your Order](https://example.com/track)

---

*Questions about your order? Reply to this email or contact our support team.*

Thank you for your business,  
The Fulfillment Team`
			}
		]
	}

	private addEventListeners() {
		// Keyboard events
		fromEvent(this, 'keydown').pipe(
			takeUntil(this.disconnecting)
		).subscribe(this.handleKeyDown)

		// Document paste events
		fromEvent(document, 'paste').pipe(
			takeUntil(this.disconnecting)
		).subscribe(this.handlePaste)

		// Document drag events
		fromEvent(document, 'dragenter').pipe(
			takeUntil(this.disconnecting)
		).subscribe(this.handleDragEnter)

		fromEvent(document, 'dragleave').pipe(
			takeUntil(this.disconnecting)
		).subscribe(this.handleDocumentDragLeave)

		fromEvent(document, 'drop').pipe(
			takeUntil(this.disconnecting)
		).subscribe(this.handleDocumentDrop)
	}

	/** Handle keyboard shortcuts and tab indentation */
	private handleKeyDown = (e: KeyboardEvent) => {
		if (this.disabled) return

		// Tab key inserts 2 spaces instead of changing focus
		const textarea = this.bodyTextAreaRef.value?.shadowRoot?.querySelector('textarea')
		if (e.key === 'Tab' && e.target === textarea) {
			e.preventDefault()
			this.insertAtCursor('  ')
		}
	}

	/** Handle paste events for image pasting */
	private handlePaste = (event: ClipboardEvent) => {
		const textarea = this.bodyTextAreaRef.value?.shadowRoot?.querySelector('textarea')
		if (this.disabled || document.activeElement !== textarea) return

		const items = event.clipboardData?.items
		if (!items) return

		for (let i = 0; i < items.length; i++) {
			const item = items[i]
			if (item.type.indexOf('image') !== -1) {
				event.preventDefault()
				const file = item.getAsFile()
				if (file) {
					this.uploadImage(file)
				}
				break
			}
		}
	}

	/** Handle subject input changes */
	private handleSubjectChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.subject = input.value
		this.dispatchChange()
	}

	/** Handle body textarea changes */
	private handleBodyChange = (event: any) => {
		this.body = event.detail.value
		this.dispatchChange()
	}

	/** Dispatch composer change event */
	private dispatchChange = () => {
		this.dispatchEvent(new CustomEvent('editor-change', {
			detail: {
				subject: this.subject,
				body: this.body,
				attachments: this.attachments
			},
			bubbles: true,
			composed: true
		}))
	}

	/** Insert text at cursor position */
	private insertAtCursor(text: string, selectText?: string) {
		if (!this.bodyTextAreaRef.value) return

		// For schmancy-textarea, access the internal textarea
		const textarea = this.bodyTextAreaRef.value.shadowRoot?.querySelector('textarea')
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		
		const newValue = 
			textarea.value.substring(0, start) +
			text +
			textarea.value.substring(end)
		
		this.body = newValue
		this.dispatchChange()
		
		this.updateComplete.then(() => {
			const updatedTextarea = this.bodyTextAreaRef.value?.shadowRoot?.querySelector('textarea')
			if (updatedTextarea) {
				updatedTextarea.focus()
				if (selectText) {
					const selectStart = start + text.indexOf(selectText)
					const selectEnd = selectStart + selectText.length
					updatedTextarea.setSelectionRange(selectStart, selectEnd)
				} else {
					updatedTextarea.setSelectionRange(start + text.length, start + text.length)
				}
			}
		})
	}

	/** Wrap selected text with formatting */
	private wrapSelection(before: string, after: string, placeholder: string) {
		if (!this.bodyTextAreaRef.value) return

		// For schmancy-textarea, access the internal textarea
		const textarea = this.bodyTextAreaRef.value.shadowRoot?.querySelector('textarea')
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const selectedText = textarea.value.substring(start, end)
		
		const textToWrap = selectedText || placeholder
		const newText = before + textToWrap + after
		
		const newValue = 
			textarea.value.substring(0, start) +
			newText +
			textarea.value.substring(end)
		
		this.body = newValue
		this.dispatchChange()
		
		this.updateComplete.then(() => {
			const updatedTextarea = this.bodyTextAreaRef.value?.shadowRoot?.querySelector('textarea')
			if (updatedTextarea) {
				updatedTextarea.focus()
				if (!selectedText) {
					// Select the placeholder text
					updatedTextarea.setSelectionRange(start + before.length, start + before.length + placeholder.length)
				} else {
					// Position cursor at the end
					updatedTextarea.setSelectionRange(start + newText.length, start + newText.length)
				}
			}
		})
	}

	/** Open layout selection dialog */
	private openLayoutDialog = () => {
		$dialog.component(html`
			<schmancy-email-layout-selector
				@layout-select=${(e: CustomEvent) => {
					this.applyLayout(e.detail.layout)
					$dialog.close()
				}}
			></schmancy-email-layout-selector>
		`)
	}

	/** Open template picker */
	private openTemplatePicker = () => {
		const picker = new SchmancyEmailTemplatePicker()
		picker.templates = this.templates

		// Listen for template selection using RxJS
		fromEvent(picker, 'template-selected').pipe(
			takeUntil(this.disconnecting)
		).subscribe(this.handleTemplateSelected)
		
		sheet.open({
			component: picker,
			title: 'Choose Email Template'
		})
	}

	/** Handle template selection */
	private handleTemplateSelected = (e: CustomEvent) => {
		const template: EmailTemplate = e.detail
		this.subject = template.subject
		this.body = template.body
		this.dispatchChange()
		$notify.success(`Template "${template.name}" applied successfully`)
	}

	/** Apply layout template to content */
	private applyLayout = (layoutType: string) => {
		const layouts: Record<string, string> = {
			'columns-2': `
:::layout columns-2
<div class="column">
![Left Photo](https://via.placeholder.com/400x300?text=Replace+with+your+photo){height=300px}

**Photo Title**

Replace the placeholder image above with your own photo. The height=300px ensures both images have equal height while width adjusts automatically.
</div>

<div class="column">
![Right Photo](https://via.placeholder.com/400x300?text=Replace+with+your+photo){height=300px}

**Photo Title**

Use the same height value (300px) for both images to keep them aligned perfectly side by side.
</div>
:::
`,
			'columns-3': `
:::layout columns-3
<div class="column">
![Photo 1](https://via.placeholder.com/300x200?text=Photo+1){height=200px}

**Item Title**

Brief description or caption for this item.
</div>

<div class="column">
![Photo 2](https://via.placeholder.com/300x200?text=Photo+2){height=200px}

**Item Title**

Brief description or caption for this item.
</div>

<div class="column">
![Photo 3](https://via.placeholder.com/300x200?text=Photo+3){height=200px}

**Item Title**

Brief description or caption for this item.
</div>
:::
`,
			'sidebar-left': `
:::layout sidebar-left
<div class="sidebar">
**Sidebar Content**

* Navigation item 1
* Navigation item 2
* Navigation item 3
</div>

<div class="main">
**Main Content Area**

Your primary content goes here. This area takes up most of the width while the sidebar provides supplementary information or navigation.
</div>
:::
`,
			'sidebar-right': `
:::layout sidebar-right
<div class="main">
**Main Content Area**

Your primary content goes here. This area takes up most of the width while the sidebar provides supplementary information or navigation.
</div>

<div class="sidebar">
**Sidebar Content**

* Quick links
* Related info
* Contact details
</div>
:::
`,
			'image-row': `
:::layout image-row
<div class="image">
![Gallery Image 1](https://via.placeholder.com/400x250?text=Gallery+Image+1){height=250px}
</div>

<div class="image">
![Gallery Image 2](https://via.placeholder.com/400x250?text=Gallery+Image+2){height=250px}
</div>

<div class="image">
![Gallery Image 3](https://via.placeholder.com/400x250?text=Gallery+Image+3){height=250px}
</div>
:::
`
		}

		const layoutMarkdown = layouts[layoutType]
		if (layoutMarkdown) {
			this.insertAtCursor(layoutMarkdown)
		}
	}

	/** Upload image with configurable handler */
	private uploadImage = async (file: File) => {
		if (!file.type.startsWith('image/')) {
			$notify.error(`File "${file.name}" is not an image`)
			return
		}

		// Check file size (max 10MB for images)
		const maxSize = 10 * 1024 * 1024
		if (file.size > maxSize) {
			$notify.error(`Image "${file.name}" is too large. Maximum size is 10MB.`)
			return
		}

		// Show loading state
		this.isUploading = true

		try {
			let url: string

			if (this.config.imageUploadHandler) {
				// Use custom upload handler
				url = await this.config.imageUploadHandler(file)
			} else if (this.config.uploadHandler) {
				// Use generic upload handler
				url = await this.config.uploadHandler(file)
			} else {
				// Fallback to data URL for preview
				url = await this.createDataUrl(file)
				$notify.warning('No upload handler configured. Using local preview.')
			}

			// Get image dimensions
			const dimensions = await this.getImageDimensions(file)

			// Insert markdown at cursor position
			this.insertImageMarkdown(url, file.name, dimensions.width, dimensions.height)

			$notify.success('Image uploaded successfully')
		} catch (error) {
			console.error('Upload failed:', error)
			$notify.error('Failed to upload image')
		} finally {
			this.isUploading = false
		}
	}

	/** Create data URL for local preview */
	private createDataUrl = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = reject
			reader.readAsDataURL(file)
		})
	}

	/** Get image dimensions */
	private getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
		return new Promise((resolve) => {
			const img = new Image()
			img.onload = () => {
				resolve({ width: img.width, height: img.height })
				URL.revokeObjectURL(img.src)
			}
			img.onerror = () => {
				resolve({ width: 400, height: 300 }) // Default dimensions
				URL.revokeObjectURL(img.src)
			}
			img.src = URL.createObjectURL(file)
		})
	}

	/** Insert image markdown at cursor */
	private insertImageMarkdown = (url: string, alt: string, width: number, _height: number) => {
		const textarea = this.bodyTextAreaRef.value?.shadowRoot?.querySelector('textarea')
		if (!textarea) return

		const markdown = `![${alt}](${url}){width=${Math.min(width, 600)}px height=auto}`

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const newValue = 
			this.body.substring(0, start) +
			markdown +
			this.body.substring(end)

		this.body = newValue
		this.dispatchChange()

		// Set cursor after inserted markdown
		this.updateComplete.then(() => {
			const updatedTextarea = this.bodyTextAreaRef.value?.shadowRoot?.querySelector('textarea')
			if (updatedTextarea) {
				const newPosition = start + markdown.length
				updatedTextarea.setSelectionRange(newPosition, newPosition)
				updatedTextarea.focus()
			}
		})
	}


	/** Handle file input changes */
	private handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		const files = input.files
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				if (file.type.startsWith('image/')) {
					this.uploadImage(file)
				} else {
					this.addFile(file)
				}
			}
		}
		input.value = ''
	}

	/** Handle image selection */
	private handleImageSelect = (event: Event) => {
		const input = event.target as HTMLInputElement
		const file = input.files?.[0]
		if (file && file.type.startsWith('image/')) {
			this.uploadImage(file)
		}
		input.value = '' // Reset for next selection
	}

	/** Drag and drop handlers */
	private handleDrop = (event: DragEvent) => {
		event.preventDefault()
		this.dragOver = false

		const files = event.dataTransfer?.files
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				if (file.type.startsWith('image/')) {
					this.uploadImage(file)
				} else {
					this.addFile(file)
				}
			}
		}
	}

	private handleDragEnter = (event: DragEvent) => {
		event.preventDefault()
		this.dragOver = true
	}

	private handleDocumentDragLeave = (event: DragEvent) => {
		event.preventDefault()
		this.dragOver = false
	}

	private handleDocumentDrop = (event: DragEvent) => {
		event.preventDefault()
		this.dragOver = false
	}

	private handleDragOver = (event: DragEvent) => {
		event.preventDefault()
	}

	private handleDragLeave = (event: DragEvent) => {
		event.preventDefault()
		// Let document handler manage this
	}

	/** Add file as attachment */
	private addFile = (file: File) => {
		// Check file size (max 10MB)
		const maxSize = 10 * 1024 * 1024
		if (file.size > maxSize) {
			$notify.error(`File "${file.name}" is too large. Maximum size is 10MB.`)
			return
		}

		// Check if file already exists
		const exists = this.attachments.some(att => 
			att.name === file.name && att.size === file.size
		)
		if (exists) {
			$notify.warning(`File "${file.name}" is already attached.`)
			return
		}

		const attachment: EmailAttachment = {
			id: crypto.randomUUID(),
			file,
			name: file.name,
			size: file.size,
			type: file.type || 'application/octet-stream'
		}

		this.attachments = [...this.attachments, attachment]
		this.dispatchChange()
	}

	/** Remove attachment */
	private removeAttachment = (attachmentId: string) => {
		this.attachments = this.attachments.filter(att => att.id !== attachmentId)
		this.dispatchChange()
	}


	render() {
		return html`
			<schmancy-surface 
				type="surface" 
				rounded="all"
				class=${this.classMap({
					'border-2 border-dashed border-primary': this.dragOver,
					'h-full flex flex-col': true
				})}
				@drop=${this.handleDrop}
				@dragover=${this.handleDragOver}
				@dragleave=${this.handleDragLeave}
			>
				<div class="flex flex-col h-full gap-4">

					<!-- Header Section with Subject -->
					<div class="flex-shrink-0 p-4 pb-0 space-y-4">
						<!-- Subject Field -->
						<div class="space-y-2">
							<schmancy-typography type="label" token="md">
								Subject *
							</schmancy-typography>
							<schmancy-input
								${ref(this.subjectInputRef)}
								.value=${this.subject}
								@input=${this.handleSubjectChange}
								placeholder="Enter email subject..."
								.disabled=${this.disabled}
								class="w-full"
							></schmancy-input>
						</div>
					</div>

					<!-- Formatting Toolbar -->
					<div class="flex-shrink-0 px-4">
						<schmancy-surface type="container" rounded="all" class="p-3">
							<div class="flex flex-wrap gap-2 items-center">
								<!-- Text Formatting Group -->
								<div class="flex gap-1">
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Bold" 
										?disabled=${this.disabled}
										@click=${() => this.wrapSelection('**', '**', 'bold text')}
									>
										<schmancy-icon>format_bold</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Italic" 
										?disabled=${this.disabled}
										@click=${() => this.wrapSelection('*', '*', 'italic text')}
									>
										<schmancy-icon>format_italic</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Link" 
										?disabled=${this.disabled}
										@click=${() => this.insertAtCursor('[link text](https://example.com)', 'link text')}
									>
										<schmancy-icon>link</schmancy-icon>
									</schmancy-icon-button>
								</div>
								
								<!-- Divider -->
								<div class="h-6 w-px bg-outline-variant"></div>
								
								<!-- Structure Formatting Group -->
								<div class="flex gap-1">
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Heading" 
										?disabled=${this.disabled}
										@click=${() => this.insertAtCursor('\n# Heading\n', 'Heading')}
									>
										<schmancy-icon>title</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Bullet List" 
										?disabled=${this.disabled}
										@click=${() => this.insertAtCursor('\n* List item\n', 'List item')}
									>
										<schmancy-icon>format_list_bulleted</schmancy-icon>
									</schmancy-icon-button>
								</div>
								
								<!-- Divider -->
								<div class="h-6 w-px bg-outline-variant"></div>
								
								<!-- Media and Layout Group -->
								<div class="flex gap-1">
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Insert Image" 
										?disabled=${this.disabled || this.isUploading}
										@click=${() => this.imageInputRef.value?.click()}
									>
										${when(this.isUploading, 
											() => html`<schmancy-progress size="sm" class="w-4 h-4"></schmancy-progress>`,
											() => html`<schmancy-icon>image</schmancy-icon>`
										)}
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Insert Layout" 
										?disabled=${this.disabled}
										@click=${this.openLayoutDialog}
									>
										<schmancy-icon>mobile_layout</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Use Template" 
										?disabled=${this.disabled || this.templates.length === 0}
										@click=${this.openTemplatePicker}
									>
										<schmancy-icon>description</schmancy-icon>
									</schmancy-icon-button>
								</div>
							</div>
						</schmancy-surface>
					</div>

					<!-- Textarea Container - Takes remaining space -->
					<div class="flex-1 px-4 relative min-h-0">
						<schmancy-textarea
							${ref(this.bodyTextAreaRef)}
							.value=${this.body}
							@change=${this.handleBodyChange}
							placeholder="Enter your email message here...

Use the toolbar buttons above for formatting, or type markdown directly:
**bold**, *italic*, [link](url), ![image](url)

Drag & drop images or press Ctrl+V to paste from clipboard.
Tab key inserts 2 spaces for better formatting."
							.disabled=${this.disabled}
							.required=${true}
							.rows=${4}
							class="w-full font-mono text-sm"
						></schmancy-textarea>
						
						<!-- Upload Progress Overlay -->
						${when(this.isUploading, () => html`
							<div class="absolute top-3 right-3 z-10">
								<schmancy-surface type="container" rounded="all" class="p-2">
									<div class="flex items-center gap-2">
										<schmancy-progress size="sm" class="w-4 h-4"></schmancy-progress>
										<schmancy-typography type="body" token="xs">Uploading...</schmancy-typography>
									</div>
								</schmancy-surface>
							</div>
						`)}
					</div>

					<!-- Footer Section -->
					<div class="flex-shrink-0 p-4 pt-0 space-y-2">
						<!-- Character/Word Counter -->
						<div class="text-center">
							<schmancy-typography type="body" token="xs">
								${this.body.length} characters • ${this.body.trim() ? this.body.trim().split(/\s+/).length : 0} words
							</schmancy-typography>
						</div>

						<!-- Attachments Display (if any) -->
						${when(this.attachments.length > 0, () => html`
							<div class="space-y-2">
								<schmancy-typography type="label" token="sm" class="flex items-center gap-2">
									<schmancy-icon size="16px">attach_file</schmancy-icon>
									Attachments (${this.attachments.length})
								</schmancy-typography>
								<div class="flex flex-wrap gap-2">
									${repeat(this.attachments, att => att.id, (attachment) => html`
										<schmancy-chip class="text-xs">
											<span class="truncate max-w-32">${attachment.name}</span>
											<button 
												@click=${() => this.removeAttachment(attachment.id)}
												class="ml-2 text-error hover:text-error-container"
												title="Remove attachment"
											>
												<schmancy-icon size="14px">close</schmancy-icon>
											</button>
										</schmancy-chip>
									`)}
								</div>
							</div>
						`)}
					</div>

					<!-- Hidden File Inputs -->
					<div class="hidden">
						<input
							${ref(this.fileInputRef)}
							type="file"
							multiple
							@change=${this.handleFileChange}
						>
						<input
							${ref(this.imageInputRef)}
							type="file"
							accept="image/*"
							@change=${this.handleImageSelect}
						>
					</div>

				</div>
			</schmancy-surface>

		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-email-editor': SchmancyEmailEditor
	}
}