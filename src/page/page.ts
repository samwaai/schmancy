import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../layout/scroll/scroll'
import { fullHeight } from '../directives/height'

/**
 * Native mobile-like page container.
 * Prevents double-tap zoom, pull-to-refresh, rubber-banding.
 *
 * @element schmancy-page
 *
 * @example
 * html`
 *   <schmancy-page rows="1fr_2fr_auto">
 *     <header>App Bar</header>
 *     <main>Scrollable content</main>
 *     <footer>Navigation</footer>
 *   </schmancy-page>
 * `
 */
@customElement('schmancy-page')
export class SchmancyPage extends $LitElement(css`
	:host {
		touch-action: manipulation;
		overscroll-behavior: none;
		-webkit-tap-highlight-color: transparent;
	}
`) {
	/** Custom grid-template-rows using underscores (e.g. "1fr_2fr_auto") */
	@property({ type: String })
	rows = 'auto_1fr_auto'

	@property({ type: Boolean, attribute: 'show-scrollbar' })
	showScrollbar = false

	@property({ type: Boolean, attribute: 'no-select' })
	noSelect = false

	connectedCallback() {
		super.connectedCallback()
		// Auto-assign semantic elements to slots
		this.querySelectorAll(':scope > header').forEach(el => el.setAttribute('slot', 'header'))
		this.querySelectorAll(':scope > footer').forEach(el => el.setAttribute('slot', 'footer'))
	}

	protected render() {
		return html`
			<section
				${fullHeight()}
				class=${this.classMap({
					'grid overflow-hidden min-h-dvh': true,
					'select-none': this.noSelect,
				})}
				style="grid-template-rows: ${this.rows.replace(/_/g, ' ')}"
			>
				<slot name="header"></slot>
				<schmancy-scroll ?hide=${!this.showScrollbar}><slot></slot></schmancy-scroll>
				<schmancy-scroll ?hide=${!this.showScrollbar}>
					<slot name="footer"></slot>
				</schmancy-scroll>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-page': SchmancyPage
	}
}
