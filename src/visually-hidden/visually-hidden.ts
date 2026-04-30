import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Hides content visually while keeping it in the accessibility tree. Use for
 * screen-reader-only labels, supplemental descriptions, and live-region text
 * that sighted users don't need to see.
 *
 * Uses the WCAG-recommended clip pattern rather than `display: none` or
 * `visibility: hidden` so assistive tech still reads the content.
 *
 * @element schmancy-visually-hidden
 * @slot - Content hidden from sighted users but exposed to assistive tech.
 */
@customElement('schmancy-visually-hidden')
export class SchmancyVisuallyHidden extends SchmancyElement {
	static styles = [css`
	:host {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
`];
	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-visually-hidden': SchmancyVisuallyHidden
	}
}
