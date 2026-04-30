import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Renders a keyboard shortcut hint (e.g. `⌘ K`, `Ctrl+C`). Semantically a
 * `<kbd>` element for screen readers; visually styled as a pressed key.
 *
 * Compose multiple instances for combinations:
 * ```html
 * <schmancy-kbd>⌘</schmancy-kbd> + <schmancy-kbd>K</schmancy-kbd>
 * ```
 *
 * @element schmancy-kbd
 * @slot - The key label (e.g. `⌘`, `Shift`, `K`).
 * @attr size - 'sm' | 'md'. Default 'md'.
 * @csspart base - The inner native `<kbd>` element.
 */
@customElement('schmancy-kbd')
export class SchmancyKbd extends SchmancyElement {
	static styles = [css`
	:host {
		display: inline-block;
		vertical-align: middle;
	}
	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--_ksize, 1.5rem);
		height: var(--_ksize, 1.5rem);
		padding: 0 0.375rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: var(--_kfont, 0.75rem);
		font-weight: 500;
		line-height: 1;
		color: var(--schmancy-sys-color-surface-on, #1d1b20);
		background: var(--schmancy-sys-color-surface-container, #f3f0f7);
		border: 1px solid var(--schmancy-sys-color-outline-variant, #cac4d0);
		border-radius: 0.375rem;
		box-shadow: inset 0 -1px 0 var(--schmancy-sys-color-outline-variant, #cac4d0);
		white-space: nowrap;
	}
	:host([size='sm']) kbd {
		--_ksize: 1.25rem;
		--_kfont: 0.6875rem;
	}
`];
	@property({ type: String, reflect: true }) size: 'sm' | 'md' = 'md'

	render() {
		return html`<kbd part="base"><slot></slot></kbd>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-kbd': SchmancyKbd
	}
}
