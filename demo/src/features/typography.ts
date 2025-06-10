import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-typography')
export class DemoTypography extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4">
					Typography
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant">
					A flexible text component that provides consistent typography styles across your application. 
					Supports multiple variants (display, headline, title, body, label) with size tokens and customization options.
				</schmancy-typography>

				<!-- API Table -->
				<schmancy-surface class="mb-12 rounded-lg overflow-hidden">
					<table class="w-full">
						<thead class="bg-surface-dim">
							<tr>
								<th class="text-left p-4"><schmancy-typography type="label" token="md">Property</schmancy-typography></th>
								<th class="text-left p-4"><schmancy-typography type="label" token="md">Type</schmancy-typography></th>
								<th class="text-left p-4"><schmancy-typography type="label" token="md">Default</schmancy-typography></th>
							</tr>
						</thead>
						<tbody>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">type</code></td>
								<td class="p-4"><code class="text-sm">'display' | 'headline' | 'title' | 'body' | 'label'</code></td>
								<td class="p-4"><code class="text-sm">'body'</code></td>
							</tr>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">token</code></td>
								<td class="p-4"><code class="text-sm">'lg' | 'md' | 'sm'</code></td>
								<td class="p-4"><code class="text-sm">'md'</code></td>
							</tr>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">align</code></td>
								<td class="p-4"><code class="text-sm">'left' | 'center' | 'right' | 'justify'</code></td>
								<td class="p-4"><code class="text-sm">'left'</code></td>
							</tr>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">maxLines</code></td>
								<td class="p-4"><code class="text-sm">number</code></td>
								<td class="p-4"><code class="text-sm">undefined</code></td>
							</tr>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">lineHeight</code></td>
								<td class="p-4"><code class="text-sm">string</code></td>
								<td class="p-4"><code class="text-sm">undefined</code></td>
							</tr>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">fontSize</code></td>
								<td class="p-4"><code class="text-sm">string</code></td>
								<td class="p-4"><code class="text-sm">undefined</code></td>
							</tr>
							<tr class="border-t border-outline">
								<td class="p-4"><code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">letterSpacing</code></td>
								<td class="p-4"><code class="text-sm">string</code></td>
								<td class="p-4"><code class="text-sm">undefined</code></td>
							</tr>
						</tbody>
					</table>
				</schmancy-surface>

				<!-- Examples -->
				<schmancy-grid gap="lg" class="w-full">
					<!-- Basic Types -->
					<schmancy-code-preview language="html">
						<schmancy-typography type="display" token="lg">Display Large</schmancy-typography>
						<schmancy-typography type="headline" token="md">Headline Medium</schmancy-typography>
						<schmancy-typography type="title" token="sm">Title Small</schmancy-typography>
						<schmancy-typography type="body" token="lg">Body Large</schmancy-typography>
						<schmancy-typography type="label" token="md">Label Medium</schmancy-typography>
					</schmancy-code-preview>

					<!-- With Icons -->
					<schmancy-code-preview language="html">
						<schmancy-grid gap="sm">
							<schmancy-typography type="body" token="md" class="flex items-center gap-2">
								<schmancy-icon class="text-primary-default size-5">info</schmancy-icon>
								Information message
							</schmancy-typography>
							<schmancy-typography type="body" token="md" class="flex items-center gap-2">
								<schmancy-icon class="text-success-default size-5">check_circle</schmancy-icon>
								Success message
							</schmancy-typography>
							<schmancy-typography type="body" token="md" class="flex items-center gap-2">
								<schmancy-icon class="text-error-default size-5">error</schmancy-icon>
								Error message
							</schmancy-typography>
						</schmancy-grid>
					</schmancy-code-preview>

					<!-- Alignment -->
					<schmancy-code-preview language="html">
						<schmancy-grid gap="sm">
							<schmancy-typography type="body" token="md" align="left">Left aligned text</schmancy-typography>
							<schmancy-typography type="body" token="md" align="center">Center aligned text</schmancy-typography>
							<schmancy-typography type="body" token="md" align="right">Right aligned text</schmancy-typography>
							<schmancy-typography type="body" token="md" align="justify">Justified text that stretches across the full width of its container to create even margins on both sides.</schmancy-typography>
						</schmancy-grid>
					</schmancy-code-preview>

					<!-- Text Truncation -->
					<schmancy-code-preview language="html">
						<schmancy-typography type="body" token="md" maxLines="2">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
						</schmancy-typography>
					</schmancy-code-preview>

					<!-- Custom Styling -->
					<schmancy-code-preview language="html">
						<schmancy-typography 
							type="title" 
							token="lg"
							lineHeight="1.2"
							letterSpacing="0.02em"
							class="text-primary-default">
							Custom Styled Title
						</schmancy-typography>
					</schmancy-code-preview>

					<!-- Responsive Typography -->
					<schmancy-code-preview language="html">
						<schmancy-typography 
							type="body" 
							token="sm"
							class="text-base md:text-lg lg:text-xl">
							Responsive text that grows with screen size
						</schmancy-typography>
					</schmancy-code-preview>

					<!-- All Variants -->
					<schmancy-code-preview language="html">
						<schmancy-grid gap="md">
							<schmancy-surface type="surfaceDim" class="p-4 rounded">
								<schmancy-typography type="display" token="lg">Display lg</schmancy-typography>
								<schmancy-typography type="display" token="md">Display md</schmancy-typography>
								<schmancy-typography type="display" token="sm">Display sm</schmancy-typography>
							</schmancy-surface>
							
							<schmancy-surface type="surfaceDim" class="p-4 rounded">
								<schmancy-typography type="headline" token="lg">Headline lg</schmancy-typography>
								<schmancy-typography type="headline" token="md">Headline md</schmancy-typography>
								<schmancy-typography type="headline" token="sm">Headline sm</schmancy-typography>
							</schmancy-surface>
							
							<schmancy-surface type="surfaceDim" class="p-4 rounded">
								<schmancy-typography type="title" token="lg">Title lg</schmancy-typography>
								<schmancy-typography type="title" token="md">Title md</schmancy-typography>
								<schmancy-typography type="title" token="sm">Title sm</schmancy-typography>
							</schmancy-surface>
							
							<schmancy-surface type="surfaceDim" class="p-4 rounded">
								<schmancy-typography type="body" token="lg">Body lg</schmancy-typography>
								<schmancy-typography type="body" token="md">Body md</schmancy-typography>
								<schmancy-typography type="body" token="sm">Body sm</schmancy-typography>
							</schmancy-surface>
							
							<schmancy-surface type="surfaceDim" class="p-4 rounded">
								<schmancy-typography type="label" token="lg">Label lg</schmancy-typography>
								<schmancy-typography type="label" token="md">Label md</schmancy-typography>
								<schmancy-typography type="label" token="sm">Label sm</schmancy-typography>
							</schmancy-surface>
						</schmancy-grid>
					</schmancy-code-preview>
				</schmancy-grid>
			</schmancy-surface>
		`
	}
}

export default DemoTypography