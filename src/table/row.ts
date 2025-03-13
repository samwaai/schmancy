import { $LitElement } from '@mixins/litElement.mixin'
import { css, html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { TableColumn } from './table' //Import TableColumn interface.

@customElement('schmancy-table-row')
export class SchmancyTableRow extends $LitElement(css`
	:host {
		display: block;
		z-index: -1;
	}
`) {
	@property({ type: Array, attribute: false })
	columns: TableColumn[] = []

	@property({ type: Object, attribute: false }) //Important to use object for complex properties
	item: any

	@property({ type: String })
	cols: string = '1fr'

	@property({
		type: Array,
	})
	actions: Array<{ name: string; action: (item: any) => void }> | undefined
	render(): TemplateResult {
		return html`
			<schmancy-list-item
				@click=${() => {
					this.dispatchEvent(
						new CustomEvent('row-click', {
							detail: this.item,
							bubbles: true,
							composed: true,
						}),
					)
				}}
				class="w-full"
			>
				<schmancy-grid .cols=${this.cols} align="center" gap="md">
					${this.columns.map(
						column => html`
							<div class="overflow-hidden text-ellipsis">
								<schmancy-typography
									align="${column.align || 'left'}"
									maxLines="2"
									weight="${column.weight || 'normal'}"
								>
									${column.render ? column.render(this.item) : column.key ? this.item?.[column.key] : ''}
								</schmancy-typography>
							</div>
						`,
					)}
					<sch-flex
						class="min-w-fit block"
						flow="row-dense"
						.hidden=${Array.isArray(this.actions) && this.actions.length === 0}
					>
						${repeat(
							this.actions ?? [],
							({ name }) => name,
							({ name, action }) => html`
								<schmancy-icon-button
									@click=${(e: Event) => {
										e.stopPropagation()
										action(this.item)
									}}
								>
									${name}
								</schmancy-icon-button>
							`,
						)}
					</sch-flex>
					<!-- <schmancy-menu .hidden=${Array.isArray(this.actions) && this.actions.length === 0}>
						${repeat(
						this.actions ?? [],
						({ name }) => name,
						({ name, action }) => html`
							<schmancy-menu-item
								class="z-[10000]"
								@click=${(e: Event) => {
									e.stopPropagation()
									action(this.item)
								}}
							>
								${name}
							</schmancy-menu-item>
						`,
					)}
					</schmancy-menu> -->
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
