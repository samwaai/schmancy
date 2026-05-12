import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-icon')
export default class SchmancyIcon extends SchmancyElement {
	static styles = [css`
		:host {
			font-family: 'Material Symbols Outlined';
			font-size: 24px;
			width: 1em;
			height: 1em;
			color: inherit;
			font-variation-settings: inherit;
			font-weight: 400;
			display: inline-flex;
			font-style: normal;
			place-items: center;
			place-content: center;
			line-height: 1;
			overflow: hidden;
			letter-spacing: normal;
			text-transform: none;
			user-select: none;
			white-space: nowrap;
			flex-shrink: 0;
			-webkit-font-smoothing: antialiased;
			text-rendering: optimizeLegibility;
		}

		::slotted(svg) {
			fill: currentColor;
		}

		::slotted(*) {
			height: 100%;
			width: 100%;
		}
	`]

	override connectedCallback(): void {
		super.connectedCallback()
		const ariaHidden = this.getAttribute('aria-hidden')
		if (ariaHidden === 'false') {
			this.removeAttribute('aria-hidden')
			return
		}
		this.setAttribute('aria-hidden', 'true')
		this.setAttribute('translate', 'no')
	}

	protected override render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon': SchmancyIcon
	}
}
