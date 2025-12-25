import { $LitElement } from '@mixins/index'
import dayjs from 'dayjs'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { repeat } from 'lit/directives/repeat.js'
import { $dialog } from '../dialog/dialog-service'
import { DateRangePreset, PresetCategory } from './date-range-presets'

interface PresetGroup {
	name: string
	presets: DateRangePreset[]
}

/**
 * Dialog content component for date range selection
 *
 * Redesigned with chip-based horizontal flow layout:
 * - Quick Select: Today, Yesterday, This Week, This Month
 * - Days: Last 7/14/30/60/90 Days
 * - Periods: Last Week, Last Month, Last Quarter, Last Year
 * - Year to Date: This Week, This Month, This Quarter, This Year, YTD
 * - Custom Range: Manual date inputs at the bottom
 *
 * @element schmancy-date-range-dialog
 */
@customElement('schmancy-date-range-dialog')
export class SchmancyDateRangeDialog extends $LitElement() {
	@property({ type: String }) type: 'date' | 'datetime-local' = 'date'
	@property({ type: Object }) dateFrom: { label: string; value: string } = { label: 'From', value: '' }
	@property({ type: Object }) dateTo: { label: string; value: string } = { label: 'To', value: '' }
	@property({ type: String }) minDate?: string
	@property({ type: String }) maxDate?: string
	@property({ type: String }) activePreset: string | null = null
	@property({ type: Array }) presetCategories: PresetCategory[] = []

	/**
	 * Reorganizes presets into the new grouped layout
	 */
	private getPresetGroups(): PresetGroup[] {
		const allPresets = this.presetCategories.flatMap(c => c.presets)

		// Quick Select: Today, Yesterday, This Week, This Month
		const quickSelectLabels = ['Today', 'Yesterday', 'This Week', 'This Month']
		const quickSelect = quickSelectLabels
			.map(label => allPresets.find(p => p.label === label))
			.filter((p): p is DateRangePreset => p !== undefined)

		// Days: Last 7/14/30/60/90 Days
		const daysLabels = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Last 60 Days', 'Last 90 Days']
		const days = daysLabels
			.map(label => allPresets.find(p => p.label === label))
			.filter((p): p is DateRangePreset => p !== undefined)

		// Periods: Last Week, Last Month, Last Quarter, Last Year
		const periodsLabels = ['Last Week', 'Last Month', 'Last Quarter', 'Last Year']
		const periods = periodsLabels
			.map(label => allPresets.find(p => p.label === label))
			.filter((p): p is DateRangePreset => p !== undefined)

		// Year to Date: This Week, This Month, This Quarter, This Year, YTD
		const ytdLabels = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Year to Date']
		const yearToDate = ytdLabels
			.map(label => allPresets.find(p => p.label === label))
			.filter((p): p is DateRangePreset => p !== undefined)

		const groups: PresetGroup[] = []

		if (quickSelect.length > 0) {
			groups.push({ name: 'Quick Select', presets: quickSelect })
		}
		if (days.length > 0) {
			groups.push({ name: 'Days', presets: days })
		}
		if (periods.length > 0) {
			groups.push({ name: 'Periods', presets: periods })
		}
		if (yearToDate.length > 0) {
			groups.push({ name: 'Year to Date', presets: yearToDate })
		}

		return groups
	}

	private handleFromDateChange(e: Event) {
		const input = e.target as HTMLInputElement
		this.dateFrom = { ...this.dateFrom, value: input.value }

		// If the new start date is after the current end date, adjust the end date
		if (this.dateTo.value && dayjs(this.dateFrom.value).isAfter(dayjs(this.dateTo.value))) {
			this.dateTo = { ...this.dateTo, value: this.dateFrom.value }
		}

		this.dispatchEvent(new CustomEvent('date-change', {
			detail: { dateFrom: this.dateFrom.value, dateTo: this.dateTo.value },
			bubbles: true,
			composed: true
		}))
	}

	private handleToDateChange(e: Event) {
		const input = e.target as HTMLInputElement
		this.dateTo = { ...this.dateTo, value: input.value }

		this.dispatchEvent(new CustomEvent('date-change', {
			detail: { dateFrom: this.dateFrom.value, dateTo: this.dateTo.value },
			bubbles: true,
			composed: true
		}))
	}

	private handlePresetSelection(preset: DateRangePreset, e: Event) {
		e.stopPropagation()
		this.dispatchEvent(new CustomEvent('preset-select', {
			detail: { preset },
			bubbles: true,
			composed: true
		}))
		$dialog.dismiss()
	}

	private applyManualDateSelection(e: Event) {
		e.stopPropagation()
		// Validate dates before applying
		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) {
			this.dispatchEvent(new CustomEvent('announce', {
				detail: { message: 'Invalid date format. Please check your input.' },
				bubbles: true,
				composed: true
			}))
			return
		}

		this.dispatchEvent(new CustomEvent('apply-dates', {
			detail: {
				dateFrom: this.dateFrom.value,
				dateTo: this.dateTo.value,
				swapIfNeeded: fromDate.isAfter(toDate)
			},
			bubbles: true,
			composed: true
		}))

		$dialog.dismiss()
	}

	render() {
		const presetGroups = this.getPresetGroups()

		return html`
			<div class="w-full min-h-[400px] max-h-[80vh] flex flex-col p-4">
				<!-- Preset Groups Section -->
				<div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0 space-y-4">
					${repeat(
						presetGroups,
						group => group.name,
						group => html`
							<div class="space-y-2">
								<schmancy-typography type="label" token="md" class="text-surface-onVariant">
									${group.name}
								</schmancy-typography>
								<div class="flex flex-wrap gap-2">
									${repeat(
										group.presets,
										preset => preset.label,
										preset => html`
											<schmancy-filter-chip
												.value=${preset.label}
												.selected=${this.activePreset === preset.label}
												@click=${(e: Event) => this.handlePresetSelection(preset, e)}
												title="${preset.range.dateFrom} to ${preset.range.dateTo}"
											>
												${preset.label}
											</schmancy-filter-chip>
										`
									)}
								</div>
							</div>
						`
					)}
				</div>

				<!-- Divider -->
				<schmancy-divider class="my-4"></schmancy-divider>

				<!-- Custom Range Section -->
				<div class="space-y-2">
					<div class="flex items-end gap-3 flex-wrap">
						<div class="flex-1 min-w-[140px]">
							<schmancy-input
								.type="${this.type}"
								.label="${this.dateFrom.label || 'From'}"
								.value="${this.dateFrom.value}"
								min="${ifDefined(this.minDate)}"
								max="${ifDefined(this.maxDate)}"
								@change="${this.handleFromDateChange}"
							></schmancy-input>
						</div>
						<div class="flex-1 min-w-[140px]">
							<schmancy-input
								.type="${this.type}"
								.label="${this.dateTo.label || 'To'}"
								.value="${this.dateTo.value}"
								min="${ifDefined(this.dateFrom.value)}"
								max="${ifDefined(this.maxDate)}"
								@change="${this.handleToDateChange}"
							></schmancy-input>
						</div>
						<schmancy-button
							variant="filled"
							@click="${(e: Event) => this.applyManualDateSelection(e)}"
							?disabled="${!this.dateFrom.value || !this.dateTo.value}"
						>
							Apply
						</schmancy-button>
					</div>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-date-range-dialog': SchmancyDateRangeDialog
	}
}
