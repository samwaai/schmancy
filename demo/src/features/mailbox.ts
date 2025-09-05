import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-mailbox')
export class DemoMailbox extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Mailbox
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Comprehensive email composition and management system with rich text editing, templates, and file attachments.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/mailbox'
						
						// Import specific components
						import { SchmancyEmailEditor } from '@mhmo91/schmancy/mailbox'
						import { SchmancyEmailViewer } from '@mhmo91/schmancy/mailbox'
						import { SchmancyEmailRecipients } from '@mhmo91/schmancy/mailbox'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<!-- Email Editor Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">Email Editor Component</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Property</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Type</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Default</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">subject</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Email subject line</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">body</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Email body content (markdown)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">templates</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">EmailTemplate[]</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">[]</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Available email templates</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">attachments</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">EmailAttachment[]</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">[]</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">File attachments</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">disabled</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Disable all interactions</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">config</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">EmailComposeConfig</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Upload handler configuration</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Events -->
					<schmancy-typography type="title" token="md" class="mb-2 block">Events</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Event</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Detail Type</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">editor-change</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											{subject: string, body: string, attachments: EmailAttachment[]}
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fired when editor content changes</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">template-select</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">EmailTemplate</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fired when a template is selected</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
					<schmancy-grid gap="lg" class="w-full">
						
						<!-- Basic Usage -->
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Basic Email Editor</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-email-editor
									subject="Welcome to our newsletter"
									body="# Hello!

Thank you for subscribing to our newsletter."
								></schmancy-email-editor>
							</schmancy-code-preview>
						</div>

						<!-- With Templates -->
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">With Email Templates</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-email-editor
									.templates=${`[
	{
		id: 'welcome',
		name: 'Welcome Email',
		subject: 'Welcome to {{company}}',
		body: '# Welcome aboard!\\n\\nWe are excited to have you...'
	},
	{
		id: 'newsletter',
		name: 'Newsletter',
		subject: 'Monthly Newsletter - {{month}}',
		body: '# Newsletter\\n\\n## What is new this month...'
	}
]`}
								></schmancy-email-editor>
							</schmancy-code-preview>
						</div>

						<!-- Email Preview -->
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Email Viewer Component</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-email-viewer
									subject="Product Update"
									body="# New Features Released

We are excited to announce several new features:

- **Enhanced Dashboard** - Better analytics and insights
- **API v2** - Faster and more reliable
- **Dark Mode** - Easy on the eyes"
									mode="desktop"
								></schmancy-email-viewer>
							</schmancy-code-preview>
						</div>

						<!-- Email Recipients -->
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Email Recipients</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-email-recipients
									.recipients=${`[
	{ email: 'john@example.com', name: 'John Doe', selected: true },
	{ email: 'jane@example.com', name: 'Jane Smith', selected: false },
	{ email: 'team@example.com', name: 'Team List', selected: true }
]`}
									@recipients-change=${`(e) => console.log('Selected:', e.detail)`}
								></schmancy-email-recipients>
							</schmancy-code-preview>
						</div>

						<!-- With File Upload Config -->
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">With Upload Configuration</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-email-editor
									subject="Report with attachments"
									.config=${`{
	imageUploadHandler: async (file) => {
		// Upload image and return URL
		const formData = new FormData()
		formData.append('image', file)
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		})
		const data = await response.json()
		return data.url
	},
	fileUploadHandler: async (file) => {
		// Handle file uploads
		console.log('Uploading file:', file.name)
		// Return attachment object
		return {
			name: file.name,
			size: file.size,
			url: '/files/' + file.name
		}
	}
}`}
								></schmancy-email-editor>
							</schmancy-code-preview>
						</div>

						<!-- Complete Integration Example -->
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Complete Integration</schmancy-typography>
							<schmancy-code-preview language="javascript">
								import { SchmancyEmailEditor } from '@mhmo91/schmancy/mailbox'
								import { $notify } from '@mhmo91/schmancy/notification'

								const editor = document.querySelector('schmancy-email-editor')

								// Handle content changes
								editor.addEventListener('editor-change', (e) => {
									const { subject, body, attachments } = e.detail
									console.log('Email updated:', { subject, body, attachments })
								})

								// Send email
								async function sendEmail() {
									const email = {
										subject: editor.subject,
										body: editor.body,
										attachments: editor.attachments,
										recipients: getSelectedRecipients()
									}
									
									try {
										await fetch('/api/send-email', {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify(email)
										})
										$notify.success('Email sent successfully!')
									} catch (error) {
										$notify.error('Failed to send email')
									}
								}
							</schmancy-code-preview>
						</div>

					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-mailbox': DemoMailbox
	}
}