import { SchmancyElement } from '@mixins/index'
import { css, html, nothing, svg } from 'lit'
import { customElement, state } from 'lit/decorators.js'

declare global {
  interface Window {
    __siIcons?: Record<string, string>
  }
}

/**
 * @element schmancy-icon
 * Renders a Material Symbol inline as SVG — path data comes from
 * window.__siIcons populated by the schmancy-icons Vite plugin.
 *
 * Size: set font-size on the host via Tailwind (e.g. class="text-2xl").
 * Color: inherits currentColor.
 * Active fill: use the "-fill" variant name: "home-fill".
 *
 * Usage:
 *   <schmancy-icon>home</schmancy-icon>
 *   <schmancy-icon class="text-lg text-primary-default">delete</schmancy-icon>
 *   <schmancy-icon>${active ? 'home-fill' : 'home'}</schmancy-icon>
 */
@customElement('schmancy-icon')
export default class SchmancyIcon extends SchmancyElement {
	static styles = [css`
		:host {
			display: inline-flex;
			place-items: center;
			place-content: center;
			font-size: 24px;
			width: 1em;
			height: 1em;
			flex-shrink: 0;
			color: inherit;
		}

		svg {
			width: 100%;
			height: 100%;
			fill: currentColor;
			overflow: visible;
		}
	`]

	@state() private _name = ''

	private _observer?: MutationObserver

	override connectedCallback(): void {
		super.connectedCallback()
		this._name = this.textContent?.trim() ?? ''
		this._observer = new MutationObserver(() => {
			this._name = this.textContent?.trim() ?? ''
		})
		this._observer.observe(this, { childList: true, characterData: true, subtree: true })
		this.setAttribute('aria-hidden', 'true')
		this.setAttribute('translate', 'no')
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback()
		this._observer?.disconnect()
	}

	protected override render(): unknown {
		const path = window.__siIcons?.[this._name]
		return html`
			<slot style="display:none"></slot>
			${path
				? html`<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
						${svg`<path d="${path}"/>`}
					</svg>`
				: nothing}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon': SchmancyIcon
	}
}
