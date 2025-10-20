import '@lit-labs/virtualizer'
import { $LitElement } from '@mixins/litElement.mixin'
import { html, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import './row' // Import the schmancy-table-row component

// Define a generic TableColumn interface.
// The `key` is now a key of T, and the render function accepts T.
export interface TableColumn<T extends Record<string, any> = any> {
	name: string
	key?: keyof T // Key to access the property on the data object.
	align?: 'left' | 'right' | 'center'
	weight?: 'normal' | 'bold'
	render?: (item: T) => TemplateResult | string | number // Custom render function for complex content
	sortable?: boolean // Whether this column is sortable
	value?: (item: T) => any // Custom value function for sorting
}

// Define an event detail interface for row events.
export interface RowEventDetail<T> {
	item: T
	index: number
}

// Define sort direction type
export type SortDirection = 'asc' | 'desc' | null

/**
 * SchmancyDataTable is a generic data table component.
 * It supports sorting, filtering, and custom rendering of rows.
 *
 */
@customElement('schmancy-table')
export class SchmancyDataTable<T extends Record<string, any> = any> extends $LitElement() {
	@property({ type: Array, attribute: false })
	columns: TableColumn<T>[] = []

	@property({ type: Array, attribute: false })
	data: T[] = []

	// The keyField is now of type keyof T.
	@property({ type: String })
	keyField: keyof T = 'id' as keyof T

	@property({ type: String })
	cols: string = '1fr'

	// Sorting property
	@property({ type: Boolean })
	sortable: boolean = false

	// Internal state properties
	@state() private sortColumn: keyof T | null = null
	@state() private sortDirection: SortDirection = null
	@state() private filteredData: T[] = []

	constructor() {
		super()
		this.filteredData = this.data
	}

	// Process the data whenever our dependencies change
	protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
		if (
			changedProperties.has('data') ||
			changedProperties.has('sortColumn') ||
			changedProperties.has('sortDirection')
		) {
			this.processData()
		}
	}

	/**
	 * Helper function to check if a value is a Date object in a type-safe way
	 */
	private isDate(value: any): value is Date {
		return value && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]'
	}

	private processData(): void {
		let result = [...this.data]

		// Apply sorting
		if (this.sortable && this.sortColumn && this.sortDirection) {
			// Find the column configuration for the sorting column
			const sortColumnConfig = this.columns.find(col => col.key === this.sortColumn)

			result.sort((a, b) => {
				// Use the value function if provided in the column configuration
				let aValue, bValue

				if (sortColumnConfig && sortColumnConfig.value) {
					// Use custom value function for sorting
					aValue = sortColumnConfig.value(a)
					bValue = sortColumnConfig.value(b)
				} else {
					// Use standard property access
					aValue = a[this.sortColumn as keyof T]
					bValue = b[this.sortColumn as keyof T]
				}

				// Handle null/undefined values - always sort them to the end regardless of sort direction
				if (aValue === null || aValue === undefined) {
					return this.sortDirection === 'asc' ? 1 : -1
				}
				if (bValue === null || bValue === undefined) {
					return this.sortDirection === 'asc' ? -1 : 1
				}

				// Handle numbers
				if (typeof aValue === 'number' && typeof bValue === 'number') {
					return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue
				}

				// Detect and handle numeric strings - convert to numbers if both values are numeric
				const aNumeric = typeof aValue === 'string' && !isNaN(Number(aValue))
				const bNumeric = typeof bValue === 'string' && !isNaN(Number(bValue))

				if (aNumeric && bNumeric) {
					const aNum = parseFloat(aValue as string)
					const bNum = parseFloat(bValue as string)
					return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum
				}

				// Handle dates - with proper type checking
				if (this.isDate(aValue) && this.isDate(bValue)) {
					return this.sortDirection === 'asc'
						? aValue.getTime() - bValue.getTime()
						: bValue.getTime() - aValue.getTime()
				}

				// Convert to strings for string comparison or fallback comparison
				const aStr = String(aValue)
				const bStr = String(bValue)
				return this.sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
			})
		}

		this.filteredData = result
	}

	// Toggle sort for a column
	private toggleSort(column: TableColumn<T>): void {
		if (!column.key || column.sortable === false) return

		const columnKey = column.key

		// If clicking the same column, cycle through sort states: asc -> desc -> null
		if (columnKey === this.sortColumn) {
			if (this.sortDirection === 'asc') {
				this.sortDirection = 'desc'
			} else if (this.sortDirection === 'desc') {
				this.sortDirection = null
			} else {
				this.sortDirection = 'asc'
			}
		} else {
			// New column, start with ascending
			this.sortColumn = columnKey
			this.sortDirection = 'asc'
		}

		// Dispatch sort event
		this.dispatchEvent(
			new CustomEvent('sort-change', {
				detail: {
					column: this.sortColumn,
					direction: this.sortDirection,
				},
				bubbles: true,
				composed: true,
			}),
		)
	}

	// Render sort indicator
	private renderSortIndicator(column: TableColumn<T>): TemplateResult | null {
		if (!this.sortable || column.sortable === false || !column.key || column.key !== this.sortColumn) {
			return null
		}

		return html`
			<span class="ml-1">
				${this.sortDirection === 'asc'
					? html`<schmancy-icon size="16px">arrow_upward</schmancy-icon>`
					: this.sortDirection === 'desc'
						? html`<schmancy-icon size="16px">arrow_downward</schmancy-icon>`
						: null}
			</span>
		`
	}

	render(): TemplateResult {
		const columnHeadClasses = column => ({
			'flex items-center': true,
			'cursor-pointer gap-1': this.sortable && column.sortable !== false && column.key,
		})
		return html`
			<schmancy-grid class="h-full w-full" cols="1fr" rows="auto 1fr">
				<schmancy-surface rounded="top" elevation="1" type="containerHighest" class="sticky top-0 z-10">
					<schmancy-grid align="center" class="px-4 py-3" .cols=${this.cols} gap="md" rows="1fr">
						${this.columns.map(
							column => html`
								<div
									class=${this.classMap(columnHeadClasses(column))}
									@click=${() => (this.sortable && column.sortable !== false ? this.toggleSort(column) : null)}
								>
									<schmancy-typography align=${column.align ?? 'left'} weight=${column.weight ?? 'bold'}>
										${column.name}
									</schmancy-typography>
									${this.renderSortIndicator(column)}
								</div>
							`,
						)}
					</schmancy-grid>
				</schmancy-surface>

				${this.filteredData.length > 0
					? html`
							<lit-virtualizer
								scroller
								class="w-full h-full relative overflow-auto"
								.items=${this.filteredData}
								.renderItem=${(item: T, index: number) =>
									html`
										<schmancy-table-row
											class="w-full border-b border-solid border-outlineVariant"
											.columns=${this.columns}
											.item=${item}
											cols=${this.cols}
											@click=${() => {
												const detail = { item, index }
												this.dispatchEvent(
													new CustomEvent('click', {
														detail,
														bubbles: true,
														composed: true,
													}),
												)
											}}
										></schmancy-table-row>
									` as TemplateResult}
							></lit-virtualizer>
						`
					: html`
							<div class="flex items-center justify-center w-full h-full p-8 text-center">
								<schmancy-typography type="body" token="lg"> No data available </schmancy-typography>
							</div>
						`}
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-table': SchmancyDataTable
	}
}
