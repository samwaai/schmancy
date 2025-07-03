import { $LitElement } from '@mixins/index'
import dayjs from 'dayjs'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { $dialog } from '../dialog/dialog-service'
import { DateRangePreset, PresetCategory } from './date-range-presets'

/**
 * Dialog content component for date range selection
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
		return html`
			<div class="w-full min-h-[400px] max-h-[80vh] flex flex-col p-4">
				<!-- Custom Range Section with Inline Calendars -->
				<schmancy-surface type="container" class="rounded-xl p-4 mb-6">
					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- From Date Calendar -->
							<div class="flex flex-col gap-2">
								<schmancy-typography type="label" token="md" class="text-surface-onVariant">
									${this.dateFrom.label || 'From'}
								</schmancy-typography>
								<schmancy-input
									type="${this.type}"
									.value="${this.dateFrom.value}"
									min="${ifDefined(this.minDate)}"
									max="${ifDefined(this.maxDate)}"
									@change="${this.handleFromDateChange}"
								></schmancy-input>
							</div>
							
							<!-- To Date Calendar -->
							<div class="flex flex-col gap-2">
								<schmancy-typography type="label" token="md" class="text-surface-onVariant">
									${this.dateTo.label || 'To'}
								</schmancy-typography>
								<schmancy-input
									type="${this.type}"
									.value="${this.dateTo.value}"
									min="${ifDefined(this.dateFrom.value)}"
									max="${ifDefined(this.maxDate)}"
									@change="${this.handleToDateChange}"
								></schmancy-input>
							</div>
						</div>
						
						<!-- Apply Button - Now at the bottom for logical flow -->
						<div class="flex justify-end mt-2">
							<schmancy-button 
								variant="filled" 
								@click="${(e: Event) => this.applyManualDateSelection(e)}"
								?disabled="${!this.dateFrom.value || !this.dateTo.value}"
							>
								Apply
							</schmancy-button>
						</div>
					</div>
				</schmancy-surface>

				<!-- Presets Section -->
				<div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
					<div class="grid grid-cols-2 md:grid-cols-5 gap-6">
						${this.presetCategories.map(
							category => html`
								<div class="space-y-3">
									<schmancy-typography type="title" token="md" class="text-surface-onVariant font-medium">
										${category.name}
									</schmancy-typography>
									<div class="space-y-1">
										${category.presets.map(
											preset => html`
												<schmancy-button
													variant="${this.activePreset === preset.label ? 'filled' : 'text'}"
													class="w-full justify-start text-left"
													@click="${(e: Event) => this.handlePresetSelection(preset, e)}"
													aria-pressed="${this.activePreset === preset.label}"
													aria-label="${preset.label}: ${preset.range.dateFrom} to ${preset.range.dateTo}"
													title="${preset.range.dateFrom} to ${preset.range.dateTo}"
												>
													<span class="truncate">${preset.label}</span>
												</schmancy-button>
											`,
										)}
									</div>
								</div>
							`,
						)}
					</div>
				</div>
			</div>
		`
	}
}