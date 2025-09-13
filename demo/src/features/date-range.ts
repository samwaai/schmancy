import { $LitElement } from '@mixins/index'
import dayjs from 'dayjs'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-date-range')
export class DemoDateRange extends $LitElement() {
	@state() selectedRange = { from: '', to: '' }
	@state() eventDateRange = { from: '', to: '' }
	@state() reportRange = { from: '', to: '' }

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block"> Date Range </schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Advanced date range picker with keyboard navigation, mobile optimization, direct text input, and smart
					presets. Fully accessible with ARIA support.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript"> import '@mhmo91/schmancy/date-range' </schmancy-code-preview>
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
										<schmancy-typography type="body" token="sm">'date'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Type of date input</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>dateFrom</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">{label: string, value: string}</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">{label: 'From', value: ''}</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">{label: 'To', value: ''}</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">End date configuration</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Minimum selectable date</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Maximum selectable date</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>customPresets</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm"
											>Array&lt;{label, dateFrom, dateTo}&gt;</schmancy-typography
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">[]</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Custom date range presets</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>disabled</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Disables the input</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>required</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Makes the field required</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>placeholder</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'Select date range'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Placeholder text</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>clearable</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">true</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Shows clear button</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">step</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm"
											>'day' | 'week' | 'month' | 'year' | number</schmancy-typography
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm"
											>Navigation step for arrow buttons. Auto-detects if not set. Number = days to
											shift</schmancy-typography
										>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>allowDirectInput</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">true</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Allows typing dates directly</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mt-4">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Event</schmancy-typography>
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">change</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm"
											>{ dateFrom: string, dateTo: string }</schmancy-typography
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fired when date range changes</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Keyboard Shortcuts Table -->
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mt-4">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Keyboard Shortcut</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Action</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">PageUp</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Navigate to previous date range</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>PageDown</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Navigate to next date range</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>Ctrl+Home</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Jump to start of current month</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
											>Ctrl+End</code
										>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Jump to end of current month</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">Escape</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Close date picker dropdown</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">Tab</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm"
											>Navigate between elements (focus trapped in dropdown)</schmancy-typography
										>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

					<div class="grid gap-6 w-full">
						<!-- Basic Date Range -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
								}}"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- Auto-detection Example -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Auto-detects step based on range type (single day = 1 day step)
								</schmancy-typography>
								<schmancy-date-range
									.dateFrom="${{ label: 'From', value: new Date().toISOString().split('T')[0] }}"
									.dateTo="${{ label: 'To', value: new Date().toISOString().split('T')[0] }}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Auto-detection Week Example -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Full week range auto-detects week step
								</schmancy-typography>
								<schmancy-date-range
									.dateFrom="${{
										label: 'From',
										value: new Date(new Date().setDate(new Date().getDate() - new Date().getDay()))
											.toISOString()
											.split('T')[0],
									}}"
									.dateTo="${{
										label: 'To',
										value: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6))
											.toISOString()
											.split('T')[0],
									}}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Auto-detection Month Example -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Full month range auto-detects month step
								</schmancy-typography>
								<schmancy-date-range
									.dateFrom="${{
										label: 'From',
										value: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
									}}"
									.dateTo="${{
										label: 'To',
										value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
									}}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Direct Text Input -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Type dates directly using formats like "Jan 1 - Jan 31" or "2024-01-01 to 2024-01-31"
								</schmancy-typography>
								<schmancy-date-range
									allowDirectInput
									placeholder="Type or select date range"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Keyboard Navigation Demo -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Use PageUp/PageDown keys to navigate through date ranges
								</schmancy-typography>
								<schmancy-date-range
									.dateFrom="${{ label: 'Start', value: new Date().toISOString().split('T')[0] }}"
									.dateTo="${{
										label: 'End',
										value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- With Custom Labels -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								.dateFrom="${{ label: 'Start Date', value: '' }}"
								.dateTo="${{ label: 'End Date', value: '' }}"
								placeholder="Choose your travel dates"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- DateTime Range -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								type="datetime-local"
								.dateFrom="${{ label: 'Check-in', value: '' }}"
								.dateTo="${{ label: 'Check-out', value: '' }}"
								placeholder="Select check-in and check-out times"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- With Min/Max Dates -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								minDate="${new Date().toISOString().split('T')[0]}"
								maxDate="${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}"
								placeholder="Select dates within next 30 days"
								@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
								}}"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- Step with Min/Max - Read Only Navigation -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									When step is provided, calendar dialog is disabled. Navigation respects min/max dates.
								</schmancy-typography>
								<schmancy-date-range
									step="day"
									.minDate="${dayjs().subtract(7, 'D').format('YYYY-MM-DD')}"
									.maxDate="${dayjs().format('YYYY-MM-DD')}"
									.dateFrom="${{ label: 'From', value: '2025-01-01' }}"
									.dateTo="${{ label: 'To', value: '2025-01-07' }}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Navigation Step Examples -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Week navigation - shifts by one week
								</schmancy-typography>
								<schmancy-date-range
									step="week"
									.dateFrom="${{ label: 'Start', value: new Date().toISOString().split('T')[0] }}"
									.dateTo="${{
										label: 'End',
										value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
									}}"
									minDate="${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}"
									maxDate="${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Month Step Navigation -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Month navigation - shifts by one month
								</schmancy-typography>
								<schmancy-date-range
									step="month"
									.dateFrom="${{
										label: 'Start',
										value: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
									}}"
									.dateTo="${{
										label: 'End',
										value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
									}}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Custom Days Step Navigation -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Custom step - shifts by 3 days
								</schmancy-typography>
								<schmancy-date-range
									.step="${3}"
									.dateFrom="${{ label: 'Start', value: new Date().toISOString().split('T')[0] }}"
									.dateTo="${{
										label: 'End',
										value: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
									}}"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>

						<!-- Custom Presets -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								.customPresets="${[
									{
										label: 'Last 7 Days',
										dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
										dateTo: new Date().toISOString().split('T')[0],
									},
									{
										label: 'Last 30 Days',
										dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
										dateTo: new Date().toISOString().split('T')[0],
									},
									{
										label: 'This Month',
										dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
										dateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
											.toISOString()
											.split('T')[0],
									},
									{
										label: 'Last Month',
										dateFrom: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
											.toISOString()
											.split('T')[0],
										dateTo: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
									},
								]}"
								placeholder="Select reporting period"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- State Management Example -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="flex flex-col gap-4">
								<schmancy-date-range
									.dateFrom="${{ label: 'Event Start', value: this.eventDateRange.from }}"
									.dateTo="${{ label: 'Event End', value: this.eventDateRange.to }}"
									placeholder="Select event duration"
									@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
										this.eventDateRange = { from: e.detail.dateFrom, to: e.detail.dateTo }
									}}"
								></schmancy-date-range>

								<schmancy-surface type="containerLow" class="p-4 rounded-lg">
									<schmancy-typography type="body" token="md">
										${this.eventDateRange.from && this.eventDateRange.to
											? html`Event scheduled from
													<span class="font-medium text-primary-default">${this.eventDateRange.from}</span> to
													<span class="font-medium text-primary-default">${this.eventDateRange.to}</span>`
											: html`No event dates selected`}
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Form Integration -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-form
								@submit="${(e: CustomEvent) => {
									alert('Booking submitted! Check console for details.')
								}}"
								class="space-y-4 max-w-md"
							>
								<schmancy-typography type="headline" token="sm" class="block mb-4"> Hotel Booking </schmancy-typography>

								<schmancy-input
									label="Guest Name"
									name="guestName"
									placeholder="Enter your full name"
									required
								></schmancy-input>

								<schmancy-date-range
									name="stayDates"
									.dateFrom="${{ label: 'Check-in Date', value: '' }}"
									.dateTo="${{ label: 'Check-out Date', value: '' }}"
									minDate="${new Date().toISOString().split('T')[0]}"
									required
									placeholder="Select your stay dates"
								></schmancy-date-range>

								<schmancy-select label="Room Type" name="roomType" required placeholder="Select a room type">
									<schmancy-option value="standard">Standard Room</schmancy-option>
									<schmancy-option value="deluxe">Deluxe Room</schmancy-option>
									<schmancy-option value="suite">Suite</schmancy-option>
								</schmancy-select>

								<schmancy-button type="submit" variant="filled"> Book Now </schmancy-button>
							</schmancy-form>
						</schmancy-code-preview>

						<!-- Analytics Dashboard Example -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="flex flex-col gap-4">
								<schmancy-card type="outlined" class="p-4">
									<div class="flex flex-col gap-4">
										<schmancy-typography type="headline" token="sm" class="block">
											Analytics Dashboard
										</schmancy-typography>

										<schmancy-date-range
											.dateFrom="${{ label: 'Period Start', value: this.reportRange.from }}"
											.dateTo="${{ label: 'Period End', value: this.reportRange.to }}"
											.customPresets="${[
												{
													label: 'Today',
													dateFrom: new Date().toISOString().split('T')[0],
													dateTo: new Date().toISOString().split('T')[0],
												},
												{
													label: 'Yesterday',
													dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
													dateTo: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
												},
												{
													label: 'Last 7 Days',
													dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
													dateTo: new Date().toISOString().split('T')[0],
												},
												{
													label: 'Last 30 Days',
													dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
													dateTo: new Date().toISOString().split('T')[0],
												},
												{
													label: 'This Quarter',
													dateFrom: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1)
														.toISOString()
														.split('T')[0],
													dateTo: new Date().toISOString().split('T')[0],
												},
											]}"
											placeholder="Select reporting period"
											@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
												this.reportRange = { from: e.detail.dateFrom, to: e.detail.dateTo }
											}}"
										></schmancy-date-range>

										${this.reportRange.from && this.reportRange.to
											? html`
													<div class="grid grid-cols-2 gap-3">
														<schmancy-surface type="containerLow" class="p-3 rounded">
															<schmancy-typography type="label" token="sm" class="text-surface-onVariant block">
																Total Revenue
															</schmancy-typography>
															<schmancy-typography type="headline" token="md" class="text-primary-default block">
																$24,567
															</schmancy-typography>
														</schmancy-surface>

														<schmancy-surface type="containerLow" class="p-3 rounded">
															<schmancy-typography type="label" token="sm" class="text-surface-onVariant block">
																Active Users
															</schmancy-typography>
															<schmancy-typography type="headline" token="md" class="text-primary-default block">
																1,234
															</schmancy-typography>
														</schmancy-surface>
													</div>
												`
											: html`
													<schmancy-typography
														type="body"
														token="md"
														class="text-surface-onVariant text-center py-8 block"
													>
														Select a date range to view analytics
													</schmancy-typography>
												`}
									</div>
								</schmancy-card>
							</div>
						</schmancy-code-preview>

						<!-- Disabled State -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								disabled
								.dateFrom="${{ label: 'Start', value: '2024-01-01' }}"
								.dateTo="${{ label: 'End', value: '2024-01-31' }}"
								placeholder="Date selection disabled"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- Button-only Mode (No Direct Input) -->
						<schmancy-code-preview .preview=${true} language="html">
							<schmancy-date-range
								.allowDirectInput="${false}"
								placeholder="Click to select dates"
								@change="${(e: CustomEvent<{ dateFrom: string; dateTo: string }>) => {
								}}"
							></schmancy-date-range>
						</schmancy-code-preview>

						<!-- Today Highlighting -->
						<schmancy-code-preview .preview=${true} language="html">
							<div class="space-y-4">
								<schmancy-typography type="body" token="md" class="block">
									Today's date is automatically highlighted with a visual indicator
								</schmancy-typography>
								<schmancy-date-range
									.dateFrom="${{ label: 'From', value: new Date().toISOString().split('T')[0] }}"
									.dateTo="${{
										label: 'To',
										value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
									}}"
								></schmancy-date-range>
							</div>
						</schmancy-code-preview>
					</div>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-date-range': DemoDateRange
	}
}
