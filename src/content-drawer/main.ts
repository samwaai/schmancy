import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { PropertyValueMap, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyEvents } from '..'
import { SchmancyContentDrawerMinWidth } from './context'

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
			<section style=${this.styleMap(styles)}>
				<slot></slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-main': SchmancyContentDrawerMain
	}
}
