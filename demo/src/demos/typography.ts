import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-core-typography')
export class DemoCoreTypography extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Typography
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design 3 typography system extended with 6 type scales, each in 5 sizes.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/typography'
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">type</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'body'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Typography style type</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">token</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'xs' | 'sm' | 'md' | 'lg' | 'xl'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'md'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Size variant</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">align</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'left' | 'center' | 'right' | 'justify'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Text alignment</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">weight</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'normal' | 'medium' | 'bold'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Font weight override</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">transform</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'uppercase' | 'lowercase' | 'capitalize' | 'normal'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Text transformation</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">max-lines</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											1 | 2 | 3 | 4 | 5 | 6
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Truncate text after n lines</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">font-size</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Custom font size</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">line-height</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Custom line height</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">letter-spacing</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Custom letter spacing</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Type Scale Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Type Scale Reference</schmancy-typography>

					<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
						<div class="overflow-x-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b border-outline">
										<th class="text-left py-2 pr-4">
											<schmancy-typography type="label" token="md">Type</schmancy-typography>
										</th>
										<th class="text-center py-2 px-2 min-w-[60px]">
											<schmancy-typography type="label" token="md">XL</schmancy-typography>
										</th>
										<th class="text-center py-2 px-2 min-w-[60px]">
											<schmancy-typography type="label" token="md">LG</schmancy-typography>
										</th>
										<th class="text-center py-2 px-2 min-w-[60px]">
											<schmancy-typography type="label" token="md">MD</schmancy-typography>
										</th>
										<th class="text-center py-2 px-2 min-w-[60px]">
											<schmancy-typography type="label" token="md">SM</schmancy-typography>
										</th>
										<th class="text-center py-2 px-2 min-w-[60px]">
											<schmancy-typography type="label" token="md">XS</schmancy-typography>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr class="border-b border-outline">
										<td class="py-3 pr-4">
											<schmancy-typography type="label" token="md">Display</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">72/80</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">57/64</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">45/52</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">36/44</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">28/36</schmancy-typography>
										</td>
									</tr>
									<tr class="border-b border-outline">
										<td class="py-3 pr-4">
											<schmancy-typography type="label" token="md">Headline</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">36/44</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">32/40</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">28/36</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">24/32</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">20/28</schmancy-typography>
										</td>
									</tr>
									<tr class="border-b border-outline">
										<td class="py-3 pr-4">
											<schmancy-typography type="label" token="md">Title</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">24/32</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">22/28</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">16/24*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">14/20*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">12/16*</schmancy-typography>
										</td>
									</tr>
									<tr class="border-b border-outline">
										<td class="py-3 pr-4">
											<schmancy-typography type="label" token="md">Subtitle</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">20/28*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">18/24*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">16/24*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">14/20*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">12/16*</schmancy-typography>
										</td>
									</tr>
									<tr class="border-b border-outline">
										<td class="py-3 pr-4">
											<schmancy-typography type="label" token="md">Body</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">18/28</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">16/24</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">14/20</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">12/16</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">10/14</schmancy-typography>
										</td>
									</tr>
									<tr>
										<td class="py-3 pr-4">
											<schmancy-typography type="label" token="md">Label</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">16/22*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">14/20*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">12/16*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">11/16*</schmancy-typography>
										</td>
										<td class="py-3 px-2 text-center">
											<schmancy-typography type="body" token="sm">10/14*</schmancy-typography>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<schmancy-typography type="body" token="sm" class="block mt-4 text-surface-onVariant">
							Format: font-size/line-height • * indicates font-weight 500
						</schmancy-typography>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full">
						<!-- Basic Usage -->
						<schmancy-code-preview language="html">
							<div class="space-y-2">
								<schmancy-typography type="headline" token="lg" class="block">Welcome Back</schmancy-typography>
								<schmancy-typography type="body" token="lg" class="block">Enter your credentials to access your account</schmancy-typography>
								<schmancy-typography type="body" token="md" class="block text-surface-onVariant">Don't have an account? <span class="text-primary-default cursor-pointer">Sign up</span></schmancy-typography>
							</div>
						</schmancy-code-preview>

						<!-- Type Scale Hierarchy -->
						<schmancy-code-preview preview language="html">
							<article class="space-y-4">
								<schmancy-typography type="display" token="xl" class="block">
									Display XL
								</schmancy-typography>
								<schmancy-typography type="headline" token="lg" class="block">
									Headline Large
								</schmancy-typography>
								<schmancy-typography type="title" token="md" class="block">
									Section Title
								</schmancy-typography>
								<schmancy-typography type="subtitle" token="md" class="block">
									Subtitle for additional context
								</schmancy-typography>
								<schmancy-typography type="body" token="md" class="block">
									Body text for main content. This is the default size for most text in your application.
								</schmancy-typography>
								<schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
									Label • Metadata • Secondary Info
								</schmancy-typography>
							</article>
						</schmancy-code-preview>

						<!-- Real World Examples -->
						<schmancy-code-preview language="html">
							<!-- Blog Post -->
							<article class="space-y-3">
								<schmancy-typography type="headline" token="lg" class="block">
									Understanding Web Components
								</schmancy-typography>
								<schmancy-typography type="subtitle" token="lg" class="block">
									A comprehensive guide to modern web development
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant block mt-2">
									By Jane Doe • March 15, 2024 • 5 min read
								</schmancy-typography>
								<schmancy-typography type="body" token="lg" class="block mt-4">
									Web Components are a set of web platform APIs that allow you to create custom,
									reusable HTML elements with encapsulated functionality.
								</schmancy-typography>
							</article>
						</schmancy-code-preview>

						<!-- Product Card -->
						<schmancy-code-preview language="html">
							<schmancy-card class="p-4">
								<schmancy-typography type="label" token="sm" class="text-primary-default block mb-2">
									NEW ARRIVAL
								</schmancy-typography>
								<schmancy-typography type="title" token="lg" class="block">
									Wireless Headphones
								</schmancy-typography>
								<schmancy-typography type="body" token="md" class="block mt-2 mb-3">
									Premium noise-cancelling headphones with 30-hour battery life.
								</schmancy-typography>
								<schmancy-typography type="headline" token="md" class="block text-primary-default">
									$299.99
								</schmancy-typography>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Form with Labels -->
						<schmancy-code-preview language="html">
							<form class="space-y-4 max-w-sm">
								<div>
									<schmancy-typography type="label" token="md" class="block mb-1">
										Email Address
									</schmancy-typography>
									<schmancy-input type="email" placeholder="user@example.com"></schmancy-input>
								</div>
								<div>
									<schmancy-typography type="label" token="md" class="block mb-1">
										Password
									</schmancy-typography>
									<schmancy-input type="password"></schmancy-input>
									<schmancy-typography type="body" token="sm" class="block mt-1 text-surface-onVariant">
										Must be at least 8 characters
									</schmancy-typography>
								</div>
								<schmancy-button variant="filled">
									<schmancy-typography type="label" token="lg">Sign In</schmancy-typography>
								</schmancy-button>
							</form>
						</schmancy-code-preview>

						<!-- Dashboard Metrics -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-3 gap-4">
								<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
									<schmancy-typography type="label" token="sm" class="block text-surface-onVariant mb-1">
										TOTAL REVENUE
									</schmancy-typography>
									<schmancy-typography type="display" token="sm" class="block">
										$42.5K
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-success-default">
										↑ 12% from last month
									</schmancy-typography>
								</schmancy-surface>
								<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
									<schmancy-typography type="label" token="sm" class="block text-surface-onVariant mb-1">
										ACTIVE USERS
									</schmancy-typography>
									<schmancy-typography type="display" token="sm" class="block">
										1,234
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-success-default">
										↑ 8% from last week
									</schmancy-typography>
								</schmancy-surface>
								<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
									<schmancy-typography type="label" token="sm" class="block text-surface-onVariant mb-1">
										CONVERSION
									</schmancy-typography>
									<schmancy-typography type="display" token="sm" class="block">
										3.2%
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-error-default">
										↓ 2% from average
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Text Utilities -->
						<schmancy-code-preview language="html">
							<!-- Alignment -->
							<schmancy-typography align="center" class="block mb-2">Centered text</schmancy-typography>

							<!-- Weight Override -->
							<schmancy-typography weight="bold" class="block mb-2">Bold text emphasis</schmancy-typography>

							<!-- Transform -->
							<schmancy-typography type="label" transform="uppercase" class="block mb-2">
								uppercase label
							</schmancy-typography>

							<!-- Truncation -->
							<schmancy-typography max-lines="2" class="block">
								This is a long text that will be truncated after two lines. Lorem ipsum dolor sit amet,
								consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
							</schmancy-typography>
						</schmancy-code-preview>

						<!-- Extended Sizes Example -->
						<schmancy-code-preview language="html">
							<div class="space-y-2">
								<schmancy-typography type="display" token="xl" class="block">
									Display XL (72px)
								</schmancy-typography>
								<schmancy-typography type="headline" token="xs" class="block">
									Headline XS (20px)
								</schmancy-typography>
								<schmancy-typography type="body" token="xl" class="block">
									Body XL for improved readability (18px)
								</schmancy-typography>
								<schmancy-typography type="label" token="xs" class="block">
									Label XS for dense UI (10px)
								</schmancy-typography>
							</div>
						</schmancy-code-preview>

						<!-- Navigation Example -->
						<schmancy-code-preview language="html">
							<nav class="flex items-center gap-6">
								<schmancy-typography type="title" token="lg" weight="medium">
									Brand
								</schmancy-typography>
								<schmancy-typography type="label" token="lg" class="text-surface-onVariant hover:text-primary-default cursor-pointer">
									Products
								</schmancy-typography>
								<schmancy-typography type="label" token="lg" class="text-surface-onVariant hover:text-primary-default cursor-pointer">
									About
								</schmancy-typography>
								<schmancy-typography type="label" token="lg" class="text-surface-onVariant hover:text-primary-default cursor-pointer">
									Contact
								</schmancy-typography>
							</nav>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-core-typography': DemoCoreTypography
	}
}