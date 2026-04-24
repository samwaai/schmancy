import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { $dialog } from '../dialog/dialog-service'

/**
 * Single item inside a schmancy-menu. Auto-dismisses the menu dialog on click — attach your action handler to `@click` and it just works.
 *
 * @element schmancy-menu-item
 * @summary Always nested inside schmancy-menu. The click handler runs before the dialog closes, so `@click=${() => doThing()}` is the full pattern.
 * @example
 * <schmancy-menu-item @click=${() => archive()}>
 *   <schmancy-icon slot="leading">archive</schmancy-icon>
 *   Archive
 * </schmancy-menu-item>
 * @platform menuitem click - Wraps schmancy-list-item with auto-dismiss. Degrades to a styled `<button role="menuitem">` if the tag never registers.
 * @slot - The item label and optional icons.
 */
@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends $LitElement(css`
	:host {
		display: block;
	}
`) {

	protected render(): unknown {
		return html`
			<schmancy-list-item @click=${() => $dialog.dismiss()}>
				<slot></slot>
			</schmancy-list-item>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-menu-item': SchmancyMenuItem
	}
}
