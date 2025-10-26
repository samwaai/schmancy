import { $LitElement } from '@mhmo91/schmancy/mixins'
import { customElement } from 'lit/decorators.js'
import { html } from 'lit'

@customElement('demo-feedback-loading')
export default class DemoFeedbackLoading extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Spinner & Busy
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Loading indicators with spinner animations and Apple-style glass blur effects for elegant busy states.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/busy/spinner'
						import '@mhmo91/schmancy/busy/busy'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="overflow-hidden">
						<table class="w-full">
							<thead>
								<tr class="border-b border-outline/12">
									<th class="text-left p-4">
										<schmancy-typography type="label" token="lg">Property</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="lg">Type</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="lg">Default</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="lg">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-outline/12">
									<td class="p-4">
										<schmancy-typography type="body" token="md">size</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">'24px'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Sets the width and height of the spinner</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outline/12">
									<td class="p-4">
										<schmancy-typography type="body" token="md">color</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">'gray'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Color of the spinner (currently uses secondary color)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outline/12">
									<td class="p-4">
										<schmancy-typography type="body" token="md">glass</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md">Applies Apple visionOS-style glass morphism effect</schmancy-typography>
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
						<!-- Default Spinner -->
						<schmancy-code-preview>
							<schmancy-spinner></schmancy-spinner>
						</schmancy-code-preview>

						<!-- Different Sizes -->
						<schmancy-code-preview>
							<div class="flex items-center gap-4">
								<schmancy-spinner size="16px"></schmancy-spinner>
								<schmancy-spinner size="20px"></schmancy-spinner>
								<schmancy-spinner size="24px"></schmancy-spinner>
								<schmancy-spinner size="32px"></schmancy-spinner>
								<schmancy-spinner size="48px"></schmancy-spinner>
							</div>
						</schmancy-code-preview>

						<!-- In Context Examples -->
						<schmancy-code-preview>
							<schmancy-button variant="filled">
								<div class="flex items-center gap-2">
									<schmancy-spinner size="16px"></schmancy-spinner>
									<span>Loading...</span>
								</div>
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Card with Loading State -->
						<schmancy-code-preview>
							<schmancy-card type="elevated" class="p-6">
								<div class="flex flex-col items-center justify-center gap-4 h-32">
									<schmancy-spinner size="32px"></schmancy-spinner>
									<schmancy-typography type="body" token="lg">Loading content...</schmancy-typography>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Inline Loading -->
						<schmancy-code-preview>
							<schmancy-typography type="body" token="lg" class="flex items-center gap-2">
								<span>Processing your request</span>
								<schmancy-spinner size="16px"></schmancy-spinner>
							</schmancy-typography>
						</schmancy-code-preview>

						<!-- Apple Glass Effect with Busy -->
						<schmancy-code-preview>
							<div class="relative h-64">
								<schmancy-card type="elevated" class="p-6 h-full">
									<schmancy-typography type="headline" token="md" class="mb-4">
										Beautiful Content
									</schmancy-typography>
									<schmancy-typography type="body" token="md" class="mb-3">
										This content is behind a glass blur effect when loading.
									</schmancy-typography>
									<schmancy-button variant="filled">Action Button</schmancy-button>
								</schmancy-card>
								<schmancy-busy>
									<schmancy-spinner size="48px"></schmancy-spinner>
								</schmancy-busy>
							</div>
						</schmancy-code-preview>

						<!-- Glass Effect on Image -->
						<schmancy-code-preview>
							<div class="relative h-64 rounded-xl overflow-hidden">
								<img 
									src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop" 
									alt="Abstract" 
									class="w-full h-full object-cover"
								/>
								<schmancy-busy>
									<div class="flex flex-col items-center gap-3">
										<schmancy-spinner size="32px"></schmancy-spinner>
										<schmancy-typography type="label" token="lg" class="text-white">
											Loading image...
										</schmancy-typography>
									</div>
								</schmancy-busy>
							</div>
						</schmancy-code-preview>

						<!-- Glass Spinner -->
						<schmancy-code-preview>
							<div class="flex items-center gap-4 p-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
								<schmancy-spinner size="24px" glass></schmancy-spinner>
								<schmancy-spinner size="32px" glass></schmancy-spinner>
								<schmancy-spinner size="48px" glass></schmancy-spinner>
							</div>
						</schmancy-code-preview>

						<!-- Glass Progress Bars -->
						<schmancy-code-preview>
							<div class="space-y-4 p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
								<schmancy-progress value="30" glass></schmancy-progress>
								<schmancy-progress value="60" glass color="secondary"></schmancy-progress>
								<schmancy-progress value="85" glass color="success" size="lg"></schmancy-progress>
								<schmancy-progress indeterminate glass></schmancy-progress>
							</div>
						</schmancy-code-preview>

						<!-- Combined Glass Effects -->
						<schmancy-code-preview>
							<div class="relative h-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8">
								<div class="text-white space-y-4">
									<schmancy-typography type="headline" token="lg">
										Apple visionOS Style
									</schmancy-typography>
									<schmancy-typography type="body" token="lg">
										Beautiful glass morphism effects inspired by Apple's design language
									</schmancy-typography>
									<div class="pt-4">
										<schmancy-progress value="75" glass size="lg"></schmancy-progress>
									</div>
								</div>
								<schmancy-busy>
									<schmancy-spinner size="64px" glass></schmancy-spinner>
								</schmancy-busy>
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
		'demo-feedback-loading': DemoFeedbackLoading
	}
}
