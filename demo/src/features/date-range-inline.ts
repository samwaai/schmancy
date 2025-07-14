import { $LitElement } from '@mixins/index'
import { SchmancyDateRangeInlineChangeEvent } from '@schmancy/date-range-inline'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-date-range-inline')
export class DemoDateRangeInline extends $LitElement() {
	@state() private lastEvent = ''

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Date Range Inline
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Smart inline date range picker that handles all the heavy lifting. Auto-corrects invalid selections, validates ranges, and prevents user errors.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/date-range-inline'
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
										<schmancy-typography type="body" token="sm">'date' | 'datetime-local'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'date'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Input type for date selection</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">dateFrom</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">{label: string, value: string}</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{label: 'From', value: ''}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Start date configuration</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">dateTo</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">{label: string, value: string}</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{label: 'To', value: ''}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">End date configuration</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">autoCorrect</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">true</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Auto-correct invalid date ranges</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">minGap</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">0</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Minimum days between dates</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">maxGap</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number | undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Maximum days between dates</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">defaultGap</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">1</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Default gap when auto-setting dates</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">allowSameDate</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Allow same date selection</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">minDate</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Minimum allowed date</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">maxDate</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Maximum allowed date</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">compact</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Compact mode for smaller UI</schmancy-typography>
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
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Basic Usage (Auto-corrects invalid selections)
							</schmancy-typography>
							<schmancy-date-range-inline
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									this.lastEvent = `From: ${e.detail.dateFrom}, To: ${e.detail.dateTo}, Valid: ${e.detail.isValid}`
									console.log('Date range changed:', e.detail);
								}}
							></schmancy-date-range-inline>
							<div class="mt-2 text-sm text-surface-onVariant">${this.lastEvent || 'Try selecting an end date before the start date!'}</div>
						</schmancy-code-preview>

						<!-- Hotel Booking -->
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Hotel Booking (Min 1 night, Max 30 nights)
							</schmancy-typography>
							<schmancy-date-range-inline
								.dateFrom=${{ label: 'Check-in', value: '' }}
								.dateTo=${{ label: 'Check-out', value: '' }}
								minGap="1"
								maxGap="30"
								defaultGap="3"
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									if (e.detail.isValid) {
										const days = this.calculateDays(e.detail.dateFrom, e.detail.dateTo)
										console.log(`${days} nights selected`)
									}
								}}
							></schmancy-date-range-inline>
						</schmancy-code-preview>

						<!-- Car Rental -->
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Car Rental (Same day allowed)
							</schmancy-typography>
							<schmancy-date-range-inline
								.dateFrom=${{ label: 'Pick-up', value: '' }}
								.dateTo=${{ label: 'Drop-off', value: '' }}
								allowSameDate
								type="datetime-local"
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									console.log('Rental period:', e.detail);
								}}
							></schmancy-date-range-inline>
						</schmancy-code-preview>

						<!-- Weekend Trip -->
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Weekend Getaway (2-4 nights only)
							</schmancy-typography>
							<schmancy-date-range-inline
								.dateFrom=${{ label: 'Arrival', value: '' }}
								.dateTo=${{ label: 'Departure', value: '' }}
								minGap="2"
								maxGap="4"
								defaultGap="2"
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									console.log('Weekend trip:', e.detail);
								}}
							></schmancy-date-range-inline>
						</schmancy-code-preview>

						<!-- Validation Example -->
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Manual Validation (No auto-correct)
							</schmancy-typography>
							<schmancy-date-range-inline
								autoCorrect=${false}
								required
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									console.log('Validation state:', e.detail.isValid);
								}}
							></schmancy-date-range-inline>
						</schmancy-code-preview>

						<!-- Future Dates Only -->
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Future Dates Only (Conference Registration)
							</schmancy-typography>
							<schmancy-date-range-inline
								.dateFrom=${{ label: 'Conference Start', value: '' }}
								.dateTo=${{ label: 'Conference End', value: '' }}
								.minDate=${new Date().toISOString().split('T')[0]}
								.maxDate=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
								minGap="1"
								maxGap="7"
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									console.log('Conference dates:', e.detail);
								}}
							></schmancy-date-range-inline>
						</schmancy-code-preview>

						<!-- Compact Mode -->
						<schmancy-code-preview language="html">
							<schmancy-typography type="headline" token="sm" class="mb-4 block">
								Compact Mode (Mobile)
							</schmancy-typography>
							<schmancy-date-range-inline
								compact
								@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
									console.log('Compact mode:', e.detail);
								}}
							></schmancy-date-range-inline>
						</schmancy-code-preview>

						<!-- Real World Example -->
						<schmancy-code-preview language="html">
							<schmancy-surface type="container" class="p-6">
								<schmancy-typography type="headline" token="md" class="mb-6 block">
									Book Your Stay
								</schmancy-typography>
								
								<schmancy-date-range-inline
									id="booking-dates"
									class="mb-6"
									.dateFrom=${{ label: 'Check-in', value: '' }}
									.dateTo=${{ label: 'Check-out', value: '' }}
									minGap="1"
									maxGap="21"
									defaultGap="2"
									required
									@change=${(e: SchmancyDateRangeInlineChangeEvent) => {
										const elem = document.getElementById('booking-summary');
										if (elem && e.detail.isValid) {
											const nights = this.calculateDays(e.detail.dateFrom, e.detail.dateTo);
											const pricePerNight = 150;
											const total = nights * pricePerNight;
											elem.innerHTML = `
												<div class="space-y-2">
													<div class="flex justify-between">
														<span>$${pricePerNight} × ${nights} night${nights > 1 ? 's' : ''}</span>
														<span class="font-semibold">$${total}</span>
													</div>
												</div>
											`;
										}
									}}
								></schmancy-date-range-inline>
								
								<div id="booking-summary" class="mb-6 p-4 bg-surface-container rounded-lg">
									<div class="text-surface-onVariant">
										Select your dates above
									</div>
								</div>
								
								<schmancy-button variant="filled" class="w-full">
									Continue to Payment
								</schmancy-button>
							</schmancy-surface>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}

	private calculateDays(from: string, to: string): number {
		const fromDate = new Date(from)
		const toDate = new Date(to)
		const msPerDay = 24 * 60 * 60 * 1000
		return Math.floor((toDate.getTime() - fromDate.getTime()) / msPerDay)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-date-range-inline': DemoDateRangeInline
	}
}