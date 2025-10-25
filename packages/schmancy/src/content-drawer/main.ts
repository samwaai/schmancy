import { consume } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { PropertyValueMap, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyEvents } from '..'
import {
	SchmancyContentDrawerMaxHeight,
	SchmancyContentDrawerMinWidth,
	SchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetMode,
} from './context'
import { when } from 'lit/directives/when.js'

@customElement('schmancy-content-drawer-main')
export class SchmancyContentDrawerMain extends $LitElement(css`
	:host {
		display: block;
		overflow: hidden;
	}
`) {
	@property({ type: Number })
	minWidth: number

	@consume({ context: SchmancyContentDrawerMinWidth, subscribe: true })
	drawerMinWidth: typeof SchmancyContentDrawerMinWidth.__context__

	@consume({ context: SchmancyContentDrawerSheetMode, subscribe: true })
	@state()
	mode: TSchmancyContentDrawerSheetMode

	@consume({ context: SchmancyContentDrawerMaxHeight, subscribe: true })
	@state()
	maxHeight: string

	connectedCallback(): void {
		super.connectedCallback()
		if (this.minWidth) this.drawerMinWidth.main = this.minWidth
		else this.minWidth = this.drawerMinWidth.main
	}

	protected update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.update(changedProperties)
		if (changedProperties.has('minWidth') && this.minWidth) {
			this.drawerMinWidth.main = this.minWidth
			this.dispatchEvent(new CustomEvent(SchmancyEvents.ContentDrawerResize, { bubbles: true, composed: true }))
		}
	}

	render() {
		const styles = {
			minWidth: `${this.minWidth}px`,
			maxHeight: this.maxHeight,
		}

		const gridClasses = [
			'grid h-full relative overflow-scroll',
			'grid-flow-col auto-cols-max',
			'grid-rows-[1fr]',
			'items-stretch justify-items-stretch',
			this.mode === 'push' ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr]'
		].join(' ')

		return html`
			<section class="relative inset-0 h-full">
				<div class=${gridClasses}>
					<section style=${this.styleMap(styles)}>
						<slot></slot>
					</section>
				</div>
				${when(
					this.mode === 'push',
					() => html` <schmancy-divider class="absolute right-0 top-0" orientation="vertical"></schmancy-divider>`,
				)}
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-main': SchmancyContentDrawerMain
	}
}
