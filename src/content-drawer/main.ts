import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { PropertyValueMap, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyEvents } from '..'
import {
	SchmancyContentDrawerMinWidth,
	SchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetMode,
} from './context'
import { when } from 'lit/directives/when.js'

@customElement('schmancy-content-drawer-main')
export class SchmancyContentDrawerMain extends $LitElement(css`
	:host {
		display: flow;
		overflow-y: auto;
	}
`) {
	@property({ type: Number })
	minWidth

	@consume({ context: SchmancyContentDrawerMinWidth, subscribe: true })
	drawerMinWidth: typeof SchmancyContentDrawerMinWidth.__context__

	@consume({ context: SchmancyContentDrawerSheetMode, subscribe: true })
	@state()
	mode: TSchmancyContentDrawerSheetMode

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
		}
		return html`
			<schmancy-grid
				class="h-full"
				cols="${this.mode === 'push' ? 'auto 1fr' : '1fr'}"
				rows="1fr"
				flow="col"
				align="stretch"
				justify="stretch"
			>
				<section style=${this.styleMap(styles)}>
					<slot></slot>
				</section>
				${when(
					this.mode === 'push',
					() => html` <schmancy-divider class="py-[8px]" orientation="vertical"></schmancy-divider>`,
				)}
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-main': SchmancyContentDrawerMain
	}
}
