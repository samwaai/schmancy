import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { when } from 'lit/directives/when.js'
import type { EmailAttachment, EmailPreviewMode } from './types'

/**
 * Email viewer component showing formatted HTML and plain text versions
 * 
 * Features:
 * - HTML and plain text preview modes
 * - Email client-compatible styling
 * - Layout parsing (columns, sidebars, image rows)
 * - Markdown to HTML conversion
 * - Attachment display
 * - Email header simulation
 * - Character/word statistics
 * 
 * @example
 * ```html
 * <schmancy-email-viewer
 *   subject="Welcome!"
 *   body="**Hello** world"
 *   .attachments=${attachments}
 *   .recipients=${['user@example.com']}
 * ></schmancy-email-viewer>
 * ```
 */
@customElement('schmancy-email-viewer')
export class SchmancyEmailViewer extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	/** Email subject */
	@property({ type: String }) subject = ''
	
	/** Email body content (markdown) */
	@property({ type: String }) body = ''
	
	/** Email attachments */
	@property({ type: Array }) attachments: EmailAttachment[] = []
	
	/** Selected recipients for preview */
	@property({ type: Array }) recipients: string[] = []
	
	/** From address for preview */
	@property({ type: String }) fromAddress = 'sender@example.com'
	
	/** To address for preview (uses first recipient if not provided) */
	@property({ type: String }) toAddress = 'recipient@example.com'
	
	/** Current view mode */
	@state() private viewMode: EmailPreviewMode = 'html'

	/**
	 * Parse layout blocks (:::layout type) and convert to email-safe table layouts
	 */
	private parseLayoutBlocks(text: string): string {
		// Match layout blocks: :::layout type\n...content...\n:::
		return text.replace(/:::layout\s+([a-zA-Z0-9-]+)\n([\s\S]*?)\n:::/g, (_, layoutType, content) => {
			switch (layoutType) {
				case 'columns-2':
					return this.parseColumnsLayout(content, 2)
				case 'columns-3':
					return this.parseColumnsLayout(content, 3)
				case 'sidebar-left':
					return this.parseSidebarLayout(content, 'left')
				case 'sidebar-right':
					return this.parseSidebarLayout(content, 'right')
				case 'image-row':
					return this.parseImageRowLayout(content)
				default:
					// Unknown layout type, return content as-is
					return content
			}
		})
	}

	/**
	 * Parse columns layout (2 or 3 columns)
	 */
	private parseColumnsLayout(content: string, columnCount: number): string {
		// Extract column content using regex to find <div class="column">...</div>
		const columnRegex = /<div class="column">([\s\S]*?)<\/div>/g
		const columns: string[] = []
		let match: RegExpExecArray | null

		while ((match = columnRegex.exec(content)) !== null) {
			columns.push(match[1].trim())
		}

		if (columns.length === 0) {
			return content // No columns found, return as-is
		}

		// Calculate column width percentage
		const columnWidth = Math.floor(100 / columnCount)
		const cellPadding = '0 10px 0 0' // Right padding except last column

		// Build table with columns
		let tableRows = '<tr>'
		
		for (let i = 0; i < columnCount && i < columns.length; i++) {
			const isLastColumn = i === columnCount - 1
			const padding = isLastColumn ? '0' : cellPadding
			
			// Parse markdown within column content
			const parsedContent = this.parseBasicMarkdown(columns[i])
			
			tableRows += `
				<td width="${columnWidth}%" style="padding: ${padding}; vertical-align: top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
					${parsedContent}
				</td>`
		}
		
		// Fill empty columns if needed
		for (let i = columns.length; i < columnCount; i++) {
			const isLastColumn = i === columnCount - 1
			const padding = isLastColumn ? '0' : cellPadding
			
			tableRows += `
				<td width="${columnWidth}%" style="padding: ${padding}; vertical-align: top;">
					&nbsp;
				</td>`
		}
		
		tableRows += '</tr>'

		return `
			<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">
				${tableRows}
			</table>`
	}

	/**
	 * Parse sidebar layout (left or right sidebar)
	 */
	private parseSidebarLayout(content: string, side: 'left' | 'right'): string {
		// Extract sidebar and main content
		const sidebarMatch = content.match(/<div class="sidebar">([\s\S]*?)<\/div>/)
		const mainMatch = content.match(/<div class="main">([\s\S]*?)<\/div>/)

		if (!sidebarMatch || !mainMatch) {
			return content // Invalid structure, return as-is
		}

		const sidebarContent = this.parseBasicMarkdown(sidebarMatch[1].trim())
		const mainContent = this.parseBasicMarkdown(mainMatch[1].trim())

		const sidebarCell = `
			<td width="30%" style="padding: 0 16px 0 0; vertical-align: top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
				${sidebarContent}
			</td>`

		const mainCell = `
			<td width="70%" style="padding: 0; vertical-align: top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
				${mainContent}
			</td>`

		const tableRow = side === 'left' ? 
			`<tr>${sidebarCell}${mainCell}</tr>` : 
			`<tr>${mainCell}${sidebarCell.replace('0 16px 0 0', '0 0 0 16px')}</tr>`

		return `
			<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">
				${tableRow}
			</table>`
	}

	/**
	 * Parse image row layout
	 */
	private parseImageRowLayout(content: string): string {
		// Extract images using regex to find <div class="image">...</div>
		const imageRegex = /<div class="image">([\s\S]*?)<\/div>/g
		const images: string[] = []
		let match: RegExpExecArray | null

		while ((match = imageRegex.exec(content)) !== null) {
			const imageContent = match[1].trim()
			// Extract image markdown ![alt](src)
			const imgMatch = imageContent.match(/!\[([^\]]*)\]\(([^)]+)\)/)
			if (imgMatch) {
				const [, alt, src] = imgMatch
				images.push(`<img src="${src}" alt="${alt || 'Image'}" style="display: block; max-width: 100%; height: auto;" border="0">`)
			}
		}

		if (images.length === 0) {
			return content // No images found, return as-is
		}

		// Calculate image width percentage
		const imageWidth = Math.floor(100 / images.length)
		const cellPadding = '0 8px 0 0' // Right padding except last image

		// Build table with images
		let tableRow = '<tr>'
		
		images.forEach((image, index) => {
			const isLastImage = index === images.length - 1
			const padding = isLastImage ? '0' : cellPadding
			
			tableRow += `
				<td width="${imageWidth}%" style="padding: ${padding}; vertical-align: top; text-align: center;">
					${image}
				</td>`
		})
		
		tableRow += '</tr>'

		return `
			<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">
				${tableRow}
			</table>`
	}

	/**
	 * Parse image attributes from markdown syntax
	 */
	private parseImageAttributes(attributeString: string): {
		width?: string;
		height?: string;
		cover?: boolean;
		contain?: boolean;
	} {
		const attributes: { width?: string; height?: string; cover?: boolean; contain?: boolean } = {}
		
		if (!attributeString) return attributes
		
		// Parse width=value
		const widthMatch = attributeString.match(/width=([^\s}]+)/)
		if (widthMatch) {
			attributes.width = widthMatch[1]
		}
		
		// Parse height=value
		const heightMatch = attributeString.match(/height=([^\s}]+)/)
		if (heightMatch) {
			attributes.height = heightMatch[1]
		}
		
		// Parse cover/contain flags
		if (attributeString.includes('cover')) {
			attributes.cover = true
		}
		if (attributeString.includes('contain')) {
			attributes.contain = true
		}
		
		return attributes
	}

	/**
	 * Generate email-safe image styles based on attributes
	 */
	private generateImageStyles(attributes: {
		width?: string;
		height?: string;
		cover?: boolean;
		contain?: boolean;
	}, inColumn: boolean = false): { imgStyle: string; imgWidth?: string; imgHeight?: string } {
		let imgStyle = 'display: block; margin: 8px 0; border: 0;'
		let imgWidth: string | undefined
		let imgHeight: string | undefined
		
		// Handle width
		if (attributes.width) {
			if (attributes.width === 'auto') {
				// Natural width - but constrain in columns
				if (inColumn) {
					imgStyle += ' max-width: 100%; height: auto;'
				} else {
					imgStyle += ' height: auto;'
				}
			} else if (attributes.width.endsWith('%')) {
				// Percentage width
				imgStyle += ` width: ${attributes.width}; max-width: 100%;`
				if (!attributes.height) {
					imgStyle += ' height: auto;'
				}
			} else if (attributes.width.endsWith('px')) {
				// Fixed pixel width - use width attribute for email compatibility
				imgWidth = attributes.width.replace('px', '')
				imgStyle += ' max-width: 100%;'
				if (!attributes.height) {
					imgStyle += ' height: auto;'
				}
			}
		} else {
			// Default width behavior
			if (inColumn) {
				imgStyle += ' width: 100%; max-width: 100%; height: auto;'
			} else {
				imgStyle += ' max-width: 100%; height: auto;'
			}
		}
		
		// Handle height
		if (attributes.height) {
			if (attributes.height === 'auto') {
				imgStyle += ' height: auto;'
			} else if (attributes.height.endsWith('px')) {
				// Fixed pixel height - use height attribute for email compatibility
				imgHeight = attributes.height.replace('px', '')
				if (!attributes.width) {
					// If only height specified, maintain aspect ratio with max-width
					imgStyle += ' max-width: 100%;'
				}
			}
		}
		
		// Handle object-fit simulation for email (limited support)
		if (attributes.cover || attributes.contain) {
			// Note: Most email clients don't support object-fit
			// We can only approximate with width/height and overflow hidden
			if (!attributes.width && !attributes.height) {
				// Default to container width for cover/contain
				imgStyle += ' width: 100%;'
			}
		}
		
		return { imgStyle, imgWidth, imgHeight }
	}

	/**
	 * Parse basic markdown within layout content (simplified version)
	 */
	private parseBasicMarkdown(text: string): string {
		return text
			// Handle images with custom attributes - enhanced for better control
			.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (_, alt, src, attributeString) => {
				const attributes = this.parseImageAttributes(attributeString)
				const { imgStyle, imgWidth, imgHeight } = this.generateImageStyles(attributes, true)
				
				// Build img tag with attributes
				let imgTag = `<img src="${src}" alt="${alt || 'Image'}" style="${imgStyle}" border="0"`
				if (imgWidth) imgTag += ` width="${imgWidth}"`
				if (imgHeight) imgTag += ` height="${imgHeight}"`
				imgTag += '>'
				
				return imgTag
			})
			// Convert double line breaks to paragraph breaks
			.replace(/\n\n/g, '</p><p style="margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">')
			// Convert single line breaks to <br>
			.replace(/\n/g, '<br>')
			// Bold text
			.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
			// Italic text  
			.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
			// Links with email-safe colors
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0066cc; text-decoration: underline;">$1</a>')
			// Headers - only H1 supported for email compatibility
			.replace(/^# (.*$)/gim, '<h2 style="margin: 16px 0 8px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; color: #1a1a1a;">$1</h2>')
			// Unordered lists
			.replace(/^\* (.*$)/gim, '<li style="margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;">$1</li>')
			// Ordered lists  
			.replace(/^\d+\. (.*$)/gim, '<li style="margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;">$1</li>')
			// Wrap consecutive list items in proper list containers
			.replace(/(<li[^>]*>.*?<\/li>(?:\s*<li[^>]*>.*?<\/li>)*)/gs, (listMatch) => {
				// Check if it's a numbered list by looking for digits at start of first item
				const isNumbered = /^\d+\./.test(listMatch.replace(/<[^>]*>/g, ''))
				const listTag = isNumbered ? 'ol' : 'ul'
				const listStyle = 'margin: 8px 0; padding: 0 0 0 20px; font-family: Arial, Helvetica, sans-serif;'
				
				return `<${listTag} style="${listStyle}">${listMatch}</${listTag}>`
			})
			// Wrap in paragraph if not already wrapped
			.replace(/^(?!<[h\d]|<p|<ul|<ol|<li|<img)(.+)$/gim, '<p style="margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">$1</p>')
	}

	/**
	 * Email-compliant HTML generator for email clients (Gmail, Outlook, Apple Mail)
	 * Uses table-based layouts with inline styles only - no CSS classes or modern features
	 */
	private parseExtendedMarkdown(text: string): string {
		let html = text
		
		// Process layout blocks FIRST to avoid conflicts with other markdown
		html = this.parseLayoutBlocks(html)
		
		// Remove complex image blocks - email clients don't handle them well
		html = html.replace(/:::images\s+(row|grid(?:=\d+)?)\n((?:!\[.*?\]\(.*?\)(?:\{.*?\})?\s*\n?)*?):::/g, '[Multiple Images - View in web browser]')
		
		// Handle single images with enhanced attribute support
		html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (_, alt, src, attributeString) => {
			const attributes = this.parseImageAttributes(attributeString)
			const { imgStyle, imgWidth, imgHeight } = this.generateImageStyles(attributes, false)
			
			// Build img tag with attributes
			let imgTag = `<img src="${src}" alt="${alt || 'Image'}" style="${imgStyle}" border="0"`
			if (imgWidth) imgTag += ` width="${imgWidth}"`
			if (imgHeight) imgTag += ` height="${imgHeight}"`
			imgTag += '>'
			
			// Wrap in email-safe table
			return `<table cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0;"><tr><td>${imgTag}</td></tr></table>`
		})
		
		// Process markdown with email-safe inline styles
		html = html
			// Convert double line breaks to paragraph breaks
			.replace(/\n\n/g, '</p><p style="margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">')
			// Convert single line breaks to <br>
			.replace(/\n/g, '<br>')
			// Bold text
			.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
			// Italic text  
			.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
			// Links with email-safe colors
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0066cc; text-decoration: underline;">$1</a>')
			// Headers - only H1 supported for email compatibility
			.replace(/^# (.*$)/gim, '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0 16px 0;"><tr><td><h1 style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color: #1a1a1a;">$1</h1></td></tr></table>')
			// Unordered lists
			.replace(/^\* (.*$)/gim, '<li style="margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;">$1</li>')
			// Ordered lists  
			.replace(/^\d+\. (.*$)/gim, '<li style="margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;">$1</li>')
			// Horizontal rule
			.replace(/^---$/gim, '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;"><tr><td style="border-top: 1px solid #e0e0e0; height: 1px; line-height: 1px;">&nbsp;</td></tr></table>')
		
		// Wrap consecutive list items in proper list containers
		html = html.replace(/(<li[^>]*>.*?<\/li>(?:\s*<li[^>]*>.*?<\/li>)*)/gs, (match) => {
			// Check if it's a numbered list by looking for digits at start of first item
			const isNumbered = /^\d+\./.test(match.replace(/<[^>]*>/g, ''))
			const listTag = isNumbered ? 'ol' : 'ul'
			const listStyle = isNumbered 
				? 'margin: 16px 0; padding: 0 0 0 20px; font-family: Arial, Helvetica, sans-serif;'
				: 'margin: 16px 0; padding: 0 0 0 20px; font-family: Arial, Helvetica, sans-serif;'
			
			return `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td><${listTag} style="${listStyle}">${match}</${listTag}></td></tr></table>`
		})
		
		// Wrap content in email-safe container table
		if (!html.includes('<table>') && !html.includes('<h1>')) {
			html = `<p style="margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">${html}</p>`
		}
		
		// Wrap everything in a main table container with 600px max width for email compatibility
		html = `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
			<tr>
				<td style="padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
					${html}
				</td>
			</tr>
		</table>`
		
		return html
	}

	/**
	 * Convert markdown to plain text for plain text preview
	 */
	private convertToPlainText(text: string): string {
		return text.trim()
			// Remove layout blocks but preserve content
			.replace(/:::layout\s+([a-zA-Z0-9-]+)\n([\s\S]*?)\n:::/g, (_, __, content) => {
				// Extract content from div containers and flatten
				return content
					.replace(/<div class="(?:column|sidebar|main|image)">/g, '\n')
					.replace(/<\/div>/g, '\n')
					.replace(/\n{3,}/g, '\n\n')
					.trim()
			})
			// Remove image blocks
			.replace(/:::images\s+(row|grid(?:=\d+)?)\n((?:!\[.*?\]\(.*?\)(?:\{.*?\})?\s*\n?)*?):::/g, '[Images]')
			// Remove individual images
			.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, '[Image: $1]')
			// Remove other markdown
			.replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markers
			.replace(/\*(.*?)\*/g, '$1')  // Remove italic markers
			.replace(/__(.*?)__/g, '$1')  // Remove underline markers
			.replace(/~~(.*?)~~/g, '$1')  // Remove strikethrough markers
			.replace(/`(.*?)`/g, '$1')  // Remove code markers
			.replace(/^#{1,3} (.*$)/gim, '$1')  // Remove header markers
			.replace(/^> (.*$)/gim, '$1')  // Remove quote markers
			.replace(/^\* (.*$)/gim, '• $1')  // Convert bullets
			.replace(/^\d+\. (.*$)/gim, '$1')  // Remove numbered list markers
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')  // Convert links to text
			.replace(/^---$/gim, '---')  // Keep dividers
			.replace(/\n\n+/g, '\n\n')  // Normalize spacing
	}

	/** Format file size for display */
	private formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	render() {
		const htmlBody = this.parseExtendedMarkdown(this.body)
		const plainTextBody = this.convertToPlainText(this.body)
		const displayToAddress = this.recipients[0] || this.toAddress

		return html`
			<schmancy-surface type="surface" rounded="all" class="h-full flex flex-col">
				
				<!-- Header Section -->
				<div class="flex-shrink-0 p-4 border-b border-outline-variant">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<schmancy-typography type="title" token="md" class="flex items-center gap-2">
							<schmancy-icon size="20px">preview</schmancy-icon>
							Email Preview
						</schmancy-typography>
						
						<!-- View Mode Toggle -->
						<div class="flex gap-1 bg-surface-container rounded-full p-1">
							<schmancy-chip 
								?selected=${this.viewMode === 'html'}
								@click=${() => { this.viewMode = 'html' }}
								class="text-xs h-8"
								data-variant=${this.viewMode === 'html' ? 'filled' : 'outlined'}
							>
								<schmancy-icon slot="prefix" size="14px">code</schmancy-icon>
								HTML
							</schmancy-chip>
							<schmancy-chip 
								?selected=${this.viewMode === 'plaintext'}
								@click=${() => { this.viewMode = 'plaintext' }}
								class="text-xs h-8"
								data-variant=${this.viewMode === 'plaintext' ? 'filled' : 'outlined'}
							>
								<schmancy-icon slot="prefix" size="14px">text_fields</schmancy-icon>
								Text
							</schmancy-chip>
						</div>
					</div>
				</div>

				<!-- Preview Content Container -->
				<div class="flex-1 flex flex-col min-h-0 p-4 gap-4">
					
					<!-- Email Mock Container -->
					<div class="flex-1 flex flex-col min-h-0">
						<schmancy-surface 
							type="container" 
							rounded="all" 
							class="flex-1 flex flex-col overflow-hidden shadow-sm"
						>
							<!-- Email Header -->
							<div class="flex-shrink-0 p-4 bg-surface-containerLow border-b border-outline-variant">
								<div class="space-y-3">
									<!-- From Field -->
									<div class="flex items-start gap-3">
										<div class="flex items-center gap-2 min-w-0 flex-shrink-0 w-16">
											<schmancy-icon size="16px">account_circle</schmancy-icon>
											<schmancy-typography type="body" token="sm" class="font-medium">
												From
											</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="break-all flex-1">
											${this.fromAddress}
										</schmancy-typography>
									</div>
									
									<!-- To Field -->
									<div class="flex items-start gap-3">
										<div class="flex items-center gap-2 min-w-0 flex-shrink-0 w-16">
											<schmancy-icon size="16px">person</schmancy-icon>
											<schmancy-typography type="body" token="sm" class="font-medium">
												To
											</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="break-all flex-1">
											${displayToAddress}
										</schmancy-typography>
									</div>
									
									<!-- Subject Field -->
									<div class="flex items-start gap-3">
										<div class="flex items-center gap-2 min-w-0 flex-shrink-0 w-16">
											<schmancy-icon size="16px">subject</schmancy-icon>
											<schmancy-typography type="body" token="sm" class="font-medium">
												Subject
											</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="font-medium flex-1">
											${this.subject || html`<span class="italic text-surface-onVariant">(No subject)</span>`}
										</schmancy-typography>
									</div>
								</div>
							</div>

							<!-- Email Body Content -->
							<div class="flex-1 overflow-y-auto min-h-0">
								${when(this.body, 
									() => html`
										${when(this.viewMode === 'html', 
											() => html`
												<div class="p-6 bg-white" style="color: #333; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif; font-size: 14px;">
													<div .innerHTML=${htmlBody}></div>
												</div>
											`,
											() => html`
												<div class="p-6 bg-white" style="color: #333; line-height: 1.6; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap;">
													${plainTextBody}
												</div>
											`
										)}
									`,
									() => html`
										<!-- Empty State -->
										<div class="flex-1 flex items-center justify-center p-8">
											<div class="text-center space-y-3">
												<schmancy-icon size="48px" class="text-surface-onVariant opacity-50">mail_outline</schmancy-icon>
												<schmancy-typography type="body" token="md">
													No message content to preview
												</schmancy-typography>
												<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
													Start typing in the composer to see a preview
												</schmancy-typography>
											</div>
										</div>
									`
								)}
							</div>

							<!-- Attachments Section -->
							${when(this.attachments.length > 0, () => html`
								<div class="flex-shrink-0 p-4 border-t border-outline-variant bg-surface-containerLowest">
									<div class="space-y-3">
										<!-- Attachments Header -->
										<div class="flex items-center gap-2">
											<schmancy-icon size="18px">attach_file</schmancy-icon>
											<schmancy-typography type="label" token="md" class="font-medium">
												Attachments (${this.attachments.length})
											</schmancy-typography>
										</div>
										
										<!-- Attachments List -->
										<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
											${repeat(this.attachments, attachment => attachment.id, (attachment) => html`
												<schmancy-surface type="container" rounded="all" class="p-3">
													<div class="flex items-center gap-3">
														<!-- File Icon -->
														<schmancy-icon size="20px" class="text-surface-onVariant flex-shrink-0">
															${attachment.type.startsWith('image/') ? 'image' : 
															  attachment.type.includes('pdf') ? 'picture_as_pdf' : 
															  attachment.type.includes('text') ? 'description' :
															  'attach_file'}
														</schmancy-icon>
														
														<!-- File Info -->
														<div class="flex-1 min-w-0">
															<schmancy-typography type="body" token="sm" class="font-medium truncate">
																${attachment.name}
															</schmancy-typography>
															<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
																${this.formatFileSize(attachment.size)} • ${attachment.type}
															</schmancy-typography>
														</div>
													</div>
												</schmancy-surface>
											`)}
										</div>
									</div>
								</div>
							`)}
						</schmancy-surface>
					</div>
					
					<!-- Preview Stats -->
					${when(this.body, () => html`
						<div class="flex-shrink-0">
							<schmancy-surface type="container" rounded="all" class="p-3">
								<div class="flex items-center justify-center gap-6 text-center">
									<div>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
											Characters
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="font-medium">
											${this.body.length}
										</schmancy-typography>
									</div>
									<div class="w-px h-8 bg-outline-variant"></div>
									<div>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
											Words
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="font-medium">
											${this.body.trim() ? this.body.trim().split(/\s+/).length : 0}
										</schmancy-typography>
									</div>
									${when(this.attachments.length > 0, () => html`
										<div class="w-px h-8 bg-outline-variant"></div>
										<div>
											<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
												Attachments
											</schmancy-typography>
											<schmancy-typography type="body" token="sm" class="font-medium">
												${this.attachments.length}
											</schmancy-typography>
										</div>
									`)}
								</div>
							</schmancy-surface>
						</div>
					`)}
					
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-email-viewer': SchmancyEmailViewer
	}
}