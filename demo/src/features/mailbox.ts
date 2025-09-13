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
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<!-- Mailbox Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">schmancy-mailbox</schmancy-typography>
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">importSources</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">ImportSource[]</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">[]</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Contact import sources</schmancy-typography>
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
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Email Editor Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">schmancy-email-editor</schmancy-typography>
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
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Email Viewer Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">schmancy-email-viewer</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Email subject</schmancy-typography>
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">mode</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'desktop' | 'mobile'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'desktop'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Preview mode</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Email Recipients Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">schmancy-email-recipients</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">recipients</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">EmailRecipient[]</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">[]</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">List of email recipients</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">selectable</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">true</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Allow recipient selection</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Events -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Events</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Event</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Component</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Detail</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@send-email</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">schmancy-mailbox</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{request: SendEmailRequest}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Email send request</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@send-error</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">schmancy-mailbox</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{error: string}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Send error occurred</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@editor-change</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">schmancy-email-editor</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{subject: string, body: string}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Editor content changed</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@template-select</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">schmancy-email-editor</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">EmailTemplate</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Template selected</schmancy-typography>
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
						<!-- Basic Email Editor -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-email-editor
									subject="Welcome to our newsletter"
									body="# Hello!\n\nThank you for subscribing to our newsletter."
								></schmancy-email-editor>
							</div>
						</schmancy-code-preview>

						<!-- Email Editor with Templates -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-email-editor></schmancy-email-editor>
								
								<script>
									const editor = document.querySelector('schmancy-email-editor');
									editor.templates = [
										{
											id: 'welcome',
											name: 'Welcome Email',
											subject: 'Welcome to {{company}}!',
											body: '# Welcome!\n\nThank you for joining us...'
										},
										{
											id: 'newsletter',
											name: 'Newsletter',
											subject: 'Monthly Newsletter - {{month}}',
											body: '# Newsletter\n\n## What is new this month...'
										}
									];
								</script>
							</div>
						</schmancy-code-preview>

						<!-- Email Viewer -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-email-viewer
									subject="Product Update"
									body="# New Features Released\n\nWe are excited to announce several new features:\n\n- **Enhanced Dashboard** - Better analytics\n- **API v2** - Faster and more reliable\n- **Dark Mode** - Easy on the eyes"
									mode="desktop"
								></schmancy-email-viewer>
							</div>
						</schmancy-code-preview>

						<!-- Email Recipients -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-email-recipients></schmancy-email-recipients>
								
								<script>
									const recipients = document.querySelector('schmancy-email-recipients');
									recipients.recipients = [
										{ email: 'john@example.com', name: 'John Doe', selected: true },
										{ email: 'jane@example.com', name: 'Jane Smith', selected: false },
										{ email: 'team@example.com', name: 'Team List', selected: true }
									];
									
									recipients.addEventListener('recipients-change', (e) => {
									});
								</script>
							</div>
						</schmancy-code-preview>

						<!-- Upload Configuration -->
						<schmancy-code-preview language="javascript">
							const editor = document.querySelector('schmancy-email-editor');
							editor.config = {
								imageUploadHandler: async (file) => {
									// Upload image and return URL
									const formData = new FormData();
									formData.append('image', file);
									const response = await fetch('/api/upload', {
										method: 'POST',
										body: formData
									});
									const data = await response.json();
									return data.url;
								},
								fileUploadHandler: async (file) => {
									// Handle file uploads
									return {
										name: file.name,
										size: file.size,
										url: '/files/' + file.name
									};
								}
							};
						</schmancy-code-preview>

						<!-- Complete Mailbox -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-mailbox></schmancy-mailbox>
								
								<script>
									const mailbox = document.querySelector('schmancy-mailbox');
									
									// Configure templates - Professional, minimal, no-spam designs
									mailbox.templates = [
										// Text-first templates
										{
											id: 'quick-update',
											name: 'Quick Update',
											category: 'Updates',
											description: 'Brief bullet-point update',
											subject: 'Quick update from {{company}}',
											body: '**What\'s new:**\n\n• Feature X is now available\n• Performance improved by 40%\n• New documentation at docs.example.com\n\n**Action needed:** Update your API keys by Friday\n\n---\n\nQuestions? Reply to this email.'
										},
										{
											id: 'weekly-brief',
											name: 'Weekly Brief',
											category: 'Newsletter',
											description: 'Headlines with one-line summaries',
											subject: 'Week of {{date}} - 3 things to know',
											body: '**This week:**\n\n**1. System maintenance complete**\nAll services running 2x faster\n\n**2. New feature: Export to CSV**\nAvailable in Settings > Export\n\n**3. Office hours Thursday 2pm**\nBring your questions\n\n[View full details →](https://example.com/weekly)'
										},
										{
											id: 'product-update',
											name: 'Product Update',
											category: 'Updates',
											description: 'What changed and why it matters',
											subject: '{{product}} v{{version}} released',
											body: '**What changed:** Dark mode is here.\n\n**Why it matters:** Easier on your eyes during late-night work.\n\n**How to enable:** Settings > Appearance > Dark\n\n[Release notes](https://example.com/releases)'
										},
										{
											id: 'newsletter',
											name: 'Newsletter',
											category: 'Newsletter',
											description: 'Single topic, focused content',
											subject: '{{topic}} - What you need to know',
											body: '**The situation:** API rate limits are changing next month.\n\n**What this means:** Current limit of 1000 requests/hour increases to 5000 for all plans. No action needed on your part.\n\n**Timeline:** Changes take effect {{date}}.\n\n[Documentation](https://example.com/api-limits) | [Contact support](mailto:support@example.com)'
										},
										// Minimal visual templates
										{
											id: 'announcement',
											name: 'Announcement',
											category: 'Announcements',
											description: 'One image, one headline, one CTA',
											subject: 'Announcing {{feature}}',
											body: '![{{feature}}](https://via.placeholder.com/600x300)\n\n## {{feature}} is now available\n\nStart using it today. No setup required.\n\n[Get started →](https://example.com/start)'
										},
										{
											id: 'feature-launch',
											name: 'Feature Launch',
											category: 'Announcements',
											description: 'Screenshot with key benefits',
											subject: 'New: {{feature}}',
											body: '![Screenshot](https://via.placeholder.com/600x400)\n\n**{{feature}}**\n\n✓ 50% faster processing\n✓ Works with existing setup\n✓ No additional cost\n\n[Try it now](https://example.com/feature) • [Learn more](https://example.com/docs)'
										},
										{
											id: 'monthly-recap',
											name: 'Monthly Recap',
											category: 'Newsletter',
											description: 'Numbers and stats in clean grid',
											subject: '{{month}} by the numbers',
											body: '## {{month}} Summary\n\n**99.9%** Uptime\n**2.3M** API calls processed\n**18ms** Average response time\n**4** New features shipped\n\n---\n\n**Top feature:** CSV export (used by 8,420 customers)\n\n**Coming next:** Webhook support\n\n[View detailed metrics](https://example.com/metrics)'
										},
										{
											id: 'event-notice',
											name: 'Event Notice',
											category: 'Events',
											description: 'Essential event information only',
											subject: '{{event}} - {{date}}',
											body: '## {{event}}\n\n**When:** {{date}} at {{time}} {{timezone}}\n**Where:** {{location}}\n**Duration:** {{duration}}\n\n{{description}}\n\n[Add to calendar](https://example.com/calendar) • [Register](https://example.com/register)\n\nCan\'t make it? Recording will be available.'
										}
									];
									
									// Configure import sources
									mailbox.importSources = [
										{
											id: 'crm',
											label: 'CRM Contacts',
											icon: 'contacts',
											handler: () => importFromCRM()
										}
									];
									
									// Configure upload handlers
									mailbox.config = {
										sendEndpoint: '/api/send-email',
										imageUploadHandler: async (file) => {
											return '/uploaded/image-url';
										}
									};
									
									// Handle events
									mailbox.addEventListener('send-email', (e) => {
									});
									
									mailbox.addEventListener('send-error', (e) => {
									});
								</script>
							</div>
						</schmancy-code-preview>

						<!-- TypeScript Integration -->
						<schmancy-code-preview language="javascript">
							import '@mhmo91/schmancy/mailbox';
							
							// Configure the mailbox
							const mailbox = document.querySelector('schmancy-mailbox');
							
							// Define templates - Professional, minimal, no-spam designs
							mailbox.templates = [
								// Text-first templates
								{
									id: 'quick-update',
									name: 'Quick Update',
									category: 'Updates',
									description: 'Brief bullet-point update',
									subject: 'Quick update from {{company}}',
									body: '**What\'s new:**\n\n• Feature X is now available\n• Performance improved by 40%\n• New documentation at docs.example.com\n\n**Action needed:** Update your API keys by Friday\n\n---\n\nQuestions? Reply to this email.'
								},
								{
									id: 'weekly-brief',
									name: 'Weekly Brief',
									category: 'Newsletter',
									description: 'Headlines with one-line summaries',
									subject: 'Week of {{date}} - 3 things to know',
									body: '**This week:**\n\n**1. System maintenance complete**\nAll services running 2x faster\n\n**2. New feature: Export to CSV**\nAvailable in Settings > Export\n\n**3. Office hours Thursday 2pm**\nBring your questions\n\n[View full details →](https://example.com/weekly)'
								},
								{
									id: 'product-update',
									name: 'Product Update',
									category: 'Updates',
									description: 'What changed and why it matters',
									subject: '{{product}} v{{version}} released',
									body: '**What changed:** Dark mode is here.\n\n**Why it matters:** Easier on your eyes during late-night work.\n\n**How to enable:** Settings > Appearance > Dark\n\n[Release notes](https://example.com/releases)'
								},
								{
									id: 'newsletter',
									name: 'Newsletter',
									category: 'Newsletter',
									description: 'Single topic, focused content',
									subject: '{{topic}} - What you need to know',
									body: '**The situation:** API rate limits are changing next month.\n\n**What this means:** Current limit of 1000 requests/hour increases to 5000 for all plans. No action needed on your part.\n\n**Timeline:** Changes take effect {{date}}.\n\n[Documentation](https://example.com/api-limits) | [Contact support](mailto:support@example.com)'
								},
								// Minimal visual templates
								{
									id: 'announcement',
									name: 'Announcement',
									category: 'Announcements',
									description: 'One image, one headline, one CTA',
									subject: 'Announcing {{feature}}',
									body: '![{{feature}}](https://via.placeholder.com/600x300)\n\n## {{feature}} is now available\n\nStart using it today. No setup required.\n\n[Get started →](https://example.com/start)'
								},
								{
									id: 'feature-launch',
									name: 'Feature Launch',
									category: 'Announcements',
									description: 'Screenshot with key benefits',
									subject: 'New: {{feature}}',
									body: '![Screenshot](https://via.placeholder.com/600x400)\n\n**{{feature}}**\n\n✓ 50% faster processing\n✓ Works with existing setup\n✓ No additional cost\n\n[Try it now](https://example.com/feature) • [Learn more](https://example.com/docs)'
								},
								{
									id: 'monthly-recap',
									name: 'Monthly Recap',
									category: 'Newsletter',
									description: 'Numbers and stats in clean grid',
									subject: '{{month}} by the numbers',
									body: '## {{month}} Summary\n\n**99.9%** Uptime\n**2.3M** API calls processed\n**18ms** Average response time\n**4** New features shipped\n\n---\n\n**Top feature:** CSV export (used by 8,420 customers)\n\n**Coming next:** Webhook support\n\n[View detailed metrics](https://example.com/metrics)'
								},
								{
									id: 'event-notice',
									name: 'Event Notice',
									category: 'Events',
									description: 'Essential event information only',
									subject: '{{event}} - {{date}}',
									body: '## {{event}}\n\n**When:** {{date}} at {{time}} {{timezone}}\n**Where:** {{location}}\n**Duration:** {{duration}}\n\n{{description}}\n\n[Add to calendar](https://example.com/calendar) • [Register](https://example.com/register)\n\nCan\'t make it? Recording will be available.'
								}
							];
							
							// Define import sources
							mailbox.importSources = [
								{
									id: 'crm',
									label: 'CRM Contacts',
									icon: 'contacts',
									handler: async () => {
										const emails = await fetchFromCRM();
										mailbox.addRecipients(emails);
									}
								}
							];
							
							// Configure upload handlers
							mailbox.config = {
								sendEndpoint: '/api/send-email',
								imageUploadHandler: async (file) => {
									const formData = new FormData();
									formData.append('image', file);
									const response = await fetch('/api/upload/image', {
										method: 'POST',
										body: formData
									});
									const data = await response.json();
									return data.url;
								}
							};
							
							// Handle email sending
							mailbox.addEventListener('send-email', async (e) => {
								const { request } = e.detail;
								
								try {
									await fetch('/api/send-email', {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify(request)
									});
									
									mailbox.clearCompose();
								} catch (error) {
									console.error('Failed to send email:', error);
								}
							});
							
							// Handle errors
							mailbox.addEventListener('send-error', (e) => {
								console.error('Send error:', e.detail.error);
							});
						</schmancy-code-preview>

						<!-- Template Variables -->
						<schmancy-code-preview language="javascript">
							// Template with variables
							const template = {
								id: 'personalized',
								name: 'Personalized Email',
								subject: 'Hello {{name}}, welcome to {{company}}!',
								body: '# Hello {{name}}!\\n\\nWelcome to **{{company}}**! We are excited to have you join us on {{date}}.\\n\\nYour account details:\\n- Email: {{email}}\\n- Role: {{role}}\\n- Start Date: {{startDate}}\\n\\nBest regards,\\nThe {{company}} Team'
							};
							
							// Variables will be replaced when template is applied
							const variables = {
								name: 'John Doe',
								company: 'Acme Corp',
								email: 'john@example.com',
								role: 'Developer',
								date: new Date().toLocaleDateString(),
								startDate: 'March 1, 2024'
							};
						</schmancy-code-preview>

						<!-- Real-World Example -->
						<schmancy-code-preview language="html">
							<div class="space-y-6">
								<!-- Email composition interface -->
								<schmancy-card>
									<div class="p-6">
										<schmancy-typography type="headline" token="md" class="mb-4 block">
											Send Marketing Campaign
										</schmancy-typography>
										
										<!-- Recipients management -->
										<schmancy-email-recipients class="mb-4"></schmancy-email-recipients>
										
										<!-- Email editor -->
										<schmancy-email-editor class="mb-4"></schmancy-email-editor>
										
										<!-- Email preview -->
										<schmancy-email-viewer mode="desktop"></schmancy-email-viewer>
									</div>
									
									<schmancy-card-action>
										<schmancy-button variant="text">Save Draft</schmancy-button>
										<schmancy-button variant="filled">Send Campaign</schmancy-button>
									</schmancy-card-action>
								</schmancy-card>
							</div>
						</schmancy-code-preview>
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