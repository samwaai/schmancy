import '@lit-labs/virtualizer'
import { $LitElement } from '@mixins/litElement.mixin'
import { html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './row' // Import the schmancy-table-row component

// Define a generic TableColumn interface.
// The `key` is now a key of T, and the render function accepts T.
export interface TableColumn<T extends Record<string, any> = any> {
	name: string
	key?: keyof T // Key to access the property on the data object.
	align?: 'left' | 'right' | 'center'
	weight?: 'normal' | 'bold'
	render?: (item: T) => TemplateResult | string | number // Custom render function for complex content
}

// Define an event detail interface for row events.
export interface RowEventDetail<T> {
	item: T
	index: number
}

@customElement('schmancy-table-v2')
export class SchmancyDataTable<T extends Record<string, any> = any> extends $LitElement() {
	@property({ type: Array, attribute: false })
	columns: TableColumn<T>[] = []

	@property({ type: Array, attribute: false })
	data: T[] = []

	// The keyField is now of type keyof T. You may need to adjust the default if needed.
	@property({ type: String })
	keyField: keyof T = 'id' as keyof T

	@property({ type: String })
	cols: string = '1fr'

	@property({ type: Array }) actions: Array<{ name: string; action: (item: T) => void }> = []

	// Helper to handle row events.
	private handleRowEvent(eventName: 'row-click' | 'edit' | 'delete', e: CustomEvent<RowEventDetail<T>>) {
		this.dispatchEvent(
			new CustomEvent<RowEventDetail<T>>(eventName, {
				detail: e.detail,
				bubbles: true,
				composed: true,
			}),
		)
	}

	render(): TemplateResult {
		return html`
			<schmancy-surface fill="all" type="container" rounded="all" elevation="2">
				<schmancy-grid class="h-full w-full" cols="1fr" rows="auto 1fr">
					<schmancy-surface rounded="top" elevation="1" type="containerHighest" class="sticky top-0 z-10">
						<schmancy-grid align="center" class="px-4 py-3" .cols=${this.cols} gap="md" rows="1fr">
							${this.columns.map(
								column => html`
									<schmancy-typography align=${column.align ?? 'left'} weight=${column.weight ?? 'bold'}>
										${column.name}
									</schmancy-typography>
								`,
							)}
						</schmancy-grid>
					</schmancy-surface>

					<lit-virtualizer
						scroller
						class="w-full h-full relative overflow-auto"
						.items=${this.data}
						.renderItem=${(item: T, index: number) =>
							html`
								<schmancy-table-row
									.actions=${this.actions}
									class="w-full border-b-1 border-solid border-outlineVariant"
									.columns=${this.columns}
									.item=${item}
									cols=${this.cols}
									@edit=${(e: CustomEvent<RowEventDetail<T>>) => {
										e.detail.item = item
										e.detail.index = index
										this.handleRowEvent('edit', e)
									}}
									@delete=${(e: CustomEvent<RowEventDetail<T>>) => {
										e.detail.item = item
										e.detail.index = index
										this.handleRowEvent('delete', e)
									}}
								></schmancy-table-row>
							` as TemplateResult}
					></lit-virtualizer>
				</schmancy-grid>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-table-v2': SchmancyDataTable
	}
}
