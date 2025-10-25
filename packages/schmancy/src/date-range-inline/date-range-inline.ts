import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyFormField } from '@mixins/index'

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-date-range-inline': SchmancyDateRangeInline
	}
}

export type SchmancyDateRangeInlineChangeEvent = CustomEvent<{
	dateFrom: string
	dateTo: string
	isValid: boolean
}>

/**
 * Smart inline date range picker that handles all the heavy lifting.
 * Auto-corrects invalid ranges, provides smart defaults, and validates dates.
 */
@customElement('schmancy-date-range-inline')
export default class SchmancyDateRangeInline extends SchmancyFormField() {
	/**
	 * Input type - 'date' or 'datetime-local'
	 */
	@property({ type: String })
	type: 'date' | 'datetime-local' = 'date'

	/**
	 * From date configuration
	 */
	@property({ type: Object })
	dateFrom: { label: string; value: string } = { label: 'From', value: '' }

	/**
	 * To date configuration
	 */
	@property({ type: Object })
	dateTo: { label: string; value: string } = { label: 'To', value: '' }

	/**
	 * Minimum allowed date
	 */
	@property({ type: String })
	minDate?: string

	/**
	 * Maximum allowed date
	 */
	@property({ type: String })
	maxDate?: string

	/**
	 * Compact mode for smaller UI
	 */
	@property({ type: Boolean })
	compact = false

	/**
	 * Auto-correct invalid date ranges
	 */
	@property({ type: Boolean })
	autoCorrect = true

	/**
	 * Minimum gap between dates (in days)
	 */
	@property({ type: Number })
	minGap = 0

	/**
	 * Maximum gap between dates (in days)
	 */
	@property({ type: Number })
	maxGap?: number

	/**
	 * Default gap when auto-setting dates (in days)
	 */
	@property({ type: Number })
	defaultGap = 1

	/**
	 * Whether to allow same date selection
	 */
	@property({ type: Boolean })
	allowSameDate = false

	/**
	 * Internal validation state
	 */
	@state()
	private validationState = {
		dateFromError: '',
		dateToError: '',
		rangeError: ''
	}

	connectedCallback() {
		super.connectedCallback()
		// Initialize with smart defaults if no values provided
		if (!this.dateFrom.value && !this.dateTo.value) {
			this.setSmartDefaults()
		} else {
			// Validate initial values
			this.validateAndCorrect()
		}
	}

	/**
	 * Set smart default dates based on context
	 */
	private setSmartDefaults() {
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + this.defaultGap)

		const format = this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD'
		
		this.dateFrom = {
			...this.dateFrom,
			value: this.formatDate(today, format)
		}
		
		this.dateTo = {
			...this.dateTo,
			value: this.formatDate(tomorrow, format)
		}
	}

	/**
	 * Format date to required string format
	 */
	private formatDate(date: Date, format: string): string {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		
		if (format === 'YYYY-MM-DD') {
			return `${year}-${month}-${day}`
		} else {
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			return `${year}-${month}-${day}T${hours}:${minutes}`
		}
	}

	/**
	 * Parse date string to Date object
	 */
	private parseDate(dateStr: string): Date | null {
		if (!dateStr) return null
		const date = new Date(dateStr)
		return isNaN(date.getTime()) ? null : date
	}

	/**
	 * Calculate days between two dates
	 */
	private getDaysBetween(date1: Date, date2: Date): number {
		const msPerDay = 24 * 60 * 60 * 1000
		return Math.floor((date2.getTime() - date1.getTime()) / msPerDay)
	}

	/**
	 * Handle from date change with validation and auto-correction
	 */
	private handleDateFromChange(e: Event) {
		const input = e.target as HTMLInputElement
		const newValue = input.value

		// Update the value
		this.dateFrom = { ...this.dateFrom, value: newValue }

		// Clear previous errors
		this.validationState = { ...this.validationState, dateFromError: '', rangeError: '' }

		if (!newValue) {
			// Allow empty for optional fields
			if (!this.required) {
				this.emitChange()
				return
			}
			this.validationState = { ...this.validationState, dateFromError: 'Start date is required' }
			this.error = true
			return
		}

		// Validate and potentially auto-correct
		this.validateAndCorrect('from')
	}

	/**
	 * Handle to date change with validation and auto-correction
	 */
	private handleDateToChange(e: Event) {
		const input = e.target as HTMLInputElement
		const newValue = input.value

		// Update the value
		this.dateTo = { ...this.dateTo, value: newValue }

		// Clear previous errors
		this.validationState = { ...this.validationState, dateToError: '', rangeError: '' }

		if (!newValue) {
			// Allow empty for optional fields
			if (!this.required) {
				this.emitChange()
				return
			}
			this.validationState = { ...this.validationState, dateToError: 'End date is required' }
			this.error = true
			return
		}

		// Validate and potentially auto-correct
		this.validateAndCorrect('to')
	}

	/**
	 * Validate dates and auto-correct if enabled
	 */
	private validateAndCorrect(changedField?: 'from' | 'to') {
		const fromDate = this.parseDate(this.dateFrom.value)
		const toDate = this.parseDate(this.dateTo.value)

		// Reset validation state
		let hasError = false
		const newValidationState = { dateFromError: '', dateToError: '', rangeError: '' }

		// Validate individual dates
		if (this.dateFrom.value && !fromDate) {
			newValidationState.dateFromError = 'Invalid date format'
			hasError = true
		}

		if (this.dateTo.value && !toDate) {
			newValidationState.dateToError = 'Invalid date format'
			hasError = true
		}

		// If both dates are valid, check range constraints
		if (fromDate && toDate) {
			const daysBetween = this.getDaysBetween(fromDate, toDate)

			// Check if from date is after to date
			if (fromDate > toDate) {
				if (this.autoCorrect) {
					// Auto-correct based on which field changed
					if (changedField === 'from') {
						// User changed from date, adjust to date
						const newToDate = new Date(fromDate)
						newToDate.setDate(newToDate.getDate() + this.defaultGap)
						this.dateTo = {
							...this.dateTo,
							value: this.formatDate(newToDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					} else if (changedField === 'to') {
						// User changed to date, adjust from date
						const newFromDate = new Date(toDate)
						newFromDate.setDate(newFromDate.getDate() - this.defaultGap)
						this.dateFrom = {
							...this.dateFrom,
							value: this.formatDate(newFromDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					} else {
						// No specific field changed, swap them
						const tempValue = this.dateFrom.value
						this.dateFrom = { ...this.dateFrom, value: this.dateTo.value }
						this.dateTo = { ...this.dateTo, value: tempValue }
					}
					// Re-validate after correction
					this.validateAndCorrect()
					return
				} else {
					newValidationState.rangeError = 'End date must be after start date'
					hasError = true
				}
			}

			// Check same date constraint
			if (!this.allowSameDate && daysBetween === 0) {
				if (this.autoCorrect && changedField) {
					// Auto-correct by adjusting the other date
					if (changedField === 'from') {
						const newToDate = new Date(fromDate)
						newToDate.setDate(newToDate.getDate() + this.defaultGap)
						this.dateTo = {
							...this.dateTo,
							value: this.formatDate(newToDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					} else {
						const newFromDate = new Date(toDate)
						newFromDate.setDate(newFromDate.getDate() - this.defaultGap)
						this.dateFrom = {
							...this.dateFrom,
							value: this.formatDate(newFromDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					}
					// Re-validate after correction
					this.validateAndCorrect()
					return
				} else {
					newValidationState.rangeError = 'Start and end dates cannot be the same'
					hasError = true
				}
			}

			// Check minimum gap
			if (this.minGap > 0 && daysBetween < this.minGap) {
				if (this.autoCorrect && changedField) {
					// Auto-correct to maintain minimum gap
					if (changedField === 'from') {
						const newToDate = new Date(fromDate)
						newToDate.setDate(newToDate.getDate() + this.minGap)
						this.dateTo = {
							...this.dateTo,
							value: this.formatDate(newToDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					} else {
						const newFromDate = new Date(toDate)
						newFromDate.setDate(newFromDate.getDate() - this.minGap)
						this.dateFrom = {
							...this.dateFrom,
							value: this.formatDate(newFromDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					}
					// Re-validate after correction
					this.validateAndCorrect()
					return
				} else {
					newValidationState.rangeError = `Minimum ${this.minGap} day${this.minGap > 1 ? 's' : ''} required between dates`
					hasError = true
				}
			}

			// Check maximum gap
			if (this.maxGap !== undefined && daysBetween > this.maxGap) {
				if (this.autoCorrect && changedField) {
					// Auto-correct to maintain maximum gap
					if (changedField === 'from') {
						const newToDate = new Date(fromDate)
						newToDate.setDate(newToDate.getDate() + this.maxGap)
						this.dateTo = {
							...this.dateTo,
							value: this.formatDate(newToDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					} else {
						const newFromDate = new Date(toDate)
						newFromDate.setDate(newFromDate.getDate() - this.maxGap)
						this.dateFrom = {
							...this.dateFrom,
							value: this.formatDate(newFromDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
						}
					}
					// Re-validate after correction
					this.validateAndCorrect()
					return
				} else {
					newValidationState.rangeError = `Maximum ${this.maxGap} day${this.maxGap > 1 ? 's' : ''} allowed between dates`
					hasError = true
				}
			}

			// Check against min/max date constraints
			if (this.minDate) {
				const minDateObj = this.parseDate(this.minDate)
				if (minDateObj && fromDate < minDateObj) {
					newValidationState.dateFromError = 'Date is before minimum allowed date'
					hasError = true
				}
			}

			if (this.maxDate) {
				const maxDateObj = this.parseDate(this.maxDate)
				if (maxDateObj && toDate > maxDateObj) {
					newValidationState.dateToError = 'Date is after maximum allowed date'
					hasError = true
				}
			}
		}

		// Update validation state
		this.validationState = newValidationState
		this.error = hasError

		// Emit change event with validation status
		this.emitChange()
	}

	/**
	 * Get computed min date for the "to" field based on "from" value
	 */
	private getComputedMinDateTo(): string | undefined {
		if (!this.dateFrom.value) return this.minDate

		const fromDate = this.parseDate(this.dateFrom.value)
		if (!fromDate) return this.minDate

		// Calculate minimum date based on constraints
		const minToDate = new Date(fromDate)
		
		if (!this.allowSameDate) {
			minToDate.setDate(minToDate.getDate() + 1)
		}
		
		if (this.minGap > 0) {
			minToDate.setDate(fromDate.getDate() + this.minGap)
		}

		// Compare with global minDate if set
		if (this.minDate) {
			const globalMin = this.parseDate(this.minDate)
			if (globalMin && globalMin > minToDate) {
				return this.minDate
			}
		}

		return this.formatDate(minToDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
	}

	/**
	 * Get computed max date for the "from" field based on "to" value
	 */
	private getComputedMaxDateFrom(): string | undefined {
		if (!this.dateTo.value) return this.maxDate

		const toDate = this.parseDate(this.dateTo.value)
		if (!toDate) return this.maxDate

		// Calculate maximum date based on constraints
		const maxFromDate = new Date(toDate)
		
		if (!this.allowSameDate) {
			maxFromDate.setDate(maxFromDate.getDate() - 1)
		}
		
		if (this.minGap > 0) {
			maxFromDate.setDate(toDate.getDate() - this.minGap)
		}

		// Compare with global maxDate if set
		if (this.maxDate) {
			const globalMax = this.parseDate(this.maxDate)
			if (globalMax && globalMax < maxFromDate) {
				return this.maxDate
			}
		}

		return this.formatDate(maxFromDate, this.type === 'datetime-local' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
	}

	emitChange() {
		const isValid = !this.error && 
			!!this.dateFrom.value && 
			!!this.dateTo.value && 
			!this.validationState.dateFromError && 
			!this.validationState.dateToError && 
			!this.validationState.rangeError

		this.dispatchEvent(new CustomEvent<SchmancyDateRangeInlineChangeEvent['detail']>('change', {
			detail: {
				dateFrom: this.dateFrom.value,
				dateTo: this.dateTo.value,
				isValid
			},
			bubbles: true,
			composed: true
		}))
	}

	protected render() {
		// Determine which error to show on each input
		const fromError = this.validationState.dateFromError || this.validationState.rangeError
		const toError = this.validationState.dateToError || this.validationState.rangeError

		return html`
			<div class="w-full">
				<div class="flex items-start gap-2 w-full">
					<div class="flex-1">
						<schmancy-input
							.type=${this.type}
							.label=${this.dateFrom.label}
							.value=${this.dateFrom.value}
							.min=${this.minDate}
							.max=${this.getComputedMaxDateFrom()}
							@change=${this.handleDateFromChange}
							.error=${!!fromError}
							.hint=${fromError || ''}
							.required=${this.required}
							.disabled=${this.disabled}
							size=${this.compact ? 'sm' : 'md'}
						></schmancy-input>
					</div>

					<div class="flex items-center justify-center ${this.compact ? 'pt-8' : 'pt-10'} px-1">
						<schmancy-icon class="text-surface-onVariant opacity-50">
							arrow_forward
						</schmancy-icon>
					</div>

					<div class="flex-1">
						<schmancy-input
							.type=${this.type}
							.label=${this.dateTo.label}
							.value=${this.dateTo.value}
							.min=${this.getComputedMinDateTo()}
							.max=${this.maxDate}
							@change=${this.handleDateToChange}
							.error=${!!toError}
							.hint=${toError || ''}
							.required=${this.required}
							.disabled=${this.disabled}
							size=${this.compact ? 'sm' : 'md'}
						></schmancy-input>
					</div>
				</div>
			</div>
		`
	}
}