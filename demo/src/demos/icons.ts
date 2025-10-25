import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-core-icons')
export class DemoCoreIcons extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Icons
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design icons with customizable size and styling options.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/icon'
						import '@mhmo91/schmancy/icon-button'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Component</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Properties</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-icon</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											size: string (e.g., '24px', '2rem')<br>
											filled: boolean
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Basic icon component</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-icon-button</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											size: 'sm' | 'md' | 'lg'<br>
											variant: 'standard' | 'filled' | 'filled tonal' | 'outlined'<br>
											disabled: boolean
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Interactive icon button</schmancy-typography>
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
						<!-- Basic Icons -->
						<schmancy-code-preview language="html">
							<div class="flex items-center gap-4">
								<schmancy-icon>home</schmancy-icon>
								<schmancy-icon>search</schmancy-icon>
								<schmancy-icon>favorite</schmancy-icon>
								<schmancy-icon>settings</schmancy-icon>
								<schmancy-icon>person</schmancy-icon>
								<schmancy-icon>notifications</schmancy-icon>
							</div>
						</schmancy-code-preview>

						<!-- Icon Sizes -->
						<schmancy-code-preview language="html">
							<div class="flex items-center gap-4">
								<schmancy-icon size="16px">star</schmancy-icon>
								<schmancy-icon size="24px">star</schmancy-icon>
								<schmancy-icon size="32px">star</schmancy-icon>
								<schmancy-icon size="48px">star</schmancy-icon>
								<schmancy-icon size="64px">star</schmancy-icon>
							</div>
						</schmancy-code-preview>

						<!-- Filled vs Outlined -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-2 gap-4">
								<div class="flex items-center gap-2">
									<schmancy-icon>favorite_border</schmancy-icon>
									<schmancy-typography type="body" token="sm">Outlined</schmancy-typography>
								</div>
								<div class="flex items-center gap-2">
									<schmancy-icon filled>favorite</schmancy-icon>
									<schmancy-typography type="body" token="sm">Filled</schmancy-typography>
								</div>
								
								<div class="flex items-center gap-2">
									<schmancy-icon>bookmark_border</schmancy-icon>
									<schmancy-typography type="body" token="sm">Outlined</schmancy-typography>
								</div>
								<div class="flex items-center gap-2">
									<schmancy-icon filled>bookmark</schmancy-icon>
									<schmancy-typography type="body" token="sm">Filled</schmancy-typography>
								</div>
							</div>
						</schmancy-code-preview>

						<!-- Icon Buttons -->
						<schmancy-code-preview language="html">
							<div class="flex items-center gap-4">
								<schmancy-icon-button >
									<schmancy-icon>edit</schmancy-icon>
								</schmancy-icon-button>
								
								<schmancy-icon-button variant="filled">
									<schmancy-icon>add</schmancy-icon>
								</schmancy-icon-button>
								
								<schmancy-icon-button variant="filled tonal">
									<schmancy-icon>share</schmancy-icon>
								</schmancy-icon-button>
								
								<schmancy-icon-button variant="outlined">
									<schmancy-icon>delete</schmancy-icon>
								</schmancy-icon-button>
							</div>
						</schmancy-code-preview>

						<!-- Icon Button Sizes -->
						<schmancy-code-preview language="html">
							<div class="flex items-center gap-4">
								<schmancy-icon-button size="sm" variant="filled tonal">
									<schmancy-icon>thumb_up</schmancy-icon>
								</schmancy-icon-button>
								
								<schmancy-icon-button size="md" variant="filled tonal">
									<schmancy-icon>thumb_up</schmancy-icon>
								</schmancy-icon-button>
								
								<schmancy-icon-button size="lg" variant="filled tonal">
									<schmancy-icon>thumb_up</schmancy-icon>
								</schmancy-icon-button>
							</div>
						</schmancy-code-preview>

						<!-- Icons with Color -->
						<schmancy-code-preview language="html">
							<div class="flex items-center gap-4">
								<schmancy-icon class="text-primary-default">info</schmancy-icon>
								<schmancy-icon class="text-success-default">check_circle</schmancy-icon>
								<schmancy-icon class="text-error-default">error</schmancy-icon>
								<schmancy-icon class="text-warning-default" size="24px">warning</schmancy-icon>
								<schmancy-icon class="text-surface-onVariant">help</schmancy-icon>
							</div>
						</schmancy-code-preview>

						<!-- Practical Examples -->
						<schmancy-code-preview language="html">
							<!-- Navigation Bar -->
							<schmancy-surface type="surface" elevation="1" class="p-4">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-4">
										<schmancy-icon-button>
											<schmancy-icon>menu</schmancy-icon>
										</schmancy-icon-button>
										<schmancy-typography type="title" token="lg">App Name</schmancy-typography>
									</div>
									
									<div class="flex items-center gap-2">
										<schmancy-icon-button>
											<schmancy-icon>search</schmancy-icon>
										</schmancy-icon-button>
										<schmancy-icon-button>
											<schmancy-icon>notifications</schmancy-icon>
										</schmancy-icon-button>
										<schmancy-icon-button>
											<schmancy-icon>account_circle</schmancy-icon>
										</schmancy-icon-button>
									</div>
								</div>
							</schmancy-surface>
						</schmancy-code-preview>

						<schmancy-code-preview language="html">
							<!-- List Items with Icons -->
							<schmancy-list>
								<schmancy-list-item>
									<schmancy-icon slot="start">inbox</schmancy-icon>
									Inbox
									<schmancy-typography slot="end" type="label" token="sm" class="text-surface-onVariant">
										124
									</schmancy-typography>
								</schmancy-list-item>
								
								<schmancy-list-item>
									<schmancy-icon slot="start">send</schmancy-icon>
									Sent
								</schmancy-list-item>
								
								<schmancy-list-item>
									<schmancy-icon slot="start">drafts</schmancy-icon>
									Drafts
									<schmancy-typography slot="end" type="label" token="sm" class="text-surface-onVariant">
										3
									</schmancy-typography>
								</schmancy-list-item>
								
								<schmancy-list-item>
									<schmancy-icon slot="start" class="text-error-default">delete</schmancy-icon>
									Trash
								</schmancy-list-item>
							</schmancy-list>
						</schmancy-code-preview>

						<schmancy-code-preview language="html">
							<!-- Action Cards -->
							<div class="grid grid-cols-2 gap-4">
								<schmancy-card type="outlined">
									<schmancy-card-content>
										<div class="flex items-center gap-3 mb-2">
											<schmancy-icon class="text-primary-default" size="32px">cloud_upload</schmancy-icon>
											<schmancy-typography type="title" token="md">Upload Files</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Drag and drop or click to browse
										</schmancy-typography>
									</schmancy-card-content>
								</schmancy-card>
								
								<schmancy-card type="outlined">
									<schmancy-card-content>
										<div class="flex items-center gap-3 mb-2">
											<schmancy-icon class="text-success-default" size="32px">download</schmancy-icon>
											<schmancy-typography type="title" token="md">Download</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Export your data
										</schmancy-typography>
									</schmancy-card-content>
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
		'demo-core-icons': DemoCoreIcons
	}
}