import { $LitElement } from '@mixins/litElement.mixin'
import { html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TableColumn } from './table' // Import TableColumn interface with updated types

@customElement('schmancy-table-row')
export class SchmancyTableRow<T extends Record<string, any> = any> extends $LitElement() {
	@property({ type: Array, attribute: false })
	columns: TableColumn<T>[] = []

	@property({ type: Object, attribute: false })
	item!: T

	@property({ type: String })
	cols: string = this.columns.map(() => '1fr').join(' ')

	/**
	 * Renders a cell based on column configuration.
	 * Uses custom render function if provided, otherwise extracts data from item.
	 */
	private renderCell(column: TableColumn<T>): TemplateResult {
		// Use the render function if provided
		if (column.render) {
			return html`
				<div class="overflow-hidden text-ellipsis">
					<schmancy-typography align="${column.align || 'left'}" maxLines="2" weight="${column.weight || 'normal'}">
						${column.render(this.item)}
					</schmancy-typography>
				</div>
			`
		}

		// Otherwise extract data using the key if available
		const value = column.key ? this.item[column.key] : ''

		return html`
			<div class="overflow-hidden text-ellipsis">
				<schmancy-typography align="${column.align || 'left'}" maxLines="2" weight="${column.weight || 'normal'}">
					${value}
				</schmancy-typography>
			</div>
		`
	}

	render(): TemplateResult {
		return html`
			<schmancy-list-item class="w-full">
				<schmancy-grid .cols=${this.cols} align="center" gap="md">
					${this.columns.map(column => this.renderCell(column))}
				</schmancy-grid>
			</schmancy-list-item>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-table-row': SchmancyTableRow
	}
}
